import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const navigate = useNavigate();

    async function handle(e) {
        e.preventDefault();
        try {
            const res = await api.post("/api/auth/login", { email, password: pw });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            alert(err?.response?.data?.msg || "Login error");
        }
    }

    return (
        <form
            onSubmit={handle}
            className="max-w-md mx-auto bg-white p-6 rounded shadow"
        >
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border px-3 py-2 mb-3 rounded"
            />
            <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Password"
                className="w-full border px-3 py-2 mb-3 rounded"
            />
            <button className="btn mt-2 w-full bg-green-700 text-white block text-centre px-4 py-2 hover:bg-green-500 ">Login</button>

            {/* Register redirect */}
            <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">
          Don’t have an account?{" "}
        </span>
                <Link to="/register" className="text-green-600 font-medium hover:underline">
                    Register
                </Link>
            </div>
        </form>
    );
}
