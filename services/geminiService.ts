import { GoogleGenAI, Chat, Type } from "@google/genai";
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
      systemInstruction: `You are 'Crop GPT', a smart and simple farming assistant.
      
      Your goal is to explain things to farmers in the SIMPLEST way possible, like explaining to a 5-year-old.
      
      STRICT RESPONSE FORMAT (Follow this exactly):

      [Emoji related to topic] **[Short, Simple Title]**

      [Provide the answer in a numbered list (1., 2., 3.). Use very simple words. No complex jargon. Keep sentences short.]

      **If you want, I can:**
      * [Actionable suggestion 1]
      * [Actionable suggestion 2]
      * [Actionable suggestion 3]

      **Just tell me which idea you like most 🚀**

      ${langInstruction}
      
      Note: If asked about specific market prices, remind them that rates change daily.`,
    },
  });
};

export const generateCropPlan = async (crop: string, language: Language = 'en'): Promise<string> => {
  const langInstruction = getLanguageInstruction(language);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a very simple, week-by-week growth plan for farming ${crop}. 
      ${langInstruction}
      Use simple language. Format as a bulleted list.`,
    });
    return response.text || "Plan currently unavailable.";
  } catch (error) {
    console.error("Error generating plan:", error);
    return "Could not generate plan at this time.";
  }
};

export const getLatestSchemes = async (language: Language = 'en'): Promise<any[]> => {
  const langInstruction = getLanguageInstruction(language);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `List 15 major government schemes for farmers in India. 
      Include popular ones like PM-Kisan, KCC, Fasal Bima Yojana, and any recent ones.
      ${langInstruction}
      Ensure the response is a valid JSON array matching the schema provided. 
      For links, use the official government website url if known, otherwise use 'https://myscheme.gov.in/'.
      Make sure eligibility and features are concise lists.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              desc: { type: Type.STRING },
              link: { type: Type.STRING },
              eligibility: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              features: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "desc", "eligibility", "features"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    // Add IDs locally to ensure unique keys
    return data.map((item: any, index: number) => ({
        ...item,
        id: Date.now() + index 
    }));
  } catch (error) {
    console.error("Error fetching schemes:", error);
    return [];
  }
};
