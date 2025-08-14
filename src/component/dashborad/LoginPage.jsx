// client/src/component/dashboard/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Untuk redirect

export default function LoginPage({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Bersihkan error sebelumnya

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login berhasil
        alert(data.message);
        localStorage.setItem("isAuthenticated", "true"); // Simpan status login
        onLoginSuccess(); // Panggil fungsi dari parent untuk update state
        navigate("/dashboard"); // Arahkan ke dashboard
      } else {
        // Login gagal
        setError(data.message || "Login gagal.");
      }
    } catch (err) {
      console.error("Error saat login:", err);
      setError("Terjadi masalah koneksi. Coba lagi.");
    }
  };

  return (
    <div
      style={{
        padding: "50px",
        maxWidth: "400px",
        margin: "100px auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Login Dashboard Admin
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "calc(100% - 20px)",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
