const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const Wallet = require("../models/Wallet");

router.get("/", authMiddleware, async (req,res)=>{
    const wallet = await Wallet.findOne({ userId: req.user.id });
    res.json(wallet);
});

module.exports = router;
