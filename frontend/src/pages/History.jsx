import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function History() {
    const [trades, setTrades] = useState([]);
    const [metrics, setMetrics] = useState({ winLoss: 0, avgProfit: 0 });

    useEffect(() => {
        (async () => {
            const r = await api.get("/api/trade");
            setTrades(r.data);

            // ----- Calculate portfolio metrics -----
            const symbolMap = {}; // track total buy price and quantity per symbol
            const tradeProfits = [];

            r.data.forEach((t) => {
                const { symbol, side, price, quantity } = t;
                if (!symbolMap[symbol]) symbolMap[symbol] = { totalQty: 0, totalCost: 0 };

                if (side === "buy") {
                    // accumulate buys
                    symbolMap[symbol].totalQty += quantity;
                    symbolMap[symbol].totalCost += price * quantity;
                } else if (side === "sell") {
                    const avgBuyPrice = symbolMap[symbol].totalQty
                        ? symbolMap[symbol].totalCost / symbolMap[symbol].totalQty
                        : price; // fallback
                    const profit = (price - avgBuyPrice) * quantity;
                    tradeProfits.push(profit);

                    // reduce tracked buys
                    symbolMap[symbol].totalQty -= quantity;
                    symbolMap[symbol].totalCost -= avgBuyPrice * quantity;
                }
            });

            const wins = tradeProfits.filter((p) => p > 0).length;
            const totalTrades = tradeProfits.length;
            const winLossRatio = totalTrades ? (wins / totalTrades) * 100 : 0;
            const avgProfit = totalTrades ? tradeProfits.reduce((a, b) => a + b, 0) / totalTrades : 0;

            setMetrics({ winLoss: winLossRatio, avgProfit });
        })();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold">Trade History</h2>

            {/* Portfolio Metrics */}
            <div className="mt-4 p-4 bg-green-100 rounded shadow">
                <h3 className="font-semibold mb-2">Portfolio Performance</h3>
                <div className="flex gap-6">
                    <div>Win/Loss Ratio: {metrics.winLoss.toFixed(2)}%</div>
                    <div>Avg. Profit per Trade: {metrics.avgProfit.toFixed(2)}</div>
                </div>
            </div>

            <div className="mt-4">
                {trades.map((t) => (
                    <div key={t._id} className="p-3 bg-white rounded shadow mb-2">
                        <div className="flex justify-between">
                            <div>
                                {t.symbol} — {t.side.toUpperCase()}
                            </div>
                            <div>{new Date(t.createdAt).toLocaleString()}</div>
                        </div>
                        <div>
                            Qty: {t.quantity} @ {Number(t.price).toFixed(6)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
