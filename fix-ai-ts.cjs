
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'server/src/lib/ai.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the specific line in the map function
content = content.replace(/\s+Type: \$\{p\.type\}\r?\n/g, '\n');

// OR regex to match the block
// We want to remove "    Type: ${p.type}" line.

// Let's print if we find it
if (content.includes('Type: ${p.type}')) {
    console.log('Found it, removing...');
    content = content.replace(/    Type: \$\{p\.type\}\n/g, '');
    // Also handle CRLF if needed, the regex \s+ above handles indentation too
    content = content.replace(/\s+Type: \$\{p\.type\}/g, '');
} else {
    console.log('Not found string literal');
}

fs.writeFileSync(filePath, content);
console.log('Fixed ai.ts');
