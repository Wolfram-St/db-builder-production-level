// src/lib/aiService.ts

const API_URL = import.meta.env.VITE_AI_API_URL || "http://localhost:8000";

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
  images?: string[]; // base64 encoded images
}

export interface AIResponse {
  message: string;
  actions?: AIAction[];
}

export interface AIAction {
  type: "create_table" | "update_table" | "delete_table" | "create_relation" | "update_relation" | "delete_relation" | "layout";
  data: any;
}

export const AIService = {
  /**
   * Send a chat message to the AI backend
   */
  chat: async (messages: AIMessage[], context?: any): Promise<AIResponse> => {
    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          context,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || "AI service failed");
      }

      return await response.json();
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  /**
   * Generate schema from text description
   */
  generateFromDescription: async (description: string): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/ai/generate-schema`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate schema");
      }

      return await response.json();
    } catch (error) {
      console.error("Generate Schema Error:", error);
      throw error;
    }
  },

  /**
   * Analyze uploaded image or file
   */
  analyzeAttachment: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/ai/analyze-file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze attachment");
      }

      const result = await response.json();
      return result.analysis || "File analyzed successfully";
    } catch (error) {
      console.error("Analyze Attachment Error:", error);
      throw error;
    }
  },
};
