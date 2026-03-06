const axios = require('axios');
const fs = require('fs');

async function buildHeatmap() {
  try {
    const APE_KEY = process.env.MONKEYTYPE_APE_KEY;
    if (!APE_KEY) throw new Error("API Key is missing from Secrets!");

    console.log("Connecting to Monkeytype API...");
    const response = await axios.get('https://api.monkeytype.com/users/karnVen/stats', {
      headers: { Authorization: `ApeKey ${APE_KEY}` }
    });

    const dailyStats = response.data.data.dailyStats || {};
    const dates = Object.keys(dailyStats).sort();

    let svg = `<svg width="800" height="120" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<style>.bg { fill: #0d1117; } .sq { rx: 2; ry: 2; }</style>`;
    svg += `<rect width="100%" height="100%" class="bg" />`;

    dates.forEach((date, index) => {
      const col = Math.floor(index / 7);
      const row = index % 7;
      const count = dailyStats[date];
      const color = count > 50 ? "#e2b714" : (count > 0 ? "#4e4216" : "#21262d");
      svg += `<rect x="${col * 14 + 10}" y="${row * 14 + 10}" width="11" height="11" fill="${color}" class="sq" />`;
    });

    svg += `</svg>`;
    fs.writeFileSync('monkeytype-heatmap.svg', svg);
    console.log("✅ SVG Generated Successfully!");
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    if (err.response) console.error("API Status:", err.response.status);
    process.exit(1); 
  }
}
buildHeatmap();
