
// FIX: Import Modality for image editing.
import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
};

export const analyzeImage = async (base64Image: string, mimeType: string) => {
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: {
            parts: [
                imagePart,
                { text: "Analyze this image to determine if it is AI-generated or a real photograph. Provide a probability score from 0 to 100 on how likely it is to be AI-generated and a brief explanation for your reasoning. Respond in JSON format." }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    is_ai_generated_probability: {
                        type: Type.NUMBER,
                        description: "A probability score from 0 to 100."
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "A brief explanation of the reasoning."
                    }
                },
                required: ["is_ai_generated_probability", "explanation"]
            }
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};

// FIX: Add the missing editImage function to support image editing.
export const editImage = async (base64Image: string, prompt: string, mimeType: string): Promise<string> => {
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    
    const candidate = response.candidates?.[0];
    if (candidate) {
        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
    }
    
    throw new Error("Could not edit image or no image was returned.");
};


export const createChatSession = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a helpful and friendly AI assistant. Provide concise and accurate answers.',
        },
    });
};
