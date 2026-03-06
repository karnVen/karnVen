const axios = require('axios');
const fs = require('fs');

async function buildHeatmap() {
  try {
    const APE_KEY = process.env.MONKEYTYPE_APE_KEY;
    
    if (!APE_KEY) {
      throw new Error("MONKEYTYPE_APE_KEY is missing from Github Secrets!");
    }

    console.log("Fetching data for user: karnVen...");
    
    const response = await axios.get('https://api.monkeytype.com/users/karnVen/stats', {
      headers: { Authorization: `ApeKey ${APE_KEY}` }
    });

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response from Monkeytype API. Check your username.");
    }

    const dailyStats = response.data.data.dailyStats || {};
    const dates = Object.keys(dailyStats).sort();

    if (dates.length === 0) {
      console.warn("No daily stats found. Generating an empty grid.");
    }

    let svg = `<svg width="800" height="120" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<style> .bg { fill: #0d1117; } .square { rx: 2; ry: 2; } </style>`;
    svg += `<rect width="100%" height="100%" class="bg" />`;

    dates.forEach((date, index) => {
      const col = Math.floor(index / 7);
      const row = index % 7;
      const testCount = dailyStats[date];
      const color = testCount > 50 ? "#e2b714" : (testCount > 0 ? "#4e4216" : "#21262d");
      svg += `<rect x="${col * 14 + 10}" y="${row * 14 + 10}" width="11" height="11" fill="${color}" class="square" />`;
    });

    svg += `</svg>`;
    
    fs.writeFileSync('monkeytype-heatmap.svg', svg);
    console.log("✅ Success: monkeytype-heatmap.svg created!");
  } catch (err) {
    console.error("❌ SCRIPT FAILED:");
    console.error(err.message);
    process.exit(1); // This tells GitHub the action failed
  }
}

buildHeatmap();
