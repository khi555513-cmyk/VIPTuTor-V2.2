
import { GoogleGenAI } from "@google/genai";
import { Attachment, TutorMode } from '../types';
import { getSystemInstruction } from '../constants';

const DEFAULT_API_KEY = 'AIzaSyBI4BP3mcdnuMhk0nqE-eXsTmt-jwumqE8';

// Helper to safely retrieve API Key
export const getApiKey = (): string | undefined => {
  // 0. Check Local Storage (User provided key via Modal)
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
       const storedKey = localStorage.getItem('gemini_api_key');
       if (storedKey) return storedKey;
    }
  } catch (e) {}

  // 1. Check Vite Env (Standard for Vite apps)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }

  // 2. Fallback: Check Process Env (Legacy/Build time)
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore ReferenceError
  }
  
  // 3. Return the hardcoded default key
  return DEFAULT_API_KEY;
};

export const validateApiKey = async (apiKey: string): Promise<{ valid: boolean; error?: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Minimal request to validate key using a stable model
    await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: { parts: [{ text: 'Ping' }] }
    });
    return { valid: true };
  } catch (error: any) {
    console.warn("API Key Validation Failed:", error);
    let errorMsg = error.message || "Unknown error";
    // Check for common auth errors
    if (errorMsg.includes('403') || errorMsg.includes('API key not valid') || errorMsg.includes('PERMISSION_DENIED')) {
        errorMsg = "API Key không hợp lệ hoặc không có quyền truy cập model.";
    }
    return { valid: false, error: errorMsg };
  }
};

export const generateTutorResponse = async (
  text: string,
  attachments: Attachment[],
  mode: TutorMode
): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    return `⚠️ **Lỗi Cấu Hình Hệ Thống**\n\n` +
           `Hệ thống chưa tìm thấy API Key.\n` +
           `Vui lòng cập nhật API Key trong phần Cài đặt hoặc liên hệ quản trị viên.`;
  }

  try {
    // Initialize the client per request
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const parts: any[] = [];
    let promptText = text;

    // Add attachments if any
    if (attachments && attachments.length > 0) {
      attachments.forEach(att => {
        // Safe guard against empty data
        if (!att.data) return;

        // If it's a text attachment (e.g. converted DOCX), append to prompt
        if (att.isText) {
          promptText += `\n\n[Attached Document Content - ${att.name || 'Doc'}]:\n${att.data}\n`;
        } 
        // If it's a regular supported binary (Image, PDF)
        else {
          try {
             // Remove data:image/png;base64, prefix if present for clean base64
             const base64Data = att.data.includes(',') ? att.data.split(',')[1] : att.data;
             if (base64Data) {
                parts.push({
                  inlineData: {
                    mimeType: att.mimeType,
                    data: base64Data
                  }
                });
             }
          } catch (err) {
             console.error("Error processing attachment:", err);
          }
        }
      });
    }

    // Add text prompt
    if (promptText) {
      parts.push({ text: promptText });
    } else if (parts.length === 0) {
       return "Vui lòng nhập câu hỏi hoặc tải lên hình ảnh để bắt đầu.";
    }

    const systemInstruction = getSystemInstruction(mode);

    // --- MODEL SELECTION STRATEGY ---
    // Use Gemini 2.0 Flash Exp as primary (Stable & Fast)
    // Fallback to Gemini 2.0 Pro Exp (Higher Intelligence)
    const modelsToTry = [
        'gemini-2.0-flash-exp',
        'gemini-2.0-pro-exp-02-05'
    ];

    let lastError;

    for (const model of modelsToTry) {
        try {
            const response = await ai.models.generateContent({
                model: model,
                contents: { parts: parts },
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7, 
                }
            });
            return response.text || "Xin lỗi, tôi không thể tạo câu trả lời vào lúc này.";
        } catch (error) {
            console.warn(`Model ${model} failed. Trying next...`, error);
            lastError = error;
            // Continue to next model
        }
    }

    // If all models fail, throw the last error
    throw lastError;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Robust error message extraction
    let errorMsg = '';
    if (error instanceof Error) {
        errorMsg = error.message;
    } else if (typeof error === 'object') {
        try {
            errorMsg = JSON.stringify(error);
        } catch (e) {
            errorMsg = String(error);
        }
    } else {
        errorMsg = String(error);
    }
    
    // Check for Leaked Key / Permission Denied (403) or Not Found (404)
    const isPermissionError = 
        errorMsg.includes('API_KEY_INVALID') || 
        errorMsg.includes('API Key not found') || 
        errorMsg.includes('403') || 
        errorMsg.includes('PERMISSION_DENIED') ||
        errorMsg.includes('leaked');

    if (isPermissionError) {
        return `🚫 **Lỗi Dịch Vụ AI**\n\nKhóa API hiện tại đã bị từ chối truy cập (Leaked/Expired/Permission Denied).\n\nVui lòng kiểm tra lại API Key trong cài đặt.`;
    }
    
    if (errorMsg.includes('404') || errorMsg.includes('NOT_FOUND')) {
         return `**Lỗi Mô Hình AI:**\n\nHệ thống không tìm thấy mô hình AI phù hợp (404). Có thể API Key của bạn không hỗ trợ các model mới nhất (Gemini 2.0 Flash).\n\nChi tiết lỗi: ${errorMsg}`;
    }

    return `**Lỗi kết nối với Gia sư AI:**\n\n${errorMsg}\n\nVui lòng kiểm tra kết nối mạng hoặc thử lại sau.`;
  }
};
