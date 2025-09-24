import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode"; // fixed import

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    // check if user is logged in (simple: token in localStorage)
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token); // decode token
                setRole(decoded.role); // "user" or "admin"
            } catch (err) {
                console.error("Invalid token", err);
                setRole(null);
            }
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setRole(null);
        navigate("/login");
    };

    return (
        <nav className="bg-green-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold tracking-wide">
                        VirtualTrade
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/dashboard" className="hover:text-green-300">Dashboard</Link>
                        <Link to="/market" className="hover:text-green-300">Market</Link>
                        <Link to="/history" className="hover:text-green-300">History</Link>

                        {/* Only show Admin if role === "admin" */}
                        {role === "admin" && (
                            <Link to="/admin" className="hover:text-green-300">Admin</Link>
                        )}

                        {/* Auth Buttons */}
                        {!isLoggedIn ? (
                            <Link
                                to="/login"
                                className="px-3 py-1 bg-green-600 rounded-lg hover:bg-green-500 transition"
                            >
                                Login
                            </Link>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-500 transition"
                            >
                                Logout
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-md hover:bg-green-700"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? "✖" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-green-700">
                    <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-green-600"
                        onClick={() => setIsOpen(false)}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/market"
                        className="block px-4 py-2 hover:bg-green-600"
                        onClick={() => setIsOpen(false)}
                    >
                        Market
                    </Link>
                    <Link
                        to="/history"
                        className="block px-4 py-2 hover:bg-green-600"
                        onClick={() => setIsOpen(false)}
                    >
                        History
                    </Link>

                    {/* Only show Admin if role === "admin" */}
                    {role === "admin" && (
                        <Link
                            to="/admin"
                            className="block px-4 py-2 hover:bg-green-600"
                            onClick={() => setIsOpen(false)}
                        >
                            Admin
                        </Link>
                    )}

                    {/* Auth Buttons in Mobile */}
                    {!isLoggedIn ? (
                        <Link
                            to="/login"
                            className="block px-4 py-2 bg-green-600 hover:bg-green-500"
                            onClick={() => setIsOpen(false)}
                        >
                            Login
                        </Link>
                    ) : (
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 bg-red-600 hover:bg-red-500"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
