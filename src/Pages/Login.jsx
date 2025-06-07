import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaSignInAlt, FaExclamationTriangle, FaLock, FaKey, FaSave, FaBars, FaTimes } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [pwData, setPwData] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [editData, setEditData] = useState({ username: "", password: "", fullName: "", email: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("dashboardSettings");
    return savedSettings ? JSON.parse(savedSettings) : { theme: "light", language: "id" };
  });

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ once: true, duration: 600, easing: "ease-out" });
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboardSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    fetch("/pw.json")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data akun");
        return res.json();
      })
      .then((data) => {
        setPwData(data);
        setEditData(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!pwData) {
      setError(settings.language === "id" ? "Data akun belum dimuat!" : "Account data not loaded!");
      return;
    }
    if (form.username === pwData.username && form.password === pwData.password) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } else {
      setError(settings.language === "id" ? "Username atau password salah!" : "Incorrect username or password!");
    }
  };

  const handleResetCode = () => {
    if (resetCode === "081328") {
      setShowReset("edit");
      setError("");
    } else {
      setError(settings.language === "id" ? "Kode reset salah!" : "Incorrect reset code!");
    }
  };

  const handleSaveEdit = () => {
    alert(
      settings.language === "id"
        ? "Perubahan berhasil disimpan secara lokal.\n\nUntuk permanen, ubah file `pw.json` di folder /public secara manual."
        : "Changes saved locally.\n\nFor permanent changes, manually update the `pw.json` file in the /public folder."
    );
    setPwData(editData);
    setShowReset(false);
    setResetCode("");
  };

  const styles = {
    container: {
      background: "linear-gradient(135deg, #ff6600 0%, #ff9966 100%)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Shadows Into Light', cursive",
      color: settings.theme === "dark" ? "#E0E0E0" : "#333",
    },
    navbar: {
      background: settings.theme === "dark" ? "rgba(42, 42, 42, 0.85)" : "rgba(255, 248, 225, 0.85)",
      backdropFilter: "blur(5px)",
      padding: "12px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 100,
      borderBottom: "2px dashed #F97316",
    },
    navbarBrand: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    logo: {
      margin: 0,
      fontSize: "2rem",
      color: "#F97316",
      textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
    },
    toggleButton: {
      background: "none",
      border: "none",
      color: "#F97316",
      fontSize: "1.5rem",
      cursor: "pointer",
      display: isMobile ? "block" : "none",
    },
    nav: {
      display: isMobile && !navbarOpen ? "none" : "flex",
      gap: "12px",
      flexDirection: isMobile ? "column" : "row",
      position: isMobile ? "absolute" : "static",
      top: isMobile ? "60px" : "auto",
      left: 0,
      right: 0,
      background: isMobile ? (settings.theme === "dark" ? "rgba(42, 42, 42, 0.85)" : "rgba(255, 248, 225, 0.85)") : "transparent",
      padding: isMobile ? "12px" : 0,
      border: isMobile ? "2px dashed #F97316" : "none",
      borderRadius: isMobile ? "0 0 12px 12px" : 0,
      zIndex: 99,
    },
    navItem: {
      background: "none",
      border: "2px solid #F97316",
      color: "#F97316",
      padding: "8px 16px",
      fontSize: "1.2rem",
      cursor: "pointer",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
    },
    navItemActive: {
      background: "#F97316",
      color: "#FFF",
      border: "2px solid #EA580C",
    },
    mainContent: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "24px",
    },
    card: {
      background: settings.theme === "dark" ? "#2A2A2A" : "#FFF",
      padding: "24px",
      borderRadius: "10px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      maxWidth: "400px",
      width: "100%",
      border: "2px dashed #F97316",
    },
    title: {
      marginBottom: "24px",
      textAlign: "center",
      color: "#F97316",
      fontSize: "2.2rem",
      textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
    },
    formGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      marginBottom: "6px",
      fontSize: "1.2rem",
      color: "#F97316",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "2px dashed #F97316",
      fontSize: "1.2rem",
      fontFamily: "'Shadows Into Light', cursive",
      background: settings.theme === "dark" ? "rgba(42, 42, 42, 0.85)" : "rgba(255, 248, 225, 0.85)",
      color: settings.theme === "dark" ? "#E0E0E0" : "#333",
    },
    error: {
      color: "#D32F2F",
      fontSize: "1rem",
      textAlign: "center",
      marginBottom: "12px",
      background: settings.theme === "dark" ? "rgba(211, 47, 47, 0.2)" : "rgba(255, 230, 230, 0.8)",
      padding: "8px",
      borderRadius: "6px",
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "#F97316",
      color: "#FFF",
      border: "2px solid #EA580C",
      borderRadius: "6px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      fontFamily: "'Shadows Into Light', cursive",
      transition: "all 0.3s ease",
    },
    buttonHover: {
      background: "#EA580C",
      transform: "translateY(-2px)",
    },
    linkButton: {
      background: "none",
      border: "none",
      color: "#F97316",
      fontSize: "1rem",
      cursor: "pointer",
      fontFamily: "'Shadows Into Light', cursive",
      textDecoration: "underline",
      textAlign: "center",
      display: "block",
      marginTop: "12px",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 200,
    },
    modalContent: {
      background: settings.theme === "dark" ? "#2A2A2A" : "#FFF",
      padding: "24px",
      borderRadius: "10px",
      maxWidth: "400px",
      width: "90%",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      border: "2px dashed #F97316",
    },
    modalTitle: {
      fontSize: "2rem",
      color: "#F97316",
      textAlign: "center",
      marginBottom: "20px",
    },
    modalActions: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
      marginTop: "20px",
    },
    cancelButton: {
      background: "#CCC",
      color: "#333",
      border: "none",
      padding: "10px 16px",
      fontSize: "1.2rem",
      borderRadius: "6px",
      cursor: "pointer",
      fontFamily: "'Shadows Into Light', cursive",
      transition: "all 0.3s ease",
    },
    footer: {
      fontSize: "0.9rem",
      color: settings.theme === "dark" ? "#CCC" : "#666",
      textAlign: "center",
      marginTop: "20px",
    },
    mobileWarning: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.9)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 300,
      color: "#FFF",
      textAlign: "center",
      padding: "24px",
    },
    mobileWarningContent: {
      background: settings.theme === "dark" ? "#2A2A2A" : "#FFF",
      border: "2px dashed #F97316",
      borderRadius: "10px",
      padding: "24px",
      maxWidth: "400px",
      width: "90%",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    },
    mobileWarningTitle: {
      fontSize: "2rem",
      color: "#F97316",
      marginBottom: "16px",
    },
    mobileWarningText: {
      fontSize: "1.5rem",
      color: settings.theme === "dark" ? "#CCC" : "#666",
    },
  };

  return (
    <div style={styles.container}>
      {/* {isMobile && (
        <div style={styles.mobileWarning}>
          <div style={styles.mobileWarningContent} data-aos="fade">
            <FaExclamationTriangle size={24} color="#F97316" />
            <h2 style={styles.mobileWarningTitle}>
              {settings.language === "id" ? "Perangkat Tidak Didukung" : "Device Not Supported"}
            </h2>
            <p style={styles.mobileWarningText}>
              {settings.language === "id"
                ? "Halaman login ini hanya dapat diakses melalui perangkat desktop."
                : "This login page is only accessible via desktop."}
            </p>
          </div>
        </div>
      )} */}

      <header style={styles.navbar} data-aos="fade-down">
        <div style={styles.navbarBrand}>
          <h2 style={styles.logo}>Admin</h2>
          <button style={styles.toggleButton} onClick={() => setNavbarOpen(!navbarOpen)}>
            {navbarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
        <nav style={styles.nav}>
          <button
            style={{ ...styles.navItem, ...(navbarOpen ? {} : styles.navItemActive) }}
            onClick={() => { navigate("/"); setNavbarOpen(false); }}
          >
            <FaHome size={16} /> {settings.language === "id" ? "Home" : "Home"}
          </button>
          <button style={{ ...styles.navItem, ...(navbarOpen ? styles.navItemActive : {}) }}>
            <FaSignInAlt size={16} /> {settings.language === "id" ? "Login" : "Login"}
          </button>
        </nav>
      </header>

      <div style={styles.mainContent}>
        <div style={styles.card} data-aos="zoom-in">
          <h2 style={styles.title}>
            {showReset === "edit"
              ? settings.language === "id"
                ? "✏️ Edit Akun"
                : "✏️ Edit Account"
              : showReset
              ? settings.language === "id"
                ? "🔑 Reset Kode"
                : "🔑 Reset Code"
              : settings.language === "id"
              ? "Login Admin"
              : "Admin Login"}
          </h2>

          {showReset === "edit" ? (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>{settings.language === "id" ? "Username" : "Username"}</label>
                <input
                  style={styles.input}
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>{settings.language === "id" ? "Password" : "Password"}</label>
                <input
                  style={styles.input}
                  type="password"
                  value={editData.password}
                  onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>{settings.language === "id" ? "Nama Lengkap" : "Full Name"}</label>
                <input
                  style={styles.input}
                  value={editData.fullName}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <button style={styles.button} onClick={handleSaveEdit}>
                <FaSave size={16} /> {settings.language === "id" ? "Simpan" : "Save"}
              </button>
              <button
                style={styles.linkButton}
                onClick={() => {
                  setShowReset(false);
                  setResetCode("");
                  setError("");
                }}
              >
                {settings.language === "id" ? "Kembali" : "Back"}
              </button>
            </>
          ) : showReset ? (
            <div style={styles.modalContent} data-aos="zoom-in">
              <h2 style={styles.modalTitle}>{settings.language === "id" ? "Masukkan Kode Reset" : "Enter Reset Code"}</h2>
              <div style={styles.formGroup}>
                <label style={styles.label}>{settings.language === "id" ? "Kode Reset" : "Reset Code"}</label>
                <input
                  style={styles.input}
                  placeholder={settings.language === "id" ? "Masukkan kode reset..." : "Enter reset code..."}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                />
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.modalActions}>
                <button
                  style={styles.cancelButton}
                  onClick={() => {
                    setShowReset(false);
                    setResetCode("");
                    setError("");
                  }}
                >
                  {settings.language === "id" ? "Batal" : "Cancel"}
                </button>
                <button style={styles.button} onClick={handleResetCode}>
                  <FaKey size={16} /> {settings.language === "id" ? "Verifikasi" : "Verify"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleLogin}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>{settings.language === "id" ? "Username" : "Username"}</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>{settings.language === "id" ? "Password" : "Password"}</label>
                  <input
                    type="password"
                    style={styles.input}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>
                  <FaLock size={16} /> {settings.language === "id" ? "Masuk" : "Login"}
                </button>
              </form>
              <button style={styles.linkButton} onClick={() => setShowReset(true)}>
                {settings.language === "id" ? "Lupa Password?" : "Forgot Password?"}
              </button>
            </>
          )}
          <p style={styles.footer}>Form login by M21</p>
        </div>
      </div>
    </div>
  );
};

export default Login;