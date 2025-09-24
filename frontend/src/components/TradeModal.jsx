import React, { useState } from "react";
import api from "../services/api";

export default function TradeModal({ symbol, onClose }){
    const [side, setSide] = useState("buy");
    const [qty, setQty] = useState(0);
    const [loading, setLoading] = useState(false);

    async function submit(e){
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("api/trade/execute", { symbol, side, quantity: Number(qty) });
            alert("Trade executed! New balance: " + res.data.balance);
            onClose();
        } catch(err) {
            alert(err?.response?.data?.msg || "Error");
        } finally { setLoading(false); }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <form onSubmit={submit} className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-semibold">Trade {symbol}</h3>
                <div className="mt-3">
                    <label className="mr-2">Side</label>
                    <select value={side} onChange={e=>setSide(e.target.value)} className="border p-1">
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                    </select>
                </div>
                <div className="mt-3">
                    <input type="number" value={qty} onChange={e=>setQty(e.target.value)} placeholder="Quantity" className="w-full p-2 border"/>
                </div>
                <div className="mt-4 flex justify-between">
                    <button type="button" className="btn" onClick={onClose}>Cancel</button>
                    <button disabled={loading} className="btn-primary" type="submit">{loading ? "..." : "Execute"}</button>
                </div>
            </form>
        </div>
    );
}
