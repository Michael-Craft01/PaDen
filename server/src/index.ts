import './config';
import express from 'express';
import cors from 'cors';
import { Twilio } from 'twilio';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import { parseUserIntent, formatSearchResults, generateSimpleResponse } from './lib/ai';
import { searchProperties, Property } from './lib/propertySearch';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Twilio Client (for Async Replies)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER || 'whatsapp:+14155238886'; // Sandbox default

let client: Twilio | null = null;
try {
    if (accountSid && authToken) {
        client = new Twilio(accountSid, authToken);
        console.log('✅ Twilio Client Initialized');
    } else {
        console.warn('⚠️ Twilio SID/Token missing. Async replies will fail.');
    }
} catch (error) {
    console.error('❌ Twilio Init Error:', error);
}

app.get('/', (_req, res) => {
    res.send('Homify Backend API is running!');
});

// ─── AI Suggest Endpoint (for Add Property Wizard) ─────────────
app.post('/api/ai-suggest', async (req, res) => {
    try {
        const { field, context } = req.body;

        // Random style hint so responses differ each call
        const styles = [
            'Use a warm, inviting tone.',
            'Be modern and professional.',
            'Focus on lifestyle benefits.',
            'Highlight convenience and comfort.',
            'Emphasize value for money.',
            'Use a premium luxury tone.',
            'Be concise but vivid.',
            'Highlight safety and community.',
        ];
        const styleHint = styles[Math.floor(Math.random() * styles.length)];

        const prompts: Record<string, string> = {
            description: `Generate a compelling property listing description for a rental.
Title: "${context.title || 'Untitled'}"
Location: "${context.location || 'Not specified'}"
Price: "${context.price || 'Not specified'}"
Style: ${styleHint}
Keep it 2-3 sentences max. Be creative and unique every time. Do NOT use markdown.`,

            amenities: `Suggest 8-10 relevant amenities for this rental property as a comma-separated list.
Title: "${context.title || 'Untitled'}"
Description: "${context.description || 'Not specified'}"
Location: "${context.location || 'Not specified'}"
Be creative — vary your suggestions each time. Only output the comma-separated list, nothing else.`,

            location_tips: `Give a brief 1-2 sentence tip about renting in "${context.location || 'this area'}".
${styleHint}
Be creative and different from typical responses. Mention unique aspects.`,

            title: `Suggest a catchy property listing title.
Description: "${context.description || 'Not specified'}"
Location: "${context.location || 'Not specified'}"
Price: "${context.price || 'Not specified'}"
${styleHint}
Output ONLY the title, nothing else. Keep it under 60 characters. Be creative and unique.`,
        };

        const prompt = prompts[field] || `Generate a helpful suggestion for the "${field}" field of a property listing. Context: ${JSON.stringify(context)}. ${styleHint}`;

        // Use the AI model directly with high temperature for variety
        const { model } = await import('./lib/ai');
        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: `You are Homify's professional real estate assistant. Be concise.\n\n${prompt}` }] }
            ],
            generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.95,
                topP: 0.95,
                topK: 40,
            }
        });

        const suggestion = result.response.text().trim();
        res.json({ suggestion });
    } catch (error) {
        console.error('AI Suggest error:', error);
        res.status(500).json({ error: 'AI suggestion failed' });
    }
});


// ─── WhatsApp Webhook (Async Pipeline) ─────────────

