const mongoose = require("mongoose");
const WalletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: Number(process.env.DEFAULT_BALANCE || 10000) },
    reserved: { type: Number, default: 0 }
});
module.exports = mongoose.model("Wallet", WalletSchema);
