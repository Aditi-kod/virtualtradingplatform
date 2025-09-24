import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import History from "./pages/History";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";


function App(){
    const token = localStorage.getItem("token");
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={ token ? <Navigate to="/dashboard"/> : <Navigate to="/login"/> } />
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/market" element={<Market/>}/>
                    <Route path="/history" element={<History/>}/>
                    <Route path="/admin" element={<Admin/>}/>
                </Routes>
            </div>
        </div>
    );
}
export default App;
