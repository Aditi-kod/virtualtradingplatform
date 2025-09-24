const axios = require("axios");
const sim = require("./priceSim");

async function getLatestPrice(symbol) {
    // Example: if symbol looks like crypto and you have PRICE_API_KEY, fetch external
    // For now fallback to simulator
    const price = sim.getPrice(symbol);
    if(price) return { price, ts: Date.now() };
    // Optionally implement external API calls here
    return null;
}

module.exports = { getLatestPrice };
