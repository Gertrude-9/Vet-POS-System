import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");

  const handleLogin = (e) => {
    e.preventDefault();

    // TODO: Add authentication logic here if needed

    // Redirect based on role
    switch (role) {
      case "Admin":
        navigate("/admin-dashboard");
        break;
      case "Cashier":
        navigate("/cashier-dashboard");
        break;
      case "Inventory Manager":
        navigate("/inventory-manager-dashboard");
        break;
      default:
        alert("Invalid role selected");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">VET-POS System</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="Admin">Admin</option>
            <option value="Cashier">Cashier</option>
            <option value="Inventory Manager">Inventory Manager</option>
          </select>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          © VET-POS 2025
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
