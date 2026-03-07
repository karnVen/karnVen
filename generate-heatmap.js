const fs = require('fs');

// 1. Load and Parse results.csv
const csvData = fs.readFileSync('results.csv', 'utf8');
const lines = csvData.split('\n').filter(line => line.trim() !== "");
const headers = lines[0].split(',');
const timestampIndex = headers.indexOf('timestamp');

const activity = {};
let totalTests = 0;

lines.slice(1).forEach(line => {
    const columns = line.split(',');
    const ts = parseFloat(columns[timestampIndex]);
    if (!isNaN(ts)) {
        const date = new Date(ts).toISOString().split('T')[0];
        activity[date] = (activity[date] || 0) + 1;
        totalTests++; // Increment total counter
    }
});

// 2. SVG Configuration
const boxSize = 12;
const gap = 3;
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

let svg = `<svg width="850" height="160" viewBox="0 0 850 160" xmlns="http://www.w3.org/2000/svg" style="background-color:#1a1a1a; font-family: monospace;">`;

// Add Top Header (Count and Dropdown Placeholder)
svg += `<text x="70" y="45" fill="#888" font-size="14">${totalTests} tests</text>`;
svg += `<text x="750" y="45" fill="#888" font-size="12">less ■■■■■ more</text>`;

// Add Side Labels
svg += `<text x="5" y="75" fill="#888" font-size="10">monday</text>`;
svg += `<text x="5" y="105" fill="#888" font-size="10">wednesday</text>`;
svg += `<text x="5" y="135" fill="#888" font-size="10">friday</text>`;

// 3. Generate Grid (Last 52 weeks)
const today = new Date();
const startDate = new Date();
startDate.setDate(today.getDate() - 364); 
startDate.setDate(startDate.getDate() - startDate.getDay());

for (let i = 0; i < 53; i++) {
    for (let j = 0; j < 7; j++) {
        const current = new Date(startDate);
        current.setDate(startDate.getDate() + (i * 7) + j);
        const dateStr = current.toISOString().split('T')[0];
        
        // Month Labels (Bottom)
        if (j === 0 && current.getDate() <= 7) {
            svg += `<text x="${70 + i * (boxSize + gap)}" y="155" fill="#555" font-size="10">${months[current.getMonth()]}</text>`;
        }

        const count = activity[dateStr] || 0;
        let color = "#2d2d2d"; // Background grey
        if (count > 0) color = "#4d4d00"; 
        if (count > 5) color = "#999900"; 
        if (count > 10) color = "#e6e600"; 
        if (count > 20) color = "#ffff00"; // Brightest yellow

        svg += `<rect x="${70 + i * (boxSize + gap)}" y="${60 + j * (boxSize + gap)}" width="${boxSize}" height="${boxSize}" fill="${color}" rx="2" />`;
    }
}

svg += `</svg>`;
fs.writeFileSync('heatmap.svg', svg);
console.log(`Heatmap generated with ${totalTests} tests!`);
