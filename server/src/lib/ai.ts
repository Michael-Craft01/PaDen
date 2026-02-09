import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// User provided key as "Nexa" which is a Google API Key
const apiKey = process.env.Nexa || process.env.AI_API_KEY;

if (!apiKey) {
    console.warn("⚠️ AI Key (Nexa or AI_API_KEY) is missing. AI features will not work.");
}

// Initialize Google AI
const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');
const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" }); // Defaulting to 1.5-flash for speed/cost, or user's preference

export async function generateResponse(userMessage: string, systemContext: string) {
    try {
        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: systemContext + "\n\nUser Message: " + userMessage }] }
            ],
            generationConfig: {
                maxOutputTokens: 200,
                temperature: 0.7,
            }
        });

        const response = result.response;
        return response.text();
    } catch (error: any) {
        console.error('AI Error:', error);
        return "I'm having trouble thinking right now. Please try again later.";
    }
}
