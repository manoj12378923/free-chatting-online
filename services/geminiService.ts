
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available as an environment variable
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

export const getIceBreaker = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a fun and lighthearted ice breaker question to start a conversation with someone new on a chat app. Keep it short, friendly, and under 15 words.",
            config: {
                temperature: 0.9,
                topK: 50,
                topP: 0.95,
                // Disable thinking for low latency
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const text = response.text.trim().replace(/"/g, ''); // Clean up quotes
        return text || "If you could have any superpower, what would it be?"; // Fallback
    } catch (error) {
        console.error("Error generating ice breaker with Gemini:", error);
        // Provide a generic but useful fallback question
        return "What's the best thing that happened to you today?";
    }
};
