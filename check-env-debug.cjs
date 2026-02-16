
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
console.log('Reading .env from:', envPath);

try {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');

    console.log('--- .env Analysis ---');
    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        const parts = trimmed.split('=');
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();

        if (key.includes('TWILIO')) {
            console.log(`Line ${idx + 1}: Key="${key}", ValueLength=${val.length}, StartsWith="${val.substring(0, 2)}..."`);
        }
    });
    console.log('---------------------');
} catch (e) {
    console.error('Error reading .env:', e.message);
}
