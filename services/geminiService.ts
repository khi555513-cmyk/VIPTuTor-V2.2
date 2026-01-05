
import { GoogleGenAI } from "@google/genai";
import { Attachment, TutorMode } from '../types';
import { getSystemInstruction } from '../constants';

const STORAGE_KEY = 'gemini_api_key';
// Key mặc định được cung cấp bởi người dùng
const DEFAULT_API_KEY = 'AIzaSyDn3DH2UDFcf-vVMYez3G2E6czCjI8o_Mk';

// Helper to safely retrieve API Key
export const getApiKey = (): string | undefined => {
  // 1. Priority: Check Local Storage (User entered key via UI)
  if (typeof window !== 'undefined') {
    const storedKey = localStorage.getItem(STORAGE_KEY);
    if (storedKey && storedKey.trim().length > 0) {
      return storedKey;
    }
  }

  // 2. Check Vite Env (Standard for Vite apps)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }

  // 3. Fallback: Check Process Env (Legacy/Build time)
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore ReferenceError
  }
  
  // 4. Return the hardcoded default key
  return DEFAULT_API_KEY;
};

// Clear API Key
export const clearApiKey = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// Validate Key
export const validateApiKey = async (key: string): Promise<{valid: boolean, error?: string}> => {
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    // Use gemini-1.5-flash for validation as it is the most stable/available model for connection checks
    await ai.models.generateContent({
      model: 'gemini-1.5-flash', 
      contents: { parts: [{ text: "ping" }] },
    });
    return { valid: true };
  } catch (error: any) {
    console.error("API Key Validation Failed:", error);
    let msg = "Kết nối thất bại.";
    if (error.message) {
        if (error.message.includes('API_KEY_INVALID')) msg = "API Key không hợp lệ.";
        else if (error.message.includes('403')) msg = "API Key không có quyền truy cập hoặc hết hạn mức.";
        else msg = error.message;
    }
    return { valid: false, error: msg };
  }
};

export const generateTutorResponse = async (
  text: string,
  attachments: Attachment[],
  mode: TutorMode
): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    return `⚠️ **CHƯA CÓ API KEY**\n\n` +
           `Hệ thống chưa tìm thấy cấu hình API Key hợp lệ.\n` +
           `Vui lòng nhập API Key trong phần Cài đặt hoặc popup khởi động để bắt đầu học tập.`;
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
    // 1. Primary: Gemini 3 Flash Preview (As per latest coding guidelines)
    // 2. Secondary: Gemini 2.0 Flash Exp (Recent powerful model)
    // 3. Fallback: Gemini 1.5 Pro (Reliable stable model)
    
    const modelsToTry = [
        'gemini-3-flash-preview', 
        'gemini-2.0-flash-exp', 
        'gemini-1.5-pro'
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

  } catch (error) {
    console.error("Gemini API Error:", error);
    // @ts-ignore
    const msg = error?.message || '';
    
    if (msg.includes('API_KEY_INVALID') || msg.includes('API Key not found') || msg.includes('400')) {
        clearApiKey(); // Clear invalid key to force re-entry
        return `🚫 **API Key Không Hợp Lệ**\n\nKey hiện tại đã bị từ chối hoặc không có quyền truy cập model. Vui lòng tải lại trang và nhập Key mới.`;
    }

    return `**Lỗi kết nối với Gia sư AI:**\n\n${msg}\n\nVui lòng kiểm tra kết nối mạng hoặc thử lại sau.`;
  }
};
