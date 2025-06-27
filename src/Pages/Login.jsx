import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  return (
    <div className={`min-h-screen flex flex-col font-[Shadows Into Light] ${settings.theme === "dark" ? "bg-gradient-to-br from-gray-900 to-gray-700 text-gray-200" : "bg-gradient-to-br from-orange-500 to-orange-300 text-gray-800"}`}>
      {/* {isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div className={`p-6 rounded-lg shadow-lg border-2 border-dashed border-orange-500 ${settings.theme === "dark" ? "bg-gray-800" : "bg-white"} max-w-sm w-full`} data-aos="fade">
            <i className="fas fa-exclamation-triangle text-orange-500 text-2xl mb-4"></i>
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              {settings.language === "id" ? "Perangkat Tidak Didukung" : "Device Not Supported"}
            </h2>
            <p className={`text-lg ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {settings.language === "id"
                ? "Halaman login ini hanya dapat diakses melalui perangkat desktop."
                : "This login page is only accessible via desktop."}
            </p>
          </div>
        </div>
      )} */}

      <header className={`sticky top-0 z-20 p-4 flex justify-between items-center backdrop-blur-md ${settings.theme === "dark" ? "bg-gray-800 bg-opacity-85" : "bg-amber-100 bg-opacity-85"} border-b-2 border-dashed border-orange-500`} data-aos="fade-down">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-orange-500 drop-shadow-md">Admin</h2>
          <button
            className="text-orange-500 text-xl md:hidden"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            {navbarOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
          </button>
        </div>
        <nav className={`${isMobile && !navbarOpen ? "hidden" : "flex"} ${isMobile ? "absolute top-16 left-0 right-0 bg-opacity-85 p-3 border-2 border-dashed border-orange-500 rounded-b-xl" : "flex"} gap-3 ${isMobile ? "flex-col" : "flex-row"} ${settings.theme === "dark" && isMobile ? "bg-gray-800" : isMobile ? "bg-amber-100" : ""}`}>
          <button
            className={`flex items-center gap-2 px-4 py-2 text-orange-500 border-2 border-orange-500 rounded-lg transition-all hover:bg-orange-500 hover:text-white ${navbarOpen || !isMobile ? "" : "bg-orange-500 text-white border-orange-600"}`}
            onClick={() => { navigate("/"); setNavbarOpen(false); }}
          >
            <i className="fas fa-home"></i> {settings.language === "id" ? "Home" : "Home"}
          </button>
          {/* <button
            className={`flex items-center gap-2 px-4 py-2 text-orange-500 border-2 border-orange-500 rounded-lg transition-all hover:bg-orange-500 hover:text-white ${navbarOpen || isMobile ? "bg-orange-500 text-white border-orange-600" : ""}`}
          >
            <i className="fas fa-sign-in-alt"></i> {settings.language === "id" ? "Login" : "Login"}
          </button> */}
        </nav>
      </header>

      <div className="flex-1 flex justify-center items-center p-6">
        <div className={`p-6 rounded-xl shadow-xl border-2 border-dashed border-orange-500 ${settings.theme === "dark" ? "bg-gray-800" : "bg-white"} max-w-md w-full`} data-aos="zoom-in">
          <h2 className="text-2xl font-bold text-orange-500 text-center mb-6 drop-shadow-md">
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
              <div className="mb-4">
                <label className="block text-orange-500 font-bold mb-2">{settings.language === "id" ? "Username" : "Username"}</label>
                <input
                  className={`w-full p-3 border-2 border-dashed border-orange-500 rounded-lg font-[Shadows Into Light] ${settings.theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-amber-50 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all`}
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-orange-500 font-bold mb-2">{settings.language === "id" ? "Password" : "Password"}</label>
                <input
                  className={`w-full p-3 border-2 border-dashed border-orange-500 rounded-lg font-[Shadows Into Light] ${settings.theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-amber-50 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all`}
                  type="password"
                  value={editData.password}
                  onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-orange-500 font-bold mb-2">{settings.language === "id" ? "Nama Lengkap" : "Full Name"}</label>
                <input
                  className={`w-full p-3 border-2 border-dashed border-orange-500 rounded-lg font-[Shadows Into Light] ${settings.theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-amber-50 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all`}
                  value={editData.fullName}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-orange-500 font-bold mb-2">Email</label>
                <input
                  className={`w-full p-3 border-2 border-dashed border-orange-500 rounded-lg font-[Shadows Into Light] ${settings.theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-amber-50 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all`}
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </div>
              {error && <p className={`text-red-500 text-center mb-4 p-2 rounded-lg ${settings.theme === "dark" ? "bg-red-900 bg-opacity-20" : "bg-red-100"}`}>{error}</p>}
              <button
                className="w-full p-3 bg-orange-500 text-white border-2 border-orange-600 rounded-lg font-bold flex items-center justify-center gap-2 font-[Shadows Into Light] hover:bg-orange-600 hover:-translate-y-0.5 transition-all"
                onClick={handleSaveEdit}
              >
                <i className="fas fa-save"></i> {settings.language === "id" ? "Simpan" : "Save"}
              </button>
              <button
                className="w-full text-orange-500 text-center mt-3 underline font-[Shadows Into Light] hover:text-orange-600 transition-all"
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
            <div className={`p-6 rounded-xl ${settings.theme === "dark" ? "bg-gray-800" : "bg-white"}`} data-aos="zoom-in">
              <h2 className="text-2xl font-bold text-orange-500 text-center mb-5">{settings.language === "id" ? "Masukkan Kode Reset" : "Enter Reset Code"}</h2>
              <div className="mb-4">
                <label className="block text-orange-500 font-bold mb-2">{settings.language === "id" ? "Kode Reset" : "Reset Code"}</label>
                <input
                  className={`w-full p-3 border-2 border-dashed border-orange-500 rounded-lg font-[Shadows Into Light] ${settings.theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-amber-50 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all`}
                  placeholder={settings.language === "id" ? "Masukkan kode reset..." : "Enter reset code..."}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                />
              </div>
              {error && <p className={`text-red-500 text-center mb-4 p-2 rounded-lg ${settings.theme === "dark" ? "bg-red-900 bg-opacity-20" : "bg-red-100"}`}>{error}</p>}
              <div className="flex gap-3 justify-end mt-5">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-[Shadows Into Light] hover:bg-gray-400 transition-all"
                  onClick={() => {
                    setShowReset(false);
                    setResetCode("");
                    setError("");
                  }}
                >
                  {settings.language === "id" ? "Batal" : "Cancel"}
                </button>
                <button
                  className="px-4 py-2 bg-orange-500 text-white border-2 border-orange-600 rounded-lg flex items-center gap-2 font-[Shadows Into Light] hover:bg-orange-600 hover:-translate-y-0.5 transition-all"
                  onClick={handleResetCode}
                >
                  <i className="fas fa-key"></i> {settings.language === "id" ? "Verifikasi" : "Verify"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-orange-500 font-bold mb-2">{settings.language === "id" ? "Username" : "Username"}</label>
                  <input
                    type="text"
                    className={`w-full p-3 border-2 border-dashed border-orange-500 rounded-lg font-[Shadows Into Light] ${settings.theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-amber-50 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all`}
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-orange-500 font-bold mb-2">{settings.language === "id" ? "Password" : "Password"}</label>
                  <input
                    type="password"
                    className={`w-full p-3 border-2 border-dashed border-orange-500 rounded-lg font-[Shadows Into Light] ${settings.theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-amber-50 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all`}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                {error && <p className={`text-red-500 text-center mb-4 p-2 rounded-lg ${settings.theme === "dark" ? "bg-red-900 bg-opacity-20" : "bg-red-100"}`}>{error}</p>}
                <button
                  type="submit"
                  className="w-full p-3 bg-orange-500 text-white border-2 border-orange-600 rounded-lg font-bold flex items-center justify-center gap-2 font-[Shadows Into Light] hover:bg-orange-600 hover:-translate-y-0.5 transition-all"
                >
                  <i className="fas fa-lock"></i> {settings.language === "id" ? "Masuk" : "Login"}
                </button>
              </form>
              <button
                className="w-full text-orange-500 text-center mt-3 underline font-[Shadows Into Light] hover:text-orange-600 transition-all"
                onClick={() => setShowReset(true)}
              >
                {settings.language === "id" ? "Lupa Password?" : "Forgot Password?"}
              </button>
            </>
          )}
          <p className={`text-center mt-5 text-sm ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Form login by M21</p>
        </div>
      </div>
    </div>
  );
};

export default Login;