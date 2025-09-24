import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

// Import Chart.js components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
    const [wallet, setWallet] = useState(null);
    const [quotes, setQuotes] = useState({});
    const [history, setHistory] = useState({}); // store last 30 prices for charts
    const navigate = useNavigate();
    const symbols = ["BTCUSDT", "ETHUSDT", "AAPL", "EURUSD"];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        let mounted = true;
        async function load() {
            try {
                const w = await api.get("/api/wallet");
                if (mounted) setWallet(w.data);

                const q = {};
                const h = {};
                for (const s of symbols) {
                    const r = await api.get(`/api/market/${s}`);
                    q[s] = r.data.price;
                    h[s] = [{ time: 0, price: r.data.price }]; // initial history
                }
                if (mounted) {
                    setQuotes(q);
                    setHistory(h);
                }
            } catch (err) {
                if (err?.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                } else {
                    console.error("Dashboard load error:", err);
                }
            }
        }
        load();

        const t = setInterval(async () => {
            try {
                for (const s of symbols) {
                    const r = await api.get(`/api/market/${s}`);
                    setQuotes((prev) => ({ ...prev, [s]: r.data.price }));
                    setHistory((prev) => {
                        const h = prev[s] || [];
                        const newH = [...h, { time: h.length, price: r.data.price }];
                        return { ...prev, [s]: newH.slice(-30) }; // keep last 30 points
                    });
                }
            } catch (err) {
                if (err?.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                } else {
                    console.error("Market poll error:", err);
                }
            }
        }, 5000);

        return () => {
            mounted = false;
            clearInterval(t);
        };
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded shadow">
                    <h3 className="text-sm text-gray-500">Wallet Balance</h3>
                    <div className="text-3xl font-semibold">{wallet ? wallet.balance.toFixed(2) : "..."}</div>
                </div>
                <div className="p-4 bg-white rounded shadow md:col-span-2">
                    <h3 className="text-sm text-gray-500">Market Snapshot</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                        {symbols.map((s) => (
                            <div key={s} className="p-2 border rounded">
                                <div className="text-sm">{s}</div>
                                <div className="font-medium">{quotes[s] ? Number(quotes[s]).toFixed(4) : "..."}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* -------------------- New Chart Section -------------------- */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Price Charts (Last 30 points)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {symbols.map((s) => (
                        <div key={s} className="p-4 bg-white rounded shadow">
                            <h3 className="font-semibold mb-2">{s}</h3>
                            {history[s] && history[s].length > 0 && (
                                <Line
                                    data={{
                                        labels: history[s].map((h) => h.time),
                                        datasets: [
                                            {
                                                label: s,
                                                data: history[s].map((h) => h.price),
                                                fill: false,
                                                borderColor: "rgb(75,192,192)",
                                                tension: 0.3,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { display: true, position: "top" },
                                            title: { display: false },
                                        },
                                        scales: {
                                            x: { title: { display: true, text: "Time" } },
                                            y: { title: { display: true, text: "Price" } },
                                        },
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <Link to="/market" className="btn">
                    Open Market
                </Link>
                <Link to="/history" className="btn ml-2">
                    Trade History
                </Link>
            </div>
        </div>
    );
}
