
import { GoogleGenAI } from "@google/genai";
import { Attachment, TutorMode } from '../types';
import { getSystemInstruction } from '../constants';

const STORAGE_KEY = 'gemini_api_key';
// Key mặc định đã bị vô hiệu hóa vì lý do bảo mật. 
// Người dùng cần nhập key riêng của họ thông qua giao diện UI.
const DEFAULT_API_KEY = '';

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
  
  // 4. Return the hardcoded default key (Empty string forces UI prompt)
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
    // Use gemini-2.5-flash-latest for validation as it is widely available
    await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest', 
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
           `Vui lòng nhập API Key trong phần Cài đặt hoặc tải lại trang để nhập key mới.`;
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
    // 1. Primary: Gemini 2.5 Flash Latest (Fast & Capable)
    // 2. Secondary: Gemini 2.5 Flash (Fallback)
    
    const modelsToTry = [
        'gemini-2.5-flash-latest', 
        'gemini-2.5-flash' 
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
    // @ts-ignore
    const msg = error?.message || '';
    
    if (msg.includes('API_KEY_INVALID') || msg.includes('API Key not found') || msg.includes('403') || msg.includes('PERMISSION_DENIED')) {
        // Specific handling for the "Leaked Key" or "Permission Denied" error
        clearApiKey(); // Clear invalid key to force re-entry
        return `🚫 **API Key Đã Bị Chặn**\n\nKey hiện tại đã bị Google vô hiệu hóa (do lộ key hoặc hết hạn mức).\n\nHệ thống đã tự động xóa key lỗi. Vui lòng **Tải lại trang (F5)** để nhập API Key mới.`;
    }

    return `**Lỗi kết nối với Gia sư AI:**\n\n${msg}\n\nVui lòng kiểm tra kết nối mạng hoặc thử lại sau.`;
  }
};
