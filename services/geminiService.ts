import { GoogleGenAI, Type } from "@google/genai";
import { ConceptResponse } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSiteConcept = async (userIdea: string): Promise<ConceptResponse> => {
  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `
      Ты — CODEXAI, креативный директор авангардного цифрового агентства.
      Твоя цель — превратить простую бизнес-идею пользователя в дорогой, артистичный и уникальный веб-концепт.
      Будь дерзким, абстрактным и изысканным. Избегай корпоративного жаргона. Используй слова "эфирный", "брутализм", "кинетический", "иммерсивный".
      Отвечай ТОЛЬКО на русском языке.
    `;

    const prompt = `Идея клиента: "${userIdea}". Создай питч концепта.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tagline: {
              type: Type.STRING,
              description: "Короткий, мощный, абстрактный слоган для сайта (3-5 слов)."
            },
            visualDirection: {
              type: Type.STRING,
              description: "Описание визуального стиля (цвета, текстуры, настроение) в 1-2 предложениях."
            },
            features: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 уникальные, нестандартные цифровые фичи (например, 'WebGL физика жидкости', 'Звуковая навигация')."
            }
          },
          required: ["tagline", "visualDirection", "features"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ConceptResponse;

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      tagline: "Ошибка в Коде",
      visualDirection: "Статический шум. Соединение прервано.",
      features: ["Ручная перезагрузка", "Аналоговый режим", "Проверка систем"]
    };
  }
};