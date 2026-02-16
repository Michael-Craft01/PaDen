
const ngrok = require('ngrok');

(async function () {
    try {
        console.log('🔫 Killing old tunnels...');
        await ngrok.kill();

        // Explicitly set auth token just in case
        // const token = '...'; // user provided it via config command so it should be saved

        console.log('🚀 Starting new tunnel...');
        const url = await ngrok.connect({
            addr: 5000,
            onStatusChange: status => console.log('Status:', status),
        });
        console.log('✅ URL:', url);

        // Keep alive
        setInterval(() => { }, 100000);
    } catch (error) {
        console.error('❌ Error:', error);
    }
})();
