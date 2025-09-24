const mongoose = require("mongoose");
const TradeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true },
    side: { type: String, enum: ["buy","sell"], required: true },
    type: { type: String, enum: ["market","limit","stop"], default: "market" },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Trade", TradeSchema);
