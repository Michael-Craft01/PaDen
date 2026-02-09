const http = require('http');

const data = new URLSearchParams({
    'Body': 'Hello from Local Test',
    'From': '+123456789'
}).toString();

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/whatsapp',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
