import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Cek username & password statis
    if (username === "nugra" && password === "081328") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard"); // arahkan ke dashboard setelah login sukses
    } else {
      setError("Username atau password salah!");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "40px auto" }}>
      <h2 style={{ marginBottom: 20, color: "#ff6600" }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: 5 }}>
            Username:
          </label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: 5 }}>
            Password:
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: 10, fontWeight: "600" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            backgroundColor: "#ff6600",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
