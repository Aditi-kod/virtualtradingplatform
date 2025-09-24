// services/priceSim.js
const prices = {
    "BTCUSDT": 30000,
    "ETHUSDT": 1800,
    "AAPL": 170,
    "EURUSD": 1.08
};

function tick() {
    Object.keys(prices).forEach(k => {
        const pct = (Math.random()-0.5) * 0.002; // +/-0.1% tick
        prices[k] = +(prices[k] * (1 + pct)).toFixed(6);
    });
}

setInterval(tick, 1000);

module.exports = {
    getPrice(symbol) {
        return prices[symbol] || null;
    },
    getAll() {
        return prices;
    }
};
