import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register(){
    const [email,setEmail]=useState(""); const [pw,setPw]=useState(""); const navigate = useNavigate();
    async function handle(e){
        e.preventDefault();
        try{
            const res = await api.post("/api/auth/register", { email, password: pw });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        }catch(err){ alert(err?.response?.data?.msg || "Error"); }
    }
    return (
        <form onSubmit={handle} className="max-w-md mx-auto gap-4 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Register</h2>
            <input type="email" className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
            <input type="password" className="input" value={pw} onChange={e=>setPw(e.target.value)} placeholder="password" />
            <button className="btn mt-2 w-full bg-green-700 text-white block text-centre px-4 py-2 hover:bg-green-500 ">Create account</button>
        </form>
    );
}
