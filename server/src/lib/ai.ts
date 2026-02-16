import { GoogleGenerativeAI } from '@google/generative-ai';
import { Property } from './propertySearch';

// Load API key from env
const apiKey = process.env.Gemini_Api_Key || process.env.Gemini_API_Key || process.env.AI_API_KEY;

if (!apiKey) {
    console.warn("⚠️ AI Key (Gemini_Api_Key) is missing. AI features will not work.");
}

// Initialize Google AI
const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');
const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

// ─── Types ──────────────────────────────────────────────

export interface ParsedIntent {
    intent: 'search' | 'greeting' | 'help' | 'other';
    location?: string;
    maxPrice?: number;
    minPrice?: number;
    type?: string;
    message?: string; // for 'other' intent — a freeform response
}

// ─── Step 1: Parse User Intent ──────────────────────────

/**
 * Uses Gemma to parse a user's WhatsApp message into structured search filters.
 * Returns a JSON object with intent type and extracted parameters.
 */
export async function parseUserIntent(userMessage: string): Promise<ParsedIntent> {
    const prompt = `You are PaDen's intent parser. Your ONLY job is to analyze the user's message and extract search filters as JSON.

RULES:
- Respond with ONLY valid JSON, no extra text, no markdown fences.
- Supported intents: "search", "greeting", "help", "other"
- For "search" intent, extract: location, maxPrice, minPrice, type (room/cottage/apartment/boarding/house)
- For "greeting" (hi, hello, hey, etc.) just return: {"intent": "greeting"}
- For "help" (how does this work, what can you do, etc.) return: {"intent": "help"}
- For anything unrelated to rental searching, return: {"intent": "other"}
- Prices are in USD. If user says "under $80", set maxPrice to 80.
- If user says "near MSU" or "in Senga", set location to that place name.
- Property types: "room", "single room", "cottage", "apartment", "boarding", "house"
- Only include fields you can confidently extract. Omit fields you're unsure about.

EXAMPLES:
User: "I need a room under $80 near MSU"
→ {"intent":"search","location":"MSU","maxPrice":80,"type":"room"}

User: "Show cottages in Senga"
→ {"intent":"search","location":"Senga","type":"cottage"}

User: "Any rooms with WiFi under $100?"
→ {"intent":"search","maxPrice":100,"type":"room"}

User: "Hello"
→ {"intent":"greeting"}

User: "What can you help me with?"
→ {"intent":"help"}

User: "What's the weather like?"
→ {"intent":"other"}

Now parse this message:
User: "${userMessage}"`;

    try {
        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: prompt }] }
            ],
            generationConfig: {
                maxOutputTokens: 150,
                temperature: 0.1, // Low temperature for reliable JSON
            }
        });

        const responseText = result.response.text().trim();
        console.log('🧠 Raw intent parse:', responseText);

        // Clean up response — strip markdown code fences if Gemma adds them
        const cleaned = responseText
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/g, '')
            .trim();

        const parsed: ParsedIntent = JSON.parse(cleaned);
        console.log('✅ Parsed intent:', JSON.stringify(parsed));
        return parsed;

    } catch (error) {
        console.error('❌ Intent parsing error:', error);
        // Fallback: treat as general search if parsing fails
        return { intent: 'other' };
    }
}

// ─── Step 2: Format Search Results ──────────────────────

/**
 * Takes DB results and formats them into a friendly WhatsApp reply using Gemma.
 */
export async function formatSearchResults(
    userMessage: string,
    properties: Property[],
    filters: ParsedIntent
): Promise<string> {

    const propertyList = properties.map((p, i) => {
        return `${i + 1}. Title: ${p.title}
   Price: $${p.price}/month
   Location: ${p.location}
   Type: ${p.type}
   Description: ${p.description || 'No description'}`;
    }).join('\n\n');

    const prompt = `You are PaDen 🏠, a friendly and helpful WhatsApp rental assistant for Zimbabwe.

The user asked: "${userMessage}"

${properties.length > 0 ? `Here are the matching properties from our database:

${propertyList}

Write a friendly, concise WhatsApp reply presenting these properties. Rules:
- Use emojis to make it visually appealing
- Keep each listing to 2-3 lines max
- Include price, location, and type
- Add a numbered list
- End with a helpful prompt like "Reply with a number for more details!" or "Want me to narrow the search?"
- Keep the TOTAL response under 800 characters (WhatsApp readability)
- Do NOT invent or add any information not in the data above.` :

            `No properties were found matching the user's search (filters used: ${JSON.stringify(filters)}).
Write a friendly WhatsApp reply telling them no results were found. Rules:
- Be empathetic and helpful
- Suggest they try broader filters (different location, higher budget, different type)
- Use emojis
- Keep it under 300 characters`}`;

    try {
        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: prompt }] }
            ],
            generationConfig: {
                maxOutputTokens: 350,
                temperature: 0.7,
            }
        });

        return result.response.text().trim();
    } catch (error) {
        console.error('❌ Response formatting error:', error);
        if (properties.length > 0) {
            // Fallback: manually format if AI fails
            return `🏠 Found ${properties.length} properties!\n\n` +
                properties.map((p, i) =>
                    `${i + 1}. ${p.title} — $${p.price}/mo in ${p.location}`
                ).join('\n') +
                `\n\nReply with a number for details!`;
        }
        return "😔 No properties found matching your search. Try different filters!";
    }
}

// ─── Utility: Generate Simple Response ──────────────────

/**
 * Generate a simple conversational response (for greetings, help, etc.)
 */
export async function generateSimpleResponse(userMessage: string, context: string): Promise<string> {
    try {
        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: context + "\n\nUser Message: " + userMessage }] }
            ],
            generationConfig: {
                maxOutputTokens: 250,
                temperature: 0.7,
            }
        });

        return result.response.text().trim();
    } catch (error) {
        console.error('❌ AI Error:', error);
        return "I'm having trouble thinking right now. Please try again later.";
    }
}
