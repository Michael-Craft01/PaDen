import dotenv from 'dotenv';
import path from 'path';

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, '../.env') });
