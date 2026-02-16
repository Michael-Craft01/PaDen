
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://bkamykwfksnnkwrheefm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYW15a3dma3Nubmt3cmhlZWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjI4MjMsImV4cCI6MjA4NjE5ODgyM30.kmNwjeMiv-uxvXqjnqCUW2QgDHd90Kj7nhJc_4SiUzM';

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    try {
        const { data, error } = await supabase.from('properties').select('*').limit(1);
        if (error) {
            console.error('Error:', error);
            fs.writeFileSync('schema_error.txt', JSON.stringify(error, null, 2));
        } else if (data && data.length > 0) {
            const keys = Object.keys(data[0]).sort();
            console.log('Writing keys to schema.json');
            fs.writeFileSync('schema.json', JSON.stringify(keys, null, 2));
        } else {
            console.log('Table empty.');
        }
    } catch (e) {
        console.error(e);
    }
})();
