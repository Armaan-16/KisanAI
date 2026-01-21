import { GoogleGenAI, Chat } from "@google/genai";
import { Language } from '../types';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getLanguageInstruction = (lang: Language) => {
  switch (lang) {
    case 'hi': return "Reply in Hindi language using Devanagari script.";
    case 'or': return "Reply in Odia language.";
    default: return "Reply in English.";
  }
};

export const createChatSession = (language: Language = 'en'): Chat => {
  const langInstruction = getLanguageInstruction(language);
  
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are an expert agricultural assistant named "Crop GPT". 
      Your goal is to help farmers in India with advice on crops, weather, market prices, and government schemes. 
      Keep answers concise, practical, and easy to understand. 
      ${langInstruction}
      If asked about prices, remind them that market rates fluctuate daily.
      Be friendly and encouraging.`,
    },
  });
};

export const generateCropPlan = async (crop: string, language: Language = 'en'): Promise<string> => {
  const langInstruction = getLanguageInstruction(language);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a concise, practical week-wise growth plan for farming ${crop} in India. 
      ${langInstruction}
      Format the output as a clean list (e.g., "Weeks 1-4: Preparation...", "Weeks 5-8: ..."). 
      Focus on key actions for the farmer. Do not use markdown bolding too heavily.`,
    });
    return response.text || "Plan currently unavailable.";
  } catch (error) {
    console.error("Error generating plan:", error);
    return "Could not generate plan at this time. Please check your connection.";
  }
};
