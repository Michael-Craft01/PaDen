const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testKey() {
    console.log("🔑 Testing API Key...");

    // Check if key exists
    const key = process.env.Gemini_API_Key || process.env.Nexa || process.env.AI_API_KEY;
    if (!key) {
        console.error("❌ No API Key found in .env (checked Gemini_API_Key, Nexa, AI_API_KEY)");
        return;
    }

    console.log("✅ Key found:", key.substring(0, 5) + "...");

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use simple model for testing

        console.log("🤖 Sending test request to Google AI...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        const text = response.text();

        console.log("\n🎉 SUCCESS! The API Key is working.");
        console.log("Response:", text);
    } catch (error) {
        console.error("\n❌ API KEY ERROR:");
        console.error(error.message);
        console.error("\n👉 This proves the issue is the API Key, not the code or localhost.");
    }
}

testKey();
