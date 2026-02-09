import dotenv from 'dotenv';
import path from 'path';

import fs from 'fs';

// Try loading .env from multiple locations
const possiblePaths = [
    path.resolve(process.cwd(), '.env'),       // server/.env
    path.resolve(process.cwd(), '../.env'),    // root/.env
];

let envPath = '';
for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
        envPath = p;
        break;
    }
}

if (envPath) {
    console.log('🔌 Loading .env from:', envPath);
    dotenv.config({ path: envPath });
    console.log('✅ .env loaded successfully');
} else {
    console.error('❌ Could not find .env file in:', possiblePaths);
}
