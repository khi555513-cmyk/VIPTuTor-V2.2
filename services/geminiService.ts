
import { Attachment, TutorMode } from '../types';
import { getSystemInstruction } from '../constants';

// We simulate getting an API key because the rest of the app might call this.
// For Puter.js/Claude, we don't need a real key.
export const getApiKey = (): string | undefined => {
  return "PUTER_CLAUDE_FREE_ACCESS";
};

// Always valid because Puter handles auth via "User-Pays" (or free tier)
export const validateApiKey = async (apiKey: string): Promise<{ valid: boolean; error?: string }> => {
  return { valid: true };
};

export const generateTutorResponse = async (
  text: string,
  attachments: Attachment[],
  mode: TutorMode
): Promise<string> => {
  try {
    if (!window.puter || !window.puter.ai) {
      throw new Error("Puter.js library not loaded. Please refresh the page.");
    }

    let promptText = "";
    const systemInstruction = getSystemInstruction(mode);

    // 1. Construct the Prompt with System Instruction
    // Claude via Puter simple chat interface works best with a combined prompt string
    promptText += `System Instructions:\n${systemInstruction}\n\n`;

    // 2. Process Attachments (Text Only for stability)
    // Puter.js simple interface documents text-only prompts primarily.
    // To ensure stability, we extract text content from attachments and append to prompt.
    // Image analysis is skipped to avoid API errors with the Puter wrapper.
    if (attachments && attachments.length > 0) {
      promptText += `\n--- ATTACHED CONTEXT ---\n`;
      attachments.forEach(att => {
        if (att.isText && att.data) {
           promptText += `\n[File: ${att.name}]:\n${att.data}\n`;
        } else if (att.mimeType.startsWith('image/')) {
           promptText += `\n[Image: ${att.name}] (Image analysis is currently optimized for text context only in this version)\n`;
        }
      });
      promptText += `\n--- END CONTEXT ---\n\n`;
    }

    // 3. Add User Message
    promptText += `User Query:\n${text}`;

    // 4. Select Model based on Mode
    // Using Claude 4.5 models as requested for maximum performance
    let modelName = 'claude-sonnet-4-5'; // Default balanced model
    
    if (mode === TutorMode.THEORY || mode === TutorMode.TEST_PREP) {
       modelName = 'claude-opus-4-5'; // High intelligence for complex theory/exams
    } else if (mode === TutorMode.GAME) {
       modelName = 'claude-sonnet-4-5'; // Fast and creative
    }

    // 5. Call Puter AI
    const response = await window.puter.ai.chat(promptText, { model: modelName });
    
    // 6. Extract Text
    if (response && response.message && response.message.content && response.message.content.length > 0) {
        return response.message.content[0].text;
    } else {
        throw new Error("Empty response from AI provider.");
    }

  } catch (error: any) {
    console.error("Claude/Puter API Error:", error);
    return `**Lỗi kết nối AI (Claude):**\n\n${error.message || "Unknown error"}\n\nVui lòng thử lại sau.`;
  }
};
