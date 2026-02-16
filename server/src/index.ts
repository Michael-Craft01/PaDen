import './config';
import express from 'express';
import cors from 'cors';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import { parseUserIntent, formatSearchResults, generateSimpleResponse } from './lib/ai';
import { searchProperties } from './lib/propertySearch';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (_req, res) => {
    res.send('PaDen Backend API is running!');
});

// ─── WhatsApp Webhook (Two-Step AI Pipeline) ─────────────

app.post('/api/whatsapp', async (req, res) => {
    const { Body, From } = req.body;
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📩 Message from ${From}: "${Body}"`);

    const twiml = new MessagingResponse();

    try {
        // ── Step 1: Parse user intent ──
        console.log('🧠 Step 1: Parsing intent...');
        const intent = await parseUserIntent(Body);

        let reply: string;

        switch (intent.intent) {
            case 'search': {
                // ── Step 2a: Query the database ──
                console.log('🔍 Step 2: Querying database...');
                const properties = await searchProperties({
                    location: intent.location,
                    maxPrice: intent.maxPrice,
                    minPrice: intent.minPrice,
                    type: intent.type,
                });

                // ── Step 2b: Format results with AI ──
                console.log('✍️ Step 3: Formatting response...');
                reply = await formatSearchResults(Body, properties, intent);
                break;
            }

            case 'greeting': {
                reply = await generateSimpleResponse(Body,
                    `You are PaDen 🏠, a friendly WhatsApp rental assistant for Zimbabwe.
                    The user just greeted you. Respond warmly and briefly explain what you can do:
                    - Help find rooms, cottages, apartments, and boarding houses
                    - Search by location, price, and property type
                    - Show available listings
                    Keep it under 300 characters. Use emojis. Be warm and welcoming.`
                );
                break;
            }

            case 'help': {
                reply = await generateSimpleResponse(Body,
                    `You are PaDen 🏠, a WhatsApp rental assistant for Zimbabwe.
                    The user wants help. Explain how to use the bot:
                    - Search example: "rooms under $80 near MSU"
                    - Filter by location: "cottages in Senga"  
                    - Filter by price: "apartments under $150"
                    - Filter by type: "boarding houses in Harare"
                    Keep it concise (under 400 characters). Use emojis.`
                );
                break;
            }

            default: {
                reply = await generateSimpleResponse(Body,
                    `You are PaDen 🏠, a WhatsApp rental assistant for Zimbabwe.
                    The user sent a message that isn't about finding accommodation.
                    Politely redirect them — explain that you specialize in helping find rentals.
                    Give a quick example: "Try: rooms under $100 near UZ"
                    Keep it under 250 characters. Be friendly. Use emojis.`
                );
                break;
            }
        }

        console.log(`📤 Reply: ${reply.substring(0, 100)}...`);
        twiml.message(reply);

    } catch (error) {
        console.error('❌ Pipeline error:', error);
        twiml.message("😔 Something went wrong on my end. Please try again in a moment!");
    }

    res.type('text/xml').send(twiml.toString());
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

app.listen(port, () => {
    console.log(`\n🚀 PaDen server running at http://localhost:${port}`);
    console.log(`📡 WhatsApp webhook: POST /api/whatsapp\n`);
});
