import { GoogleGenerativeAI } from '@google/generative-ai';
import { Property } from './propertySearch';

// Load API key from env
const apiKey = process.env.Gemini_Api_Key || process.env.Gemini_API_Key || process.env.AI_API_KEY;

if (!apiKey) {
    console.warn("⚠️ AI Key (Gemini_Api_Key) is missing. AI features will not work.");
}

// Initialize Google AI
const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');
export const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

// ─── Types ──────────────────────────────────────────────

export interface ParsedIntent {
    intent: 'search' | 'greeting' | 'help' | 'other';
    location?: string;
    maxPrice?: number;
    minPrice?: number;
    query?: string; // Broad text search (e.g. "modern house with pool")
    title?: string; // Specific property name (e.g. "Goshen House")
    showImages?: boolean; // User explicitly asked for pictures
    message?: string;
}

// ─── Step 1: Parse User Intent ──────────────────────────

/**
 * Uses Gemma to parse a user's WhatsApp message into structured search filters.
 */
export async function parseUserIntent(userMessage: string): Promise<ParsedIntent> {
    const prompt = `You are Homify's intent parser. Your ONLY job is to analyze the user's message and extract search filters as JSON.

RULES:
- Respond with ONLY valid JSON, no extra text.
- Intents: "search", "greeting", "help", "other"
- For "search", extract:
  - location: City or suburb name
  - maxPrice: Number in USD
  - minPrice: Number in USD
  - query: Key features (e.g. "pool", "wifi")
  - title: SPECIFIC property name if mentioned
  - showImages: true if user asks for "photos", "pictures", "images", etc.
- If user matches specific name like "Goshen House", put "Goshen House" in 'title'.
- **CRITICAL:** Correct any spelling mistakes in locations to standard Zimbabwean city/suburb names.
  - "Hrara" -> "Harare"
  - "Byo" -> "Bulawayo"
  - "Belvder" -> "Belvedere"
  - "Avondal" -> "Avondale"

EXAMPLES:
User: "I need a room under $80 near MSU"
→ {"intent":"search","location":"MSU","maxPrice":80,"query":"room"}

User: "Show me pictures of Goshen house"
→ {"intent":"search","title":"Goshen House","showImages":true}

User: "Modern apartment with wifi in Avondale sent me photos"
→ {"intent":"search","location":"Avondale","query":"modern apartment wifi","showImages":true}
 
User: "Photos of Goshen House"
→ {"intent":"search","title":"Goshen House","showImages":true}
 
User: "Hello"
→ {"intent":"greeting"}
 
Now parse: "${userMessage}"`;

    try {
        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: prompt }] }
            ],
            generationConfig: {
                maxOutputTokens: 150,
                temperature: 0.1,
            }
        });

        const responseText = result.response.text().trim();
        console.log('🧠 Raw intent parse:', responseText);

        const cleaned = responseText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
        const parsed: ParsedIntent = JSON.parse(cleaned);
        console.log('✅ Parsed intent:', JSON.stringify(parsed));
        return parsed;

    } catch (error) {
        console.error('❌ Intent parsing error:', error);
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
   Description: ${p.description || 'No description'}`;
    }).join('\n\n');

    const prompt = `You are Homify's elite Real Estate Consultant 🏆. You have 20 years of experience closing deals.
    You are professional, persuasive, high-energy, and extremely knowledgeable. You don't just list properties; you sell the *lifestyle*.

    The user asked: "${userMessage}"

    ${properties.length > 0 ? `Here are the gems I found for them:

    ${propertyList}

    Write a persuasive, high-energy WhatsApp reply presenting these properties.
    
    🎨 **FORMATTING RULES:**
    1. **Hook:** Start with a warm, professional greeting.
    2. **The Goods:** List the properties clearly.
       - Use *Bold* for titles (e.g. *Modern Garden Flat*)
       - Use emojis (🏠, 💎, 📍, 💰, ✨)
       - Highlight the *best* feature of each.
       - Format price clearly: 💰 $X/month
    3. **The Close:** End with a strong Call to Action (CTA) using this "button" style:

    👇 *Your Next Steps:*
    1️⃣ Reply *"Photos of [Name]"* to see images
    2️⃣ Reply *"Visit [Name]"* to book a tour
    3️⃣ Reply *"More"* to see other options

    - Keep the tone trustworthy but exciting.
    - Keep total length under 900 characters.
    - Do NOT invent facts. Only use the data provided.` :

            `No properties matches found for: ${JSON.stringify(filters)}.
    Write a helpful, empathetic reply.
    - "I couldn't find an exact match right now, but I can help you find something else!"
    - Suggest they broaden their search (e.g. "Try searching for 'Apartments in Avondale' or increasing your budget slightly").
    - Keep it professional and encouraging.`}`;

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
                `\n\nReply "Photos of [Name]" for details!`;
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
                { role: 'user', parts: [{ text: "You are Homify's elite Real Estate Consultant. Be warm, professional, and sales-oriented.\n\n" + context + "\n\nUser Message: " + userMessage }] }
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
