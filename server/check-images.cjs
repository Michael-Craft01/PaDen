
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase URL/Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkImages() {
    console.log('🔍 Checking properties images...');
    const { data, error } = await supabase
        .from('properties')
        .select('title, images')
        .limit(3);

    if (error) {
        console.error('❌ Error:', error);
    } else {
        console.log('✅ Data:', JSON.stringify(data, null, 2));
    }
}

checkImages();
