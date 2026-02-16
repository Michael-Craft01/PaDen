
const ngrok = require('ngrok');

(async function () {
    try {
        const url = await ngrok.connect({
            addr: 5000,
            onStatusChange: status => console.log('Ngrok status:', status),
            onLogEvent: data => console.log('Ngrok log:', data),
        });
        console.log('✅ Ngrok Tunnel Created:', url);
        console.log('👉 Set this URL in Twilio Sandbox:', url + '/api/whatsapp');
        // Keep alive
        setInterval(() => { }, 10000);
    } catch (error) {
        console.error('❌ Ngrok Error:', error);
        if (error.message.includes('authtoken')) {
            console.log('\n⚠️  YOU MISSING AN AUTHTOKEN!');
            console.log('1. Go to https://dashboard.ngrok.com/get-started/your-authtoken');
            console.log('2. Copy your token');
            console.log('3. Run: npx ngrok config add-authtoken <YOUR_TOKEN>');
        }
    }
})();
