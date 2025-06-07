import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaCog,
  FaSignOutAlt,
  FaTable,
  FaComments,
  FaPlus,
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaFileExport,
  FaExclamationTriangle,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Terjadi kesalahan!</h2>
          <p>{this.state.error?.message || "Silakan coba lagi atau periksa konsol browser."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");
  const [commentFormOpen, setCommentFormOpen] = useState(false);
  const [commentFormData, setCommentFormData] = useState({ id: null, name: "", message: "" });
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("dashboardSettings");
    return savedSettings ? JSON.parse(savedSettings) : { theme: "light", language: "id" };
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 600,
      easing: "ease-out",
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboardSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchData = () => {
      setLoading(true);
      setError(null);

      let unsubscribe;
      try {
        if (activeTab === "contacts") {
          unsubscribe = onSnapshot(collection(db, "contacts"), (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setContacts(data);
            setLoading(false);
          }, (error) => {
            console.error("Error fetching contacts:", error);
            setError(error.message);
            setLoading(false);
          });
        } else if (activeTab === "comments") {
          const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
          unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setComments(data);
            setLoading(false);
          }, (error) => {
            console.error("Error fetching comments:", error);
            setError(error.message);
            setLoading(false);
          });
        }
      } catch (error) {
        console.error("Error setting up listener:", error);
        setError(error.message);
        setLoading(false);
      }

      return () => unsubscribe && unsubscribe();
    };

    const unsubscribe = fetchData();
    return () => unsubscribe && unsubscribe();
  }, [navigate, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(settings.language === "id" ? "Apakah kamu yakin ingin menghapus data ini?" : "Are you sure you want to delete this data?");
    if (!confirmDelete) return;

    try {
      if (activeTab === "contacts") {
        await deleteDoc(doc(db, "contacts", id));
        setContacts((prev) => prev.filter((item) => item.id !== id));
      } else if (activeTab === "comments") {
        await deleteDoc(doc(db, "comments", id));
        setComments((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      setError(settings.language === "id" ? "Gagal menghapus data: " + error.message : "Failed to delete data: " + error.message);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComments = comments.filter(
    (comment) =>
      comment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCommentForm = (comment = null) => {
    if (comment) {
      setCommentFormData({ id: comment.id, name: comment.name || "", message: comment.message || "" });
    } else {
      setCommentFormData({ id: null, name: "", message: "" });
    }
    setCommentFormOpen(true);
  };

  const closeCommentForm = () => {
    setCommentFormOpen(false);
    setCommentFormData({ id: null, name: "", message: "" });
  };

  const handleCommentChange = (e) => {
    setCommentFormData({ ...commentFormData, [e.target.name]: e.target.value });
  };

  const submitCommentForm = async (e) => {
    e.preventDefault();
    const { id, name, message } = commentFormData;

    if (!name.trim() || !message.trim()) {
      alert(settings.language === "id" ? "Nama dan Pesan wajib diisi." : "Name and Message are required.");
      return;
    }

    setCommentLoading(true);
    try {
      if (id) {
        await updateDoc(doc(db, "comments", id), { name, message, createdAt: serverTimestamp() });
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, name, message } : c))
        );
      } else {
        const docRef = await addDoc(collection(db, "comments"), {
          name,
          message,
          createdAt: serverTimestamp(),
        });
        setComments((prev) => [...prev, { id: docRef.id, name, message }]);
      }
      closeCommentForm();
    } catch (error) {
      console.error("Gagal simpan komentar:", error);
      setError(settings.language === "id" ? "Gagal simpan komentar: " + error.message : "Failed to save comment: " + error.message);
    }
    setCommentLoading(false);
  };

  const handleThemeChange = (theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const handleLanguageChange = (language) => {
    setSettings((prev) => ({ ...prev, language }));
  };

  const exportData = () => {
    const data = activeTab === "contacts" ? filteredContacts : filteredComments;
    const csv = [
      activeTab === "contacts"
        ? "Name,Email,Message,Date"
        : "Name,Message,Date",
      ...data.map((item) =>
        activeTab === "contacts"
          ? `"${item.name || "N/A"}","${item.email || "N/A"}","${item.message || "N/A"}","${item.createdAt?.toDate().toLocaleString() || "-"}"`
          : `"${item.name || "N/A"}","${item.message || "N/A"}","${item.createdAt?.toDate().toLocaleString() || "-"}"`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <ErrorBoundary>
      <div className={`dashboard-container ${settings.theme}`}>
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap');

          :root {
            --primary: #F97316;
            --primary-dark: #EA580C;
            --text: #333;
            --text-light: #666;
            --bg-light: #FFF8E1;
            --bg-dark: #2A2A2A;
            --card-bg-light: rgba(255, 248, 225, 0.8);
            --card-bg-dark: rgba(42, 42, 42, 0.8);
            --border: url("data:image/svg+xml,%3Csvg width='12' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6c2 0 3-2 6-2s4 2 6 2' stroke='%23F97316' fill='none'/%3E%3C/svg%3E") repeat;
          }

          .dashboard-container {
            min-height: 100vh;
            font-family: 'Shadows Into Light', cursive;
            background: var(--bg-light);
            color: var(--text);
            position: relative;
            overflow: hidden;
          }

          .dashboard-container.dark {
            background: var(--bg-dark);
            color: #E0E0E0;
          }

          .navbar {
            background: var(--card-bg-light);
            backdrop-filter: blur(5px);
            padding: 12px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
            border-bottom: var(--border);
          }

          .dark .navbar {
            background: var(--card-bg-dark);
          }

          .navbar-brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .logo {
            margin: 0;
            font-size: 2rem;
            color: var(--primary);
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
          }

          .toggle-button {
            background: transparent;
            border: none;
            color: var(--primary);
            font-size: 1.5rem;
            cursor: pointer;
            display: none;
          }

          .nav {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }

          .nav-item {
            background: transparent;
            border: 2px solid var(--primary);
            color: var(--primary);
            padding: 8px 16px;
            font-size: 1.2rem;
            cursor: pointer;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
          }

          .nav-item:hover {
            background: var(--primary);
            color: #FFF;
            transform: translateY(-2px);
          }

          .nav-item.active {
            background: var(--primary);
            color: #FFF;
            font-weight: bold;
            border-color: var(--primary-dark);
          }

          .logout-button {
            background: #CC3300;
            border: none;
            color: #FFF;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 1.2rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
          }

          .logout-button:hover {
            background: #B32D00;
            transform: translateY(-2px);
          }

          .main-content {
            padding: 24px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 12px;
          }

          .title {
            font-size: 2.5rem;
            color: var(--primary);
            margin: 0;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
          }

          .action-buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }

          .search-input {
            padding: 10px 16px;
            font-size: 1.2rem;
            border: var(--border);
            border-radius: 8px;
            background: var(--card-bg-light);
            color: var(--text);
            width: 200px;
            font-family: 'Shadows Into Light', cursive;
          }

          .dark .search-input {
            background: var(--card-bg-dark);
            color: #E0E0E0;
          }

          .add-button, .export-button, .submit-button {
            background: var(--primary);
            border: 2px solid var(--primary-dark);
            color: #FFF;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 1.2rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            font-family: 'Shadows Into Light', cursive;
          }

          .add-button:hover, .export-button:hover, .submit-button:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
          }

          .status-text {
            font-size: 1.5rem;
            color: var(--text-light);
            text-align: center;
            margin: 24px 0;
          }

          .table-container {
            overflow-x: auto;
            border: var(--border);
            border-radius: 12px;
            background: var(--card-bg-light);
            box-shadow: 3px 3px 6px rgba(0,0,0,0.1);
          }

          .dark .table-container {
            background: var(--card-bg-dark);
          }

          .table {
            width: 100%;
            border-collapse: collapse;
          }

          .th {
            padding: 12px 16px;
            text-align: left;
            background: var(--primary);
            color: #FFF;
            font-size: 1.2rem;
            font-weight: bold;
          }

          .td {
            padding: 12px 16px;
            border-bottom: 1px dashed var(--primary);
            font-size: 1.1rem;
            color: var(--text);
          }

          .dark .td {
            color: #E0E0E0;
          }

          .tr-even {
            background: transparent;
          }

          .tr-odd {
            background: rgba(255, 255, 255, 0.05);
          }

          .delete-button, .edit-button {
            background: #CC3300;
            border: none;
            color: #FFF;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            margin-right: 8px;
          }

          .edit-button {
            background: #555;
          }

          .delete-button:hover, .edit-button:hover {
            transform: translateY(-2px);
          }

          .card-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .card {
            background: var(--card-bg-light);
            backdrop-filter: blur(5px);
            border: var(--border);
            border-radius: 12px;
            padding: 16px;
            box-shadow: 3px 3px 6px rgba(0,0,0,0.1);
          }

          .dark .card {
            background: var(--card-bg-dark);
          }

          .card-header {
            font-size: 1.5rem;
            color: var(--primary);
            margin-bottom: 8px;
          }

          .card-content {
            font-size: 1.2rem;
            color: var(--text-light);
          }

          .dark .card-content {
            color: #CCC;
          }

          .card-actions {
            display: flex;
            gap: 12px;
            margin-top: 12px;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
          }

          .modal-content {
            background: var(--card-bg-light);
            border: var(--border);
            border-radius: 12px;
            padding: 24px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            position: relative;
          }

          .dark .modal-content {
            background: var(--card-bg-dark);
          }

          .modal-title {
            font-size: 2rem;
            color: var(--primary);
            margin-bottom: 16px;
          }

          .form-group {
            margin-bottom: 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .form-label {
            font-size: 1.2rem;
            color: var(--primary);
            font-weight: bold;
          }

          .form-input, .form-textarea {
            padding: 12px;
            font-size: 1.2rem;
            border: var(--border);
            border-radius: 8px;
            background: var(--card-bg-light);
            color: var(--text);
            font-family: 'Shadows Into Light', cursive;
            resize: vertical;
            min-height: 80px;
          }

          .dark .form-input, .dark .form-textarea {
            background: var(--card-bg-dark);
            color: #E0E0E0;
          }

          .modal-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 16px;
          }

          .cancel-button {
            background: #CCC;
            color: #333;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Shadows Into Light', cursive;
          }

          .cancel-button:hover {
            background: #BBB;
            transform: translateY(-2px);
          }

          .settings-container, .info-container {
            background: var(--card-bg-light);
            border: var(--border);
            border-radius: 12px;
            padding: 24px;
            max-width: 600px;
            box-shadow: 3px 3px 6px rgba(0,0,0,0.1);
          }

          .dark .settings-container, .dark .info-container {
            background: var(--card-bg-dark);
          }

          .settings-title {
            font-size: 2rem;
            color: var(--primary);
            margin-bottom: 16px;
          }

          .button-group {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }

          .info-text {
            font-size: 1.2rem;
            color: var(--text-light);
            margin-bottom: 12px;
          }

          .dark .info-text {
            color: #CCC;
          }

          .info-subtitle {
            font-size: 1.5rem;
            color: var(--primary);
            margin-bottom: 12px;
          }

          .info-list {
            list-style-type: disc;
            padding-left: 20px;
            margin-bottom: 16px;
            font-size: 1.2rem;
            color: var(--text-light);
          }

          .dark .info-list {
            color: #CCC;
          }

          .support-link {
            color: var(--primary);
            text-decoration: none;
            font-size: 1.2rem;
          }

          .support-link:hover {
            text-decoration: underline;
          }

          .error-container {
            background: #FFE6E6;
            border: var(--border);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            color: #D32F2F;
            font-size: 1.2rem;
            text-align: center;
          }

          .mobile-warning {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            color: #FFF;
            text-align: center;
            padding: 24px;
          }

          .mobile-warning-content {
            background: var(--card-bg-light);
            border: var(--border);
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }

          .dark .mobile-warning-content {
            background: var(--card-bg-dark);
          }

          .mobile-warning-title {
            font-size: 2rem;
            color: var(--primary);
            margin-bottom: 16px;
          }

          .mobile-warning-text {
            font-size: 1.5rem;
            color: var(--text-light);
          }

          .dark .mobile-warning-text {
            color: #CCC;
          }

          @media (min-width: 769px) {
            .card-container {
              display: none;
            }
            .toggle-button {
              display: none;
            }
            .nav {
              display: flex !important;
            }
          }

          @media (max-width: 768px) {
            .table-container {
              display: none;
            }
            .header-row {
              flex-direction: column;
              align-items: stretch;
            }
            .action-buttons {
              flex-direction: column;
              gap: 12px;
            }
            .toggle-button {
              display: block;
            }
            .nav {
              display: none;
              flex-direction: column;
              width: 100%;
              max-height: 0;
              overflow: hidden;
              transition: max-height 0.3s ease;
              background: var(--card-bg-light);
              border: var(--border);
              border-radius: 0 0 12px 12px;
              padding: 12px;
              position: absolute;
              top: 60px;
              left: 0;
              right: 0;
              z-index: 999;
            }
            .dark .nav {
              background: var(--card-bg-dark);
            }
            .nav.open {
              display: flex;
              max-height: 500px;
            }
            .modal-content {
              width: 95%;
              padding: 16px;
            }
            .settings-container, .info-container {
              padding: 16px;
            }
          }

          @media (max-width: 576px) {
            .card {
              padding: 12px;
            }
            .card-header {
              font-size: 1.2rem;
            }
            .card-content {
              font-size: 1rem;
            }
            .modal-content {
              padding: 12px;
            }
            .form-input, .form-textarea {
              font-size: 1rem;
              padding: 8px;
            }
            .settings-container, .info-container {
              padding: 12px;
            }
            .button-group {
              flex-direction: column;
              gap: 8px;
            }
            .title {
              font-size: 2rem;
            }
            .search-input {
              width: 100%;
            }
          }

          @media (max-width: 360px) {
            .card {
              padding: 8px;
            }
            .card-header {
              font-size: 1rem;
            }
            .card-content {
              font-size: 0.9rem;
            }
            .modal-content {
              padding: 8px;
            }
            .form-input, .form-textarea {
              font-size: 0.9rem;
              padding: 6px;
            }
            .settings-container, .info-container {
              padding: 8px;
            }
            .title {
              font-size: 1.8rem;
            }
          }
        `}</style>

        {isMobile && (
          <div className="mobile-warning">
            <div className="mobile-warning-content">
              <FaExclamationTriangle size={40} color="#F97316" />
              <h2 className="mobile-warning-title">
                {settings.language === "id" ? "Perangkat Tidak Didukung" : "Device Not Supported"}
              </h2>
              <p className="mobile-warning-text">
                {settings.language === "id"
                  ? "Dashboard ini hanya dapat diakses melalui perangkat desktop untuk pengalaman terbaik."
                  : "This dashboard is only accessible via desktop devices for the best experience."}
              </p>
            </div>
          </div>
        )}

        <header className="navbar" data-aos="fade-down">
          <div className="navbar-brand">
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt size={16} /> {settings.language === "id" ? "Logout" : "Sign Out"}
            </button>
            <h2 className="logo">Dashboard</h2>
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="toggle-button"
            >
              {navbarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
          <nav className={`nav ${navbarOpen ? "open" : ""}`}>
            <button
              onClick={() => { setActiveTab("contacts"); setSearchTerm(""); setNavbarOpen(false); }}
              className={`nav-item ${activeTab === "contacts" ? "active" : ""}`}
            >
              <FaTable size={16} /> {settings.language === "id" ? "Data Kontak" : "Contacts"}
            </button>
            <button
              onClick={() => { setActiveTab("comments"); setSearchTerm(""); setNavbarOpen(false); }}
              className={`nav-item ${activeTab === "comments" ? "active" : ""}`}
            >
              <FaComments size={16} /> {settings.language === "id" ? "Komentar" : "Comments"}
            </button>
            <button
              onClick={() => { setActiveTab("settings"); setSearchTerm(""); setNavbarOpen(false); }}
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            >
              <FaCog size={16} /> {settings.language === "id" ? "Pengaturan" : "Settings"}
            </button>
            <button
            ck
              onClick={() => { setActiveTab("info"); setSearchTerm(""); setNavbarOpen(false); }}
              className="nav-item ${activeTab}"
            >
              <FaInfoCircle size={16} /> {settings.language === "id" ? "Informasi" : "Info"}
            </button>
          </nav>
        </header>

        <main className="main-content">
          {error && (
            <div className="error-container" data-aos="fade-up">
              <strong>Error:</strong> {error}
            </div>
          )}
          <div className="header-row" data-aos="fade-up">
            <h1 className="title">
              {activeTab === "contacts" ? (settings.language === "id" ? "📋 Kontak Masuk" : "📋 Incoming Contacts") :
               activeTab === "comments" ? (settings.language === "id" ? "💬 Komentar" : "💬 Comments") :
               activeTab === "settings" ? (settings.language === "id" ? "⚙️ Pengaturan" : "⚙️ Settings") :
               (settings.language === "id" ? "ℹ️ Informasi" : "ℹ️ Info")}
            </h1>
            {activeTab !== "settings" && activeTab !== "info" && (
              <div className="action-buttons">
                <input
                  type="text"
                  placeholder={activeTab === "contacts" ? (settings.language === "id" ? "🔍 Cari kontak..." : "🔍 Search contacts...") : (settings.language === "id" ? "🔍 Cari komentar..." : "🔍 Search comments...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {activeTab === "comments" && (
                  <button
                    onClick={() => openCommentForm()}
                    className="add-button"
                  >
                    <FaPlus size={16} /> {settings.language === "id" ? "Tambah Komentar" : "Add Comment"}
                  </button>
                )}
                <button onClick={exportData} className="export-button">
                  <FaFileExport size={16} /> {settings.language === "id" ? "Ekspor Data" : "Export Data"}
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <p className="status-text" data-aos="fade-up">{settings.language === "id" ? "Memuat data..." : "Loading data..."}</p>
          ) : activeTab === "contacts" ? (
            filteredContacts.length === 0 ? (
              <p className="status-text" data-aos="fade-up">{settings.language === "id" ? "📭 Tidak ada data kontak yang cocok." : "📭 No matching contacts found."}</p>
            ) : (
              <>
                <div className="table-container" data-aos="fade-up">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="th">{settings.language === "id" ? "Nama" : "Name"}</th>
                        <th className="th">Email</th>
                        <th className="th">{settings.language === "id" ? "Pesan" : "Message"}</th>
                        <th className="th">{settings.language === "id" ? "Tanggal" : "Date"}</th>
                        <th className="th">{settings.language === "id" ? "Aksi" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact, index) => (
                        <tr
                          key={contact.id || index}
                          className={index % 2 === 0 ? "tr-even" : "tr-odd"}
                        >
                          <td className="td">{contact.name || "N/A"}</td>
                          <td className="td">{contact.email || "N/A"}</td>
                          <td className="td">{contact.message || "N/A"}</td>
                          <td className="td">
                            {contact.createdAt?.toDate().toLocaleString() || "-"}
                          </td>
                          <td className="td">
                            <button
                              onClick={() => handleDelete(contact.id)}
                              className="delete-button"
                              title={settings.language === "id" ? "Hapus kontak" : "Delete contact"}
                              disabled={!contact.id}
                            >
                              <FaTrash size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-container" data-aos="fade-up">
                  {filteredContacts.map((contact, index) => (
                    <div key={contact.id || index} className="card">
                      <div className="card-header">{contact.name || "N/A"}</div>
                      <div className="card-content">
                        <p><strong>Email:</strong> {contact.email || "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Pesan" : "Message"}:</strong> {contact.message || "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Tanggal" : "Date"}:</strong> {contact.createdAt?.toDate().toLocaleString() || "-"}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="delete-button"
                          title={settings.language === "id" ? "Hapus kontak" : "Delete contact"}
                          disabled={!contact.id}
                        >
                          <FaTrash size={12} /> {settings.language === "id" ? "Hapus" : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : activeTab === "comments" ? (
            filteredComments.length === 0 ? (
              <p className="status-text" data-aos="fade-up">{settings.language === "id" ? "💬 Belum ada komentar." : "💬 No comments yet."}</p>
            ) : (
              <>
                <div className="table-container" data-aos="fade-up">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="th">{settings.language === "id" ? "Nama" : "Name"}</th>
                        <th className="th">{settings.language === "id" ? "Komentar" : "Comment"}</th>
                        <th className="th">{settings.language === "id" ? "Tanggal" : "Date"}</th>
                        <th className="th">{settings.language === "id" ? "Aksi" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComments.map((comment, index) => (
                        <tr
                          key={comment.id || index}
                          className={index % 2 === 0 ? "tr-even" : "tr-odd"}
                        >
                          <td className="td">{comment.name || "N/A"}</td>
                          <td className="td">{comment.message || "N/A"}</td>
                          <td className="td">
                            {comment.createdAt?.toDate().toLocaleString() || "-"}
                          </td>
                          <td className="td">
                            <button
                              onClick={() => openCommentForm(comment)}
                              className="edit-button"
                              title={settings.language === "id" ? "Edit komentar" : "Edit comment"}
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="delete-button"
                              title={settings.language === "id" ? "Hapus komentar" : "Delete comment"}
                              disabled={!comment.id}
                            >
                              <FaTrash size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-container" data-aos="fade-up">
                  {filteredComments.map((comment, index) => (
                    <div key={comment.id || index} className="card">
                      <div className="card-header">{comment.name || "N/A"}</div>
                      <div className="card-content">
                        <p><strong>{settings.language === "id" ? "Komentar" : "Comment"}:</strong> {comment.message || "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Tanggal" : "Date"}:</strong> {comment.createdAt?.toDate().toLocaleString() || "-"}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => openCommentForm(comment)}
                          className="edit-button"
                          title={settings.language === "id" ? "Edit komentar" : "Edit comment"}
                        >
                          <FaEdit size={12} /> {settings.language === "id" ? "Edit" : "Edit"}
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="delete-button"
                          title={settings.language === "id" ? "Hapus komentar" : "Delete comment"}
                          disabled={!comment.id}
                        >
                          <FaTrash size={12} /> {settings.language === "id" ? "Hapus" : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : activeTab === "settings" ? (
            <div className="settings-container" data-aos="fade-up">
              <h3 className="settings-title">{settings.language === "id" ? "Pengaturan Dashboard" : "Dashboard Settings"}</h3>
              <div className="form-group">
                <label className="form-label">{settings.language === "id" ? "Tema:" : "Theme:"}</label>
                <div className="button-group">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={settings.theme === "light" ? "submit-button" : "cancel-button"}
                  >
                    {settings.language === "id" ? "Terang" : "Light"}
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={settings.theme === "dark" ? "submit-button" : "cancel-button"}
                  >
                    {settings.language === "id" ? "Gelap" : "Dark"}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{settings.language === "id" ? "Bahasa:" : "Language:"}</label>
                <div className="button-group">
                  <button
                    onClick={() => handleLanguageChange("id")}
                    className={settings.language === "id" ? "submit-button" : "cancel-button"}
                  >
                    Bahasa Indonesia
                  </button>
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={settings.language === "en" ? "submit-button" : "cancel-button"}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="info-container" data-aos="fade-up">
              <h3 className="settings-title">{settings.language === "id" ? "Tentang Dashboard" : "About Dashboard"}</h3>
              <p className="info-text">
                {settings.language === "id" ? 
                  "Dashboard ini dirancang untuk mengelola kontak dan komentar dengan mudah. Gunakan navigasi di atas untuk beralih antara fitur." :
                  "This dashboard is designed to manage contacts and comments easily. Use the navigation above to switch between features."}
              </p>
              <h4 className="info-subtitle">{settings.language === "id" ? "Tips Penggunaan" : "Usage Tips"}</h4>
              <ul className="info-list">
                <li>{settings.language === "id" ? "Gunakan kolom pencarian untuk menemukan data spesifik." : "Use the search field to find specific data."}</li>
                <li>{settings.language === "id" ? "Sesuaikan tema di pengaturan untuk kenyamanan visual." : "Customize the theme in settings for visual comfort."}</li>
                <li>{settings.language === "id" ? "Ekspor data untuk analisis lebih lanjut dalam format CSV." : "Export data for further analysis in CSV format."}</li>
              </ul>
              <p className="info-text"><strong>{settings.language === "id" ? "Versi:" : "Version:"}</strong> 1.2.0</p>
              <p className="info-text"><strong>{settings.language === "id" ? "Dukungan:" : "Support:"}</strong> <a href="mailto:support@example.com" className="support-link">support@example.com</a></p>
            </div>
          )}

          {commentFormOpen && (
            <div className="modal-overlay">
              <div className="modal-content" data-aos="zoom-in">
                <h2 className="modal-title">
                  {commentFormData.id ? (settings.language === "id" ? "Edit Komentar" : "Edit Comment") : (settings.language === "id" ? "Tambah Komentar" : "Add Comment")}
                </h2>
                <form onSubmit={submitCommentForm}>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">{settings.language === "id" ? "Nama:" : "Name:"}</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={commentFormData.name}
                      onChange={handleCommentChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">{settings.language === "id" ? "Komentar:" : "Comment:"}</label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      value={commentFormData.message}
                      onChange={handleCommentChange}
                      required
                      className="form-textarea"
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      type="button"
                      onClick={closeCommentForm}
                      className="cancel-button"
                      disabled={commentLoading}
                    >
                      {settings.language === "id" ? "Batal" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={commentLoading}
                      className="submit-button"
                    >
                      {commentLoading ? (settings.language === "id" ? "Menyimpan..." : "Saving...") : (settings.language === "id" ? "Simpan" : "Save")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;