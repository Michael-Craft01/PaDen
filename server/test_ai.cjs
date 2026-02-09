const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const dotenv = require('dotenv');

// Load env from root
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.Nexa || process.env.AI_API_KEY;
const modelName = "gemma-3-27b-it"; // The one user wanted

console.log("Testing AI with Key:", apiKey ? "FOUND" : "MISSING");
console.log("Testing Model:", modelName);

async function test() {
    if (!apiKey) {
        console.error("No API Key found!");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Success! Response:", response.text());
    } catch (error) {
        console.error("AI FAILED. Error details:");
        console.error(error);
    }
}

test();
