import './config'; // Trigger restart
import express from 'express';
import cors from 'cors';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import { generateResponse } from './lib/ai';


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Twilio sends form-urlencoded data

app.get('/', (req, res) => {
    res.send('PaDen Backend API is running!');
});

// Twilio Webhook
app.post('/api/whatsapp', async (req, res) => {
    const { Body, From } = req.body;
    console.log(`Received message from ${From}: ${Body}`);

    const twiml = new MessagingResponse();

    // AI Processing
    try {
        console.log('🤖 Sending to AI...', Body);
        const aiResponse = await generateResponse(Body, `
            You are PaDen, a helpful rental assistant for Zimbabwe.
            Your goal is to help users find properties.
            Current user phone: ${From}
            
            If they ask for properties, tell them you can check the database (functionality coming soon).
            Be concise and friendly. Use emojis.
        `);
        console.log('🤖 AI Response:', aiResponse);

        twiml.message(aiResponse || "Sorry, I'm speechless right now.");
    } catch (error) {
        console.error('❌ AI Processing Error:', error);
        twiml.message("I'm having a bit of a brain freeze. Try again later!");
    }

    const xml = twiml.toString();
    console.log('📤 Sending TwiML:', xml);
    res.type('text/xml').send(xml);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
