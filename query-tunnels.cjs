
const http = require('http');

http.get('http://localhost:4040/api/tunnels', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const httpsTunnel = json.tunnels.find(t => t.proto === 'https');
            if (httpsTunnel) {
                console.log('✅ FOUND URL:', httpsTunnel.public_url);
            } else {
                console.log('❌ No HTTPS tunnel found in API response');
                console.log('Response:', data);
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error connecting to ngrok API:', err.message);
});
