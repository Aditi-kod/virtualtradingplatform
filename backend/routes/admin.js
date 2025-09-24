const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Trade = require("../models/Trade");

// Get all users
router.get("/users", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ msg: "forbidden" });
    const users = await User.find({}, "email name role createdAt");
    res.json(users);
});

// Reset balance for a user
router.post("/reset/:userId", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ msg: "forbidden" });

    const uid = req.params.userId;
    await Wallet.findOneAndUpdate(
        { userId: uid },
        {
            balance: Number(process.env.DEFAULT_BALANCE || 10000),
            reserved: 0,
        }
    );
    res.json({ msg: "reset" });
});

// Delete a user + cleanup wallet and trades
router.delete("/user/:userId", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ msg: "forbidden" });

    const uid = req.params.userId;

    try {
        // Delete user
        await User.findByIdAndDelete(uid);

        // Delete wallet
        await Wallet.deleteOne({ userId: uid });

        // Delete trades
        await Trade.deleteMany({ userId: uid });

        res.json({ msg: "user deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "error deleting user" });
    }
});

// Get recent trades
router.get("/trades", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ msg: "forbidden" });

    const trades = await Trade.find({})
        .sort({ createdAt: -1 })
        .limit(500);

    res.json(trades);
});

module.exports = router;
