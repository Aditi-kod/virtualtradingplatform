import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [trades, setTrades] = useState([]);
    const [newUser, setNewUser] = useState({ email: "", name: "", password: "" });

    // load users + trades
    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const u = await api.get("/api/admin/users");
            setUsers(u.data);

            const t = await api.get("/api/admin/trades");
            setTrades(t.data);
        } catch (err) {
            alert(err?.response?.data?.msg || "Admin API error");
        }
    }

    // reset user wallet
    async function resetBalance(userId) {
        if (!window.confirm("Reset this user's balance?")) return;
        try {
            await api.post(`/api/admin/reset/${userId}`);
            alert("Balance reset!");
            loadData();
        } catch (err) {
            alert(err?.response?.data?.msg || "Reset error");
        }
    }

    // delete user
    async function deleteUser(userId) {
        if (!window.confirm("Delete this user?")) return;
        try {
            await api.delete(`/api/admin/user/${userId}`);
            alert("User deleted!");
            loadData();
        } catch (err) {
            alert(err?.response?.data?.msg || "Delete error");
        }
    }

    // add user
    async function addUser(e) {
        e.preventDefault();
        try {
            await api.post("/api/auth/register", newUser); // backend register
            alert("User added!");
            setNewUser({ email: "", name: "", password: "" });
            loadData();
        } catch (err) {
            alert(err?.response?.data?.msg || "Add error");
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

            {/* Add user */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New User</h2>
                <form onSubmit={addUser} className="bg-white p-4 rounded shadow w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="w-full border px-3 py-2 mb-2 rounded"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full border px-3 py-2 mb-2 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full border px-3 py-2 mb-2 rounded"
                    />
                    <button className="px-4 py-2 bg-green-600 text-white rounded">Add User</button>
                </form>
            </section>

            {/* Users section */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Users</h2>
                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="py-2 px-3">Email</th>
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3">Role</th>
                        <th className="py-2 px-3">Created</th>
                        <th className="py-2 px-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => (
                        <tr key={u._id} className="border-t">
                            <td className="py-2 px-3">{u.email}</td>
                            <td className="py-2 px-3">{u.name}</td>
                            <td className="py-2 px-3">{u.role}</td>
                            <td className="py-2 px-3">
                                {new Date(u.createdAt).toLocaleString()}
                            </td>
                            <td className="py-2 px-3 space-x-2">
                                <button
                                    onClick={() => resetBalance(u._id)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded"
                                >
                                    Reset Balance
                                </button>
                                <button
                                    onClick={() => deleteUser(u._id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>

            {/* Trades section */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Recent Trades</h2>
                <div className="space-y-2">
                    {trades.map((t) => (
                        <div
                            key={t._id}
                            className="p-3 bg-white rounded shadow flex justify-between"
                        >
                            <div>
                                <div>
                                    {t.symbol} — {t.side.toUpperCase()} {t.quantity}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Price: {Number(t.price).toFixed(6)} |{" "}
                                    {new Date(t.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <div className="text-sm text-gray-700">User: {t.userId}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