app.post('/api/whatsapp', async (req, res) => {
    const { Body, From } = req.body;
    const start = Date.now();

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📩 Message from ${From}: "${Body}"`);

    // 0. Debug Ping/Pic (Sync Fast-Path)
    if (typeof Body === 'string') {
        const cmd = Body.toLowerCase().trim();
        const twiml = new MessagingResponse();

        if (cmd === 'ping') {
            twiml.message('🏓 Pong! Async Mode Enabled.');
            res.type('text/xml').send(twiml.toString());
            console.log(`⚡ Ping replied in ${Date.now() - start}ms`);
            return;
        }
        if (cmd === 'pic') {
            const msg = twiml.message('📸 Testing Media...');
            msg.media('https://images.unsplash.com/photo-1564013799919-ab600027ffc6');
            res.type('text/xml').send(twiml.toString());
            console.log(`⚡ Pic replied in ${Date.now() - start}ms`);
            return;
        }
    }

    // ── 1. Acknowledge Receipt Immediately ──
    // Send 200 OK with empty body so Twilio knows we got it.
    // We will send the actual reply via API.
    res.status(200).send();
    console.log('⚡ Sent 200 OK to Twilio (Async processing started)');

    // ── 2. Async Processing ──
    (async () => {
        try {
            if (!client) {
                console.error('❌ Cannot reply: Twilio Client not active');
                return;
            }

            console.log('🧠 Step 1: Parsing intent...');
            const intent = await parseUserIntent(Body);

            let reply: string = '';
            let properties: Property[] = [];
            let mediaUrl: string | undefined;

            switch (intent.intent) {
                case 'search': {
                    console.log('🔍 Step 2: Querying database...');
                    properties = await searchProperties({
                        location: intent.location,
                        maxPrice: intent.maxPrice,
                        minPrice: intent.minPrice,
                        query: intent.query,
                        title: intent.title,
                    });

                    // Fallback
                    if (properties.length === 0 && (intent.title || intent.query)) {
                        console.log('⚠️ No exact match, retrying with broader search...');
                        properties = await searchProperties({
                            query: intent.title || intent.query,
                            limit: 3
                        });
                    }

                    if (properties.length === 0) {
                        const filterHints = [
                            intent.location ? `📍 ${intent.location}` : null,
                            intent.maxPrice ? `💰 under $${intent.maxPrice}` : null,
                            intent.query ? `🔎 ${intent.query}` : null,
                            intent.title ? `🏷️ ${intent.title}` : null,
                        ].filter(Boolean).join(', ');

                        reply = `😔 No properties found${filterHints ? ` matching: ${filterHints}` : ''}.\n\n` +
                            `💡 Try broadening your search.`;
                    } else {
                        console.log('✍️ Step 3: Formatting response...');
                        reply = await formatSearchResults(Body, properties, intent);
                    }
                    break;
                }

                case 'greeting': {
                    reply = await generateSimpleResponse(Body,
                        `You are Homify 🏠. Friendly greeting + capabilities (search rentals). Keep it short.`
                    );
                    break;
                }

                case 'help': {
                    reply = await generateSimpleResponse(Body,
                        `You are Homify 🏠. Explain how to search (e.g. "rooms under $80"). Keep it short.`
                    );
                    break;
                }

                default: {
                    reply = await generateSimpleResponse(Body,
                        `You are Homify 🏠. Redirect to rentals. Example: "rooms in Harare".`
                    );
                    break;
                }
            }

            // Image Logic
            if (intent.showImages &&
                properties?.length > 0 &&
                properties[0].images?.length > 0) {
                mediaUrl = properties[0].images[0];
                console.log(`🖼️ Attaching image: ${mediaUrl}`);
            }

            console.log(`📤 Sending Async Reply via Twilio API...`);

            await client.messages.create({
                from: twilioNumber,
                to: From,
                body: reply,
                mediaUrl: mediaUrl ? [mediaUrl] : undefined
            });

            console.log(`✅ Message Sent! (Time: ${Date.now() - start}ms)`);

        } catch (error) {
            console.error('❌ Async Pipeline Error:', error);
            // Optional: Send error notification to user
            if (client) {
                try {
                    await client.messages.create({
                        from: twilioNumber,
                        to: From,
                        body: "😔 System is busy. Please try again."
                    });
                } catch (e) { console.error('Error notification failed', e); }
            }
        }
    })();
});

app.listen(port, () => {
    console.log(`\n🚀 Homify server running at http://localhost:${port}`);
    console.log(`📡 WhatsApp webhook: POST /api/whatsapp (Async Mode)\n`);
});

// Force restart for env update
