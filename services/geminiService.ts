
import { GoogleGenAI, Type } from "@google/genai";

export const generateContent = async (prompt: string, type: 'blog' | 'job') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = type === 'blog' 
    ? "You are a professional tech blogger. Generate a structured blog post based on the title provided. Return only the content in Markdown."
    : "You are an HR specialist. Generate a detailed job description including responsibilities and requirements based on the job title. Return only the content in Markdown.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Failed to generate content. Please try again.";
  }
};
