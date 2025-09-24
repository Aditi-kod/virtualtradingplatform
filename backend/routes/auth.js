const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Wallet = require("../models/Wallet");

router.post("/register", async (req,res)=>{
    try {
        const { email, password, name } = req.body;
        if(!email || !password) return res.status(400).json({msg:"Missing"});
        let user = await User.findOne({email});
        if(user) return res.status(400).json({msg:"Email exists"});
        const passwordHash = await bcrypt.hash(password, 10);
        user = await User.create({ email, passwordHash, name });
        await Wallet.create({ userId: user._id, balance: Number(process.env.DEFAULT_BALANCE || 10000) });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, user: { email: user.email, name: user.name, role: user.role } });
    } catch(err){ res.status(500).json({msg:"Server error", err: err.message}); }
});

router.post("/login", async (req,res)=>{
    try {
        const { email, password } = req.body;
        if(!email || !password) return res.status(400).json({msg:"Missing"});
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({msg:"Invalid"});
        const ok = await bcrypt.compare(password, user.passwordHash);
        if(!ok) return res.status(400).json({msg:"Invalid"});
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, user: { email: user.email, name: user.name, role: user.role } });
    } catch(err){ res.status(500).json({msg:"Server error"}); }
});

module.exports = router;
