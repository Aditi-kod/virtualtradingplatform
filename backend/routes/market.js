const express = require("express");
const router = express.Router();
const marketService = require("../services/marketService");

router.get("/symbols", (req,res)=>{
    // list supported symbols (for frontend)
    return res.json(["BTCUSDT","ETHUSDT","AAPL","EURUSD"]);
});

router.get("/:symbol", async (req,res)=>{
    const symbol = req.params.symbol;
    const data = await marketService.getLatestPrice(symbol);
    if(!data) return res.status(404).json({msg:"Symbol not supported"});
    res.json({ symbol, price: data.price, ts: data.ts || Date.now() });
});

module.exports = router;
