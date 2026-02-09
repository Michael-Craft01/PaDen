const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
// Load .env from project root (one level up)
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function testKey() {
    console.log("🔑 Testing API Key...");

    const key = process.env.Gemini_API_Key || process.env.Nexa || process.env.AI_API_KEY;
    if (!key) {
        console.error("❌ No API Key found in .env (checked Gemini_API_Key, Nexa, AI_API_KEY)");
        return;
    }

    console.log(`✅ Key found: ${key.substring(0, 5)}...`);

    try {
        const genAI = new GoogleGenerativeAI(key);
        // Use gemini-1.5-flash as it's widely available
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("🤖 Sending test request to Google AI...");
        const result = await model.generateContent("Hello!");
        const response = await result.response;
        const text = response.text();

        console.log("\n🎉 SUCCESS! The API Key is working.");
        console.log("Response:", text);
    } catch (error) {
        console.error("\n❌ API KEY ERROR:", error.message);
        console.error("\n👉 This confirmed the issue is the API Key itself.");
    }
}

testKey();
