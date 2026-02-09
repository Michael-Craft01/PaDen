import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root (one level up from server directory)
const envPath = path.resolve(process.cwd(), '../.env');
console.log('🔌 Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('❌ Error loading .env:', result.error);
} else {
    console.log('✅ .env loaded successfully');
}
