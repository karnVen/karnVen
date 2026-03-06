const axios = require('axios');
const fs = require('fs');

async function buildHeatmap() {
  try {
    const APE_KEY = process.env.MONKEYTYPE_APE_KEY;
    // 1. Fetching your raw daily activity stats
    const response = await axios.get('https://api.monkeytype.com/users/karnVen/stats', {
      headers: { Authorization: `ApeKey ${APE_KEY}` }
    });

    const dailyStats = response.data.data.dailyStats;
    // Sorting dates to ensure the grid follows chronological order
    const dates = Object.keys(dailyStats).sort();

    // 2. Setting up the SVG canvas (Grid size: ~52 weeks x 7 days)
    let svg = `<svg width="800" height="120" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<style> .bg { fill: #0d1117; } .square { rx: 2; ry: 2; } </style>`;
    svg += `<rect width="100%" height="100%" class="bg" />`;

    // 3. Drawing the squares
    dates.forEach((date, index) => {
      const col = Math.floor(index / 7);
      const row = index % 7;
      const testCount = dailyStats[date];
      
      // Color logic: Serika Dark theme colors
      // Bright yellow for high activity, dark grey for empty days
      const color = testCount > 50 ? "#e2b714" : (testCount > 0 ? "#4e4216" : "#21262d");
      
      svg += `<rect x="${col * 14 + 10}" y="${row * 14 + 10}" width="11" height="11" fill="${color}" class="square" />`;
    });

    svg += `</svg>`;
    
    // 4. Saving the file so your GitHub Action can find it
    fs.writeFileSync('monkeytype-heatmap.svg', svg);
    console.log("Custom heatmap generated successfully!");
  } catch (err) {
    console.error("Error fetching Monkeytype data:", err.message);
    process.exit(1);
  }
}

buildHeatmap();
