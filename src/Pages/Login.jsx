import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "nugra" && password === "081328") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } else {
      setError("Username atau password salah!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login Admin</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Masukkan username"
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Masukkan password"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>Masuk</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "linear-gradient(135deg, #ff6600 0%, #ff9966 100%)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px 40px",
    borderRadius: 10,
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    maxWidth: 400,
    width: "100%",
  },
  title: {
    marginBottom: 30,
    textAlign: "center",
    color: "#ff6600",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  error: {
    color: "red",
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#ff6600",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "background-color 0.3s",
  },
};

export default Login;
