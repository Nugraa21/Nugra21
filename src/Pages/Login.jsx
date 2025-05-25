import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [pwData, setPwData] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [editData, setEditData] = useState({ username: "", password: "", fullName: "", email: "" });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/pw.json")
      .then((res) => res.json())
      .then((data) => {
        setPwData(data);
        setEditData(data); // untuk edit nanti
      })
      .catch(() => setError("Gagal memuat data akun"));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!pwData) return;
    if (form.username === pwData.username && form.password === pwData.password) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } else {
      setError("Username atau password salah!");
    }
  };

  const handleResetCode = () => {
    if (resetCode === "081328") {
      setShowReset("edit");
      setError("");
    } else {
      setError("Kode reset salah!");
    }
  };

  const handleSaveEdit = () => {
    alert("Perubahan berhasil disimpan secara lokal.\n\nUntuk permanen, ubah file `pw.json` di folder /public secara manual.");
    setPwData(editData);
    setShowReset(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login Admin</h2>

        {showReset === "edit" ? (
          <>
            <label style={styles.label}>Username Baru</label>
            <input
              style={styles.input}
              value={editData.username}
              onChange={(e) => setEditData({ ...editData, username: e.target.value })}
            />
            <label style={styles.label}>Password Baru</label>
            <input
              style={styles.input}
              value={editData.password}
              onChange={(e) => setEditData({ ...editData, password: e.target.value })}
            />
            <label style={styles.label}>Nama Lengkap</label>
            <input
              style={styles.input}
              value={editData.fullName}
              onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
            />
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
            <button onClick={handleSaveEdit} style={styles.button}>💾 Simpan Perubahan</button>
          </>
        ) : showReset ? (
          <>
            <input
              style={styles.input}
              placeholder="Masukkan kode reset"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />
            <button onClick={handleResetCode} style={styles.button}>🔓 Verifikasi</button>
          </>
        ) : (
          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                style={styles.input}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                style={styles.input}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.button}>🔐 Masuk</button>
            <p style={{ marginTop: 10, textAlign: "center" }}>
              <button onClick={() => setShowReset(true)} style={styles.linkButton}>
                Lupa password?
              </button>
            </p>
          </form>
        )}
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
    marginBottom: 12,
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
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#ff6600",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "underline",
  },
};

export default Login;
