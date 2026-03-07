const fs = require('fs');

// 1. Read your CSV file
const data = fs.readFileSync('results.csv', 'utf8');
const lines = data.split('\n').slice(1); // Skip header

const activity = {};

lines.forEach(line => {
    const columns = line.split(',');
    if (columns.length < 2) return;

    // 2. Fix the scientific notation (1.77E+12 -> Date)
    const timestamp = parseFloat(columns[columns.length - 1]); 
    const date = new Date(timestamp).toISOString().split('T')[0];

    // 3. Count tests per day
    activity[date] = (activity[date] || 0) + 1;
});

// 4. Create a simple SVG (Simplified version of the heatmap)
let svgContent = `<svg width="800" height="120" xmlns="http://www.w3.org/2000/svg">`;
let x = 10;
Object.keys(activity).sort().forEach(date => {
    const intensity = Math.min(activity[date] * 40, 255);
    const color = `rgb(${intensity}, ${intensity}, 0)`; // Yellow shades
    svgContent += `<rect x="${x}" y="10" width="12" height="12" fill="${color}" rx="2" />`;
    x += 15;
});
svgContent += `</svg>`;

fs.writeFileSync('heatmap.svg', svgContent);
console.log('Heatmap generated!');
