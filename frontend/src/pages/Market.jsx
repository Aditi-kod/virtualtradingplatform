import React, { useEffect, useState } from "react";
import api from "../services/api";
import TradeModal from "../components/TradeModal";

export default function Market(){
    const [symbols, setSymbols] = useState(["BTCUSDT","ETHUSDT","AAPL","EURUSD"]);
    const [prices, setPrices] = useState({});
    const [open, setOpen] = useState({open:false, symbol: null});

    useEffect(()=>{
        let mounted = true;
        async function load(){
            const q = {};
            for(const s of symbols){
                const r = await api.get(`/api/market/${s}`);
                q[s] = r.data.price;
            }
            if(mounted) setPrices(q);
        }
        load();
        const id = setInterval(async ()=>{
            for(const s of symbols){
                const r = await api.get(`api/market/${s}`);
                setPrices(prev => ({...prev, [s]: r.data.price}));
            }
        }, 4000);
        return ()=> { mounted = false; clearInterval(id); };
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold">Market</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {symbols.map(s=>(
                    <div key={s} className="p-4 bg-white rounded shadow">
                        <div className="flex justify-between">
                            <div>{s}</div>
                            <div className="font-medium">{ prices[s] ? Number(prices[s]).toFixed(4) : "..." }</div>
                        </div>
                        <div className="mt-3">
                            <button onClick={()=>setOpen({open:true, symbol:s})} className="btn">Trade</button>
                        </div>
                    </div>
                ))}
            </div>

            {open.open && <TradeModal symbol={open.symbol} onClose={()=>setOpen({open:false, symbol:null})} />}
        </div>
    );
}
