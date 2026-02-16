import './config';
import express from 'express';
import cors from 'cors';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import { parseUserIntent, formatSearchResults, generateSimpleResponse } from './lib/ai';
import { searchProperties, Property } from './lib/propertySearch';

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
    const start = Date.now();

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📩 Message from ${From}: "${Body}"`);

    const twiml = new MessagingResponse();

    try {
        // 0. Debug Ping
        if (typeof Body === 'string' && Body.toLowerCase().trim() === 'ping') {
            twiml.message('🏓 Pong! Server is online.');
            const xml = twiml.toString();
            res.type('text/xml').send(xml);
            console.log(`⚡ Ping replied in ${Date.now() - start}ms`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
            return;
        }

        // 0b. Debug Media
        if (typeof Body === 'string' && Body.toLowerCase().trim() === 'pic') {
            const msg = twiml.message('📸 Here is a test image!');
            msg.media('https://images.unsplash.com/photo-1564013799919-ab600027ffc6'); // Public stable image
            const xml = twiml.toString();
            res.type('text/xml').send(xml);
            console.log(`⚡ Pic replied in ${Date.now() - start}ms`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
            return;
        }

        // ── Step 1: Parse user intent ──
        console.log('🧠 Step 1: Parsing intent...');
        const intent = await parseUserIntent(Body);

        let reply: string = '';
        let properties: Property[] = [];

        switch (intent.intent) {
            case 'search': {
                // ── Step 2a: Query the database ──
                console.log('🔍 Step 2: Querying database...');
                properties = await searchProperties({
                    location: intent.location,
                    maxPrice: intent.maxPrice,
                    minPrice: intent.minPrice,
                    query: intent.query,
                    title: intent.title,
                });

                // ── Step 2b: Fallback (Smart Retry) ──
                if (properties.length === 0 && (intent.title || intent.query)) {
                    console.log('⚠️ No exact match, retrying with broader search...');
                    properties = await searchProperties({
                        query: intent.title || intent.query,
                        limit: 3
                    });
                }

                // ── Step 2c: Format results ──
                if (properties.length === 0) {
                    const filterHints = [
                        intent.location ? `📍 ${intent.location}` : null,
                        intent.maxPrice ? `💰 under $${intent.maxPrice}` : null,
                        intent.query ? `🔎 ${intent.query}` : null,
                        intent.title ? `🏷️ ${intent.title}` : null,
                    ].filter(Boolean).join(', ');

                    reply = `😔 No properties found${filterHints ? ` matching: ${filterHints}` : ''}.\n\n` +
                        `💡 Try:\n` +
                        `• Broadening your search\n` +
                        `• "Rooms in Harare"\n` +
                        `• "Cottage under $200"`;
                } else {
                    console.log('✍️ Step 3: Formatting response...');
                    reply = await formatSearchResults(Body, properties, intent);
                }
                break;
            }

            case 'greeting': {
                reply = await generateSimpleResponse(Body,
                    `You are PaDen 🏠, a friendly WhatsApp rental assistant for Zimbabwe.
                    The user just greeted you. Respond warmly and briefly explain what you can do.
                    Keep it under 300 characters. Use emojis.`
                );
                break;
            }

            case 'help': {
                reply = await generateSimpleResponse(Body,
                    `You are PaDen 🏠. Help user. Examples: "rooms under $80", "cottage in Avondale". Keep it short.`
                );
                break;
            }

            default: {
                reply = await generateSimpleResponse(Body,
                    `You are PaDen 🏠. Redirect to rentals. Example: "Try 'rooms near town'". Keep it short.`
                );
                break;
            }
        }

        console.log(`📤 Generated Reply (${reply.length} chars)`);
        const msg = twiml.message(reply);

        if (intent.showImages &&
            properties?.length > 0 &&
            properties[0].images &&
            properties[0].images.length > 0) {

            const imageUrl = properties[0].images[0];
            console.log(`🖼️ Attaching image: ${imageUrl}`);
            msg.media(imageUrl);
        }

    } catch (error) {
        console.error('❌ Pipeline error:', error);
        twiml.message("😔 something went wrong. Try again!");
    }

    const xml = twiml.toString();
    console.log(`📦 Sending TwiML (Len: ${xml.length}): ${xml.substring(0, 100)}...`);
    res.type('text/xml').send(xml);
    console.log(`⏱️ Total Processing Time: ${Date.now() - start}ms`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

app.listen(port, () => {
    console.log(`\n🚀 PaDen server running at http://localhost:${port}`);
    console.log(`📡 WhatsApp webhook: POST /api/whatsapp\n`);
});
