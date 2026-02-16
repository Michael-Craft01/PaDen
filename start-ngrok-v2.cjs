
const ngrok = require('ngrok');

(async function () {
    try {
        const url = await ngrok.connect({
            addr: 5000,
            name: 'paden-' + Date.now(), // unique name
        });
        console.log('✅ Ngrok Tunnel Created: ' + url);
        console.log('👉 Webhook URL: ' + url + '/api/whatsapp');
    } catch (error) {
        console.error('Error:', error);
    }
})();
