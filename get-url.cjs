
const ngrok = require('ngrok');

(async function () {
    try {
        const url = await ngrok.connect({
            addr: 5000,
        });
        console.log('URL:' + url);
        // Keep alive
        setInterval(() => { }, 100000);
    } catch (error) {
        console.error('Error:', error);
    }
})();
