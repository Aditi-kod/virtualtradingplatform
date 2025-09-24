const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const Trade = require("../models/Trade");
const Wallet = require("../models/Wallet");
const marketService = require("../services/marketService");

router.post("/execute", authMiddleware, async (req,res)=>{
    try {
        const { symbol, side, quantity, type = "market" } = req.body;
        if(!symbol || !side || !quantity) return res.status(400).json({msg:"missing fields"});
        if(quantity <= 0) return res.status(400).json({msg:"invalid quantity"});
        const market = await marketService.getLatestPrice(symbol);
        if(!market) return res.status(400).json({msg:"no market data"});
        const price = market.price;
        const cost = Number((price * quantity).toFixed(6));
        const wallet = await Wallet.findOne({ userId: req.user.id });
        if(!wallet) return res.status(400).json({msg:"wallet not found"});

        if(side === "buy") {
            if(wallet.balance < cost) return res.status(400).json({msg:"insufficient balance"});
            wallet.balance -= cost;
        } else {
            // naive sell: add funds back
            wallet.balance += cost;
        }
        await wallet.save();
        const trade = await Trade.create({
            userId: req.user.id, symbol, side, quantity, price, type
        });
        res.json({ trade, balance: wallet.balance });
    } catch(err) { console.error(err); res.status(500).json({msg:"server error", error: err.message}); }
});

router.get("/", authMiddleware, async (req,res)=>{
    const trades = await Trade.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(200);
    res.json(trades);
});

module.exports = router;
