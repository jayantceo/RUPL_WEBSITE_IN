import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateCaption = async (base64Image: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning mock response.");
    return "This is a beautiful image! #vibes #rupl (AI Key Missing)";
  }

  try {
    // Extract base64 data if it includes the prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', 
            },
          },
          {
            text: 'Write a short, engaging, cool social media caption for this image. Add 2-3 relevant hashtags. Keep it under 30 words.',
          },
        ],
      },
    });

    return response.text || "Just sharing this moment! ✨";
  } catch (error) {
    console.error("Error generating caption:", error);
    return "Caught a vibe today. 📸";
  }
};
