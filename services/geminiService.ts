
import { GoogleGenAI } from "@google/genai";
import { Attachment, TutorMode } from '../types';
import { getSystemInstruction } from '../constants';

// Removed broken default key to force user input for stability
const STORAGE_KEY = 'gemini_api_key';

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
  
  return undefined;
};

// Clear API Key
export const clearApiKey = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// Validate Key
export const validateApiKey = async (key: string): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    // Attempt a minimal generation to test the key
    await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { parts: [{ text: "hi" }] },
    });
    return true;
  } catch (error) {
    console.error("API Key Validation Failed:", error);
    return false;
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

    // Primary model attempt: Gemini 2.0 Flash (Stable & Fast)
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: {
          parts: parts
        },
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7, 
        }
      });
      return response.text || "Xin lỗi, tôi không thể tạo câu trả lời vào lúc này.";
    } catch (primaryError) {
      console.warn("Gemini 2.0 Flash failed. Attempting fallback to Pro/Lite.", primaryError);
      
      // Fallback model: Gemini 1.5 Pro (Better reasoning if 2.0 fails)
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: {
          parts: parts
        },
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7, 
        }
      });
      return response.text || "Xin lỗi, tôi không thể tạo câu trả lời vào lúc này.";
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    // @ts-ignore
    const msg = error?.message || '';
    
    if (msg.includes('API_KEY_INVALID') || msg.includes('API Key not found')) {
        clearApiKey(); // Clear invalid key to force re-entry
        return `🚫 **API Key Không Hợp Lệ**\n\nKey hiện tại đã bị từ chối. Vui lòng tải lại trang và nhập Key mới.`;
    }

    return `**Lỗi kết nối với Gia sư AI:**\n\n${msg}\n\nVui lòng kiểm tra kết nối mạng.`;
  }
};
