require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const marketRoutes = require("./routes/market");
const tradeRoutes = require("./routes/trade");
const walletRoutes = require("./routes/wallet");
const adminRoutes = require("./routes/admin");
const priceSim = require("./services/priceSim"); // starts simulator

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 1000*60, max: 120 })); // simple rate limit

app.use("/api/auth", authRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> {
        app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));
    })
    .catch(err => console.error("Mongo connect error:", err));
