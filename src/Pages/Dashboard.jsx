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
  FaLanguage,
  FaFileExport,
} from "react-icons/fa";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "16px", color: "#d32f2f" }}>
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
  const [settings, setSettings] = useState({ theme: "light", language: "id" });

  const navigate = useNavigate();

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
    const confirmDelete = window.confirm("Apakah kamu yakin ingin menghapus data ini?");
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
      setError("Gagal menghapus data: " + error.message);
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
      alert("Nama dan Pesan wajib diisi.");
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
      setError("Gagal simpan komentar: " + error.message);
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
      <div style={{ ...styles.container, backgroundColor: settings.theme === "dark" ? "#1a1a1a" : "#f5f5f5", color: settings.theme === "dark" ? "#e0e0e0" : "#333" }}>
        <style jsx>{`
          * {
            box-sizing: border-box;
          }
          .card-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .card {
            background-color: ${settings.theme === "dark" ? "#2a2a2a" : "#fff"};
            border-radius: 6px;
            padding: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border: 1px solid ${settings.theme === "dark" ? "#444" : "#ddd"};
          }
          .card-header {
            font-weight: bold;
            font-size: 0.95rem;
            margin-bottom: 6px;
            color: ${settings.theme === "dark" ? "#fff" : "#333"};
          }
          .card-content {
            font-size: 0.85rem;
            color: ${settings.theme === "dark" ? "#ccc" : "#555"};
          }
          .card-actions {
            display: flex;
            gap: 6px;
            margin-top: 10px;
          }
          @media (min-width: 769px) {
            .card-container {
              display: none;
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
              gap: 6px;
            }
            .navbar {
              flex-direction: column;
              align-items: flex-start;
            }
            .navbar-nav {
              width: 100%;
              transition: max-height 0.3s ease;
              overflow: hidden;
              max-height: ${navbarOpen ? "500px" : "0"};
            }
            .modal-content {
              width: 90%;
              padding: 14px;
            }
            .settings-container, .info-container {
              padding: 14px;
            }
          }
          @media (max-width: 576px) {
            .card {
              padding: 10px;
            }
            .card-header {
              font-size: 0.9rem;
            }
            .card-content {
              font-size: 0.8rem;
            }
            .modal-content {
              padding: 10px;
            }
            .form-input, .form-textarea {
              font-size: 0.8rem;
              padding: 6px;
            }
            .settings-container, .info-container {
              padding: 10px;
            }
            .button-group {
              flex-direction: column;
              gap: 6px;
            }
          }
          @media (max-width: 360px) {
            .card {
              padding: 8px;
            }
            .card-header {
              font-size: 0.85rem;
            }
            .card-content {
              font-size: 0.75rem;
            }
            .modal-content {
              padding: 8px;
            }
            .form-input, .form-textarea {
              font-size: 0.75rem;
              padding: 5px;
            }
            .settings-container, .info-container {
              padding: 8px;
            }
          }
        `}</style>

        <header className="navbar" style={styles.navbar}>
          <div style={styles.navbarBrand}>
            <button onClick={handleLogout} style={styles.logoutButton}>
              <FaSignOutAlt size={12} /> {settings.language === "id" ? "Logout" : "Sign Out"}
            </button>
            <h2 style={styles.logo}>Dashboard</h2>
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              style={styles.toggleButton}
            >
              {navbarOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
            </button>
          </div>
          <nav className="navbar-nav" style={{ ...styles.nav, display: navbarOpen ? "flex" : "none" }}>
            <button
              onClick={() => { setActiveTab("contacts"); setSearchTerm(""); setNavbarOpen(false); }}
              style={activeTab === "contacts" ? styles.navItemActive : styles.navItem}
            >
              <FaTable size={12} /> {settings.language === "id" ? "Data Kontak" : "Contacts"}
            </button>
            <button
              onClick={() => { setActiveTab("comments"); setSearchTerm(""); setNavbarOpen(false); }}
              style={activeTab === "comments" ? styles.navItemActive : styles.navItem}
            >
              <FaComments size={12} /> {settings.language === "id" ? "Komentar" : "Comments"}
            </button>
            <button
              onClick={() => { setActiveTab("settings"); setSearchTerm(""); setNavbarOpen(false); }}
              style={activeTab === "settings" ? styles.navItemActive : styles.navItem}
            >
              <FaCog size={12} /> {settings.language === "id" ? "Pengaturan" : "Settings"}
            </button>
            <button
              onClick={() => { setActiveTab("info"); setSearchTerm(""); setNavbarOpen(false); }}
              style={activeTab === "info" ? styles.navItemActive : styles.navItem}
            >
              <FaInfoCircle size={12} /> {settings.language === "id" ? "Informasi" : "Info"}
            </button>
          </nav>
        </header>

        <main style={styles.mainContent}>
          {error && (
            <div style={styles.error}>
              <strong>Error:</strong> {error}
            </div>
          )}
          <div className="header-row" style={styles.headerRow}>
            <h1 style={styles.title}>
              {activeTab === "contacts" ? (settings.language === "id" ? "📋 Kontak Masuk" : "📋 Incoming Contacts") :
               activeTab === "comments" ? (settings.language === "id" ? "💬 Komentar" : "💬 Comments") :
               activeTab === "settings" ? (settings.language === "id" ? "⚙️ Pengaturan" : "⚙️ Settings") :
               (settings.language === "id" ? "ℹ️ Informasi" : "ℹ️ Info")}
            </h1>
            {activeTab !== "settings" && activeTab !== "info" && (
              <div className="action-buttons" style={styles.actionButtons}>
                <input
                  type="text"
                  placeholder={activeTab === "contacts" ? (settings.language === "id" ? "🔍 Cari kontak..." : "🔍 Search contacts...") : (settings.language === "id" ? "🔍 Cari komentar..." : "🔍 Search comments...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
                {activeTab === "comments" && (
                  <button
                    onClick={() => openCommentForm()}
                    style={styles.addButton}
                  >
                    <FaPlus size={12} /> {settings.language === "id" ? "Tambah Komentar" : "Add Comment"}
                  </button>
                )}
                <button onClick={exportData} style={styles.submitButton}>
                  <FaFileExport size={12} /> {settings.language === "id" ? "Ekspor Data" : "Export Data"}
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <p style={styles.statusText}>{settings.language === "id" ? "Memuat data..." : "Loading data..."}</p>
          ) : activeTab === "contacts" ? (
            filteredContacts.length === 0 ? (
              <p style={styles.statusText}>{settings.language === "id" ? "📭 Tidak ada data kontak yang cocok." : "📭 No matching contacts found."}</p>
            ) : (
              <>
                <div className="table-container" style={{ overflowX: "auto" }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>{settings.language === "id" ? "Nama" : "Name"}</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>{settings.language === "id" ? "Pesan" : "Message"}</th>
                        <th style={styles.th}>{settings.language === "id" ? "Tanggal" : "Date"}</th>
                        <th style={styles.th}>{settings.language === "id" ? "Aksi" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact, index) => (
                        <tr
                          key={contact.id || index}
                          style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                        >
                          <td style={styles.td}>{contact.name || "N/A"}</td>
                          <td style={styles.td}>{contact.email || "N/A"}</td>
                          <td style={styles.td}>{contact.message || "N/A"}</td>
                          <td style={styles.td}>
                            {contact.createdAt?.toDate().toLocaleString() || "-"}
                          </td>
                          <td style={styles.td}>
                            <button
                              onClick={() => handleDelete(contact.id)}
                              style={styles.deleteButton}
                              title={settings.language === "id" ? "Hapus kontak" : "Delete contact"}
                              disabled={!contact.id}
                            >
                              <FaTrash size={10} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-container">
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
                          style={styles.deleteButton}
                          title={settings.language === "id" ? "Hapus kontak" : "Delete contact"}
                          disabled={!contact.id}
                        >
                          <FaTrash size={10} /> {settings.language === "id" ? "Hapus" : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : activeTab === "comments" ? (
            filteredComments.length === 0 ? (
              <p style={styles.statusText}>{settings.language === "id" ? "💬 Belum ada komentar." : "💬 No comments yet."}</p>
            ) : (
              <>
                <div className="table-container" style={{ overflowX: "auto" }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>{settings.language === "id" ? "Nama" : "Name"}</th>
                        <th style={styles.th}>{settings.language === "id" ? "Komentar" : "Comment"}</th>
                        <th style={styles.th}>{settings.language === "id" ? "Tanggal" : "Date"}</th>
                        <th style={styles.th}>{settings.language === "id" ? "Aksi" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComments.map((comment, index) => (
                        <tr
                          key={comment.id || index}
                          style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                        >
                          <td style={styles.td}>{comment.name || "N/A"}</td>
                          <td style={styles.td}>{comment.message || "N/A"}</td>
                          <td style={styles.td}>
                            {comment.createdAt?.toDate().toLocaleString() || "-"}
                          </td>
                          <td style={styles.td}>
                            <button
                              onClick={() => openCommentForm(comment)}
                              style={styles.editButton}
                              title={settings.language === "id" ? "Edit komentar" : "Edit comment"}
                            >
                              <FaEdit size={10} />
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id)}
                              style={styles.deleteButton}
                              title={settings.language === "id" ? "Hapus komentar" : "Delete comment"}
                              disabled={!comment.id}
                            >
                              <FaTrash size={10} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-container">
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
                          style={styles.editButton}
                          title={settings.language === "id" ? "Edit komentar" : "Edit comment"}
                        >
                          <FaEdit size={10} /> {settings.language === "id" ? "Edit" : "Edit"}
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          style={styles.deleteButton}
                          title={settings.language === "id" ? "Hapus komentar" : "Delete comment"}
                          disabled={!comment.id}
                        >
                          <FaTrash size={10} /> {settings.language === "id" ? "Hapus" : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : activeTab === "settings" ? (
            <div className="settings-container" style={styles.settingsContainer}>
              <h3 style={styles.settingsTitle}>{settings.language === "id" ? "Pengaturan Dashboard" : "Dashboard Settings"}</h3>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>{settings.language === "id" ? "Tema:" : "Theme:"}</label>
                <div className="button-group" style={styles.buttonGroup}>
                  <button
                    onClick={() => handleThemeChange("light")}
                    style={settings.theme === "light" ? styles.submitButton : styles.cancelButton}
                  >
                    {settings.language === "id" ? "Terang" : "Light"}
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    style={settings.theme === "dark" ? styles.submitButton : styles.cancelButton}
                  >
                    {settings.language === "id" ? "Gelap" : "Dark"}
                  </button>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>{settings.language === "id" ? "Bahasa:" : "Language:"}</label>
                <div className="button-group" style={styles.buttonGroup}>
                  <button
                    onClick={() => handleLanguageChange("id")}
                    style={settings.language === "id" ? styles.submitButton : styles.cancelButton}
                  >
                    Bahasa Indonesia
                  </button>
                  <button
                    onClick={() => handleLanguageChange("en")}
                    style={settings.language === "en" ? styles.submitButton : styles.cancelButton}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="info-container" style={styles.infoContainer}>
              <h3 style={styles.settingsTitle}>{settings.language === "id" ? "Tentang Dashboard" : "About Dashboard"}</h3>
              <p style={styles.infoText}>
                {settings.language === "id" ? 
                  "Dashboard ini dirancang untuk mengelola kontak dan komentar dengan mudah. Gunakan navigasi di atas untuk beralih antara fitur." :
                  "This dashboard is designed to manage contacts and comments easily. Use the navigation above to switch between features."}
              </p>
              <h4 style={styles.infoSubtitle}>{settings.language === "id" ? "Tips Penggunaan" : "Usage Tips"}</h4>
              <ul style={styles.infoList}>
                <li>{settings.language === "id" ? "Gunakan kolom pencarian untuk menemukan data spesifik." : "Use the search field to find specific data."}</li>
                <li>{settings.language === "id" ? "Sesuaikan tema di pengaturan untuk kenyamanan visual." : "Customize the theme in settings for visual comfort."}</li>
                <li>{settings.language === "id" ? "Ekspor data untuk analisis lebih lanjut dalam format CSV." : "Export data for further analysis in CSV format."}</li>
              </ul>
              <p style={styles.infoText}><strong>{settings.language === "id" ? "Versi:" : "Version:"}</strong> 1.2.0</p>
              <p style={styles.infoText}><strong>{settings.language === "id" ? "Dukungan:" : "Support:"}</strong> <a href="mailto:support@example.com" style={styles.supportLink}>support@example.com</a></p>
            </div>
          )}

          {commentFormOpen && (
            <div style={styles.modalOverlay}>
              <div className="modal-content" style={styles.modalContent}>
                <h2 style={styles.modalTitle}>
                  {commentFormData.id ? (settings.language === "id" ? "Edit Komentar" : "Edit Comment") : (settings.language === "id" ? "Tambah Komentar" : "Add Comment")}
                </h2>
                <form onSubmit={submitCommentForm}>
                  <div style={styles.formGroup}>
                    <label htmlFor="name" style={styles.formLabel}>{settings.language === "id" ? "Nama:" : "Name:"}</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={commentFormData.name}
                      onChange={handleCommentChange}
                      required
                      style={styles.formInput}
                      className="form-input"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="message" style={styles.formLabel}>{settings.language === "id" ? "Komentar:" : "Comment:"}</label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      value={commentFormData.message}
                      onChange={handleCommentChange}
                      required
                      style={styles.formTextarea}
                      className="form-textarea"
                    />
                  </div>
                  <div style={styles.modalActions}>
                    <button
                      type="button"
                      onClick={closeCommentForm}
                      style={styles.cancelButton}
                      disabled={commentLoading}
                    >
                      {settings.language === "id" ? "Batal" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={commentLoading}
                      style={styles.submitButton}
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

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  navbar: {
    backgroundColor: "#ff6600",
    color: "#fff",
    padding: "6px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  navbarBrand: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  logo: {
    margin: 0,
    fontWeight: "bold",
    fontSize: "1.4rem",
  },
  toggleButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    padding: "4px",
    cursor: "pointer",
    fontSize: "1.1rem",
    display: "block",
  },
  nav: {
    display: "flex",
    gap: "4px",
    flexWrap: "wrap",
  },
  navItem: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    fontSize: "0.85rem",
    cursor: "pointer",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "background-color 0.2s, transform 0.2s",
  },
  navItemActive: {
    backgroundColor: "#e65c00",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    fontSize: "0.85rem",
    cursor: "pointer",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontWeight: "bold",
    transition: "background-color 0.2s, transform 0.2s",
  },
  logoutButton: {
    backgroundColor: "#cc3300",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "0.85rem",
    transition: "background-color 0.2s, transform 0.2s",
  },
  mainContent: {
    flexGrow: 1,
    padding: "20px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
    flexWrap: "wrap",
    gap: "6px",
  },
  title: {
    margin: 0,
    fontSize: "1.6rem",
    fontWeight: "bold",
  },
  actionButtons: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  searchInput: {
    padding: "6px 10px",
    fontSize: "0.85rem",
    borderRadius: "3px",
    border: "1px solid #bbb",
    backgroundColor: "#fff",
    width: "180px",
  },
  addButton: {
    backgroundColor: "#ff6600",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "background-color 0.2s, transform 0.2s",
  },
  submitButton: {
    backgroundColor: "#ff6600",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "background-color 0.2s, transform 0.2s",
  },
  statusText: {
    fontSize: "0.95rem",
    fontStyle: "italic",
    color: "#666",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "5px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  th: {
    borderBottom: "2px solid #ff6600",
    padding: "8px 10px",
    textAlign: "left",
    backgroundColor: "#ffe6cc",
    fontWeight: "bold",
    fontSize: "0.85rem",
  },
  td: {
    padding: "8px 10px",
    verticalAlign: "top",
    borderBottom: "1px solid #ddd",
    fontSize: "0.8rem",
  },
  trEven: {
    backgroundColor: "#fff",
  },
  trOdd: {
    backgroundColor: "#f7f7f7",
  },
  deleteButton: {
    backgroundColor: "#cc3300",
    border: "none",
    color: "#fff",
    padding: "5px 8px",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "0.75rem",
    transition: "background-color 0.2s, transform 0.2s",
  },
  editButton: {
    backgroundColor: "#555",
    border: "none",
    color: "#fff",
    padding: "5px 8px",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "0.75rem",
    transition: "background-color 0.2s, transform 0.2s",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: "6px",
    padding: "16px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  modalTitle: {
    fontSize: "1.1rem",
    marginBottom: "10px",
  },
  formGroup: {
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  formLabel: {
    fontWeight: "bold",
    fontSize: "0.85rem",
  },
  formInput: {
    padding: "8px",
    fontSize: "0.85rem",
    borderRadius: "3px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  },
  formTextarea: {
    padding: "8px",
    fontSize: "0.85rem",
    borderRadius: "3px",
    border: "1px solid #ccc",
    resize: "vertical",
    backgroundColor: "#fff",
    minHeight: "70px",
  },
  modalActions: {
    marginTop: "10px",
    textAlign: "right",
    display: "flex",
    gap: "6px",
    justifyContent: "flex-end",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    padding: "6px 12px",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "background-color 0.2s, transform 0.2s",
  },
  settingsContainer: {
    backgroundColor: "#fff",
    padding: "12px",
    borderRadius: "6px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    maxWidth: "450px",
  },
  settingsTitle: {
    fontSize: "1.1rem",
    marginBottom: "10px",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: "12px",
    borderRadius: "6px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    maxWidth: "450px",
  },
  infoText: {
    marginBottom: "6px",
    fontSize: "0.85rem",
  },
  infoSubtitle: {
    fontSize: "0.95rem",
    marginBottom: "6px",
  },
  infoList: {
    listStyleType: "disc",
    paddingLeft: "14px",
    marginBottom: "10px",
    fontSize: "0.85rem",
  },
  supportLink: {
    color: "#ff6600",
    textDecoration: "none",
  },
  error: {
    color: "#d32f2f",
    marginBottom: "10px",
    padding: "6px",
    backgroundColor: "#ffe6e6",
    borderRadius: "3px",
    fontSize: "0.85rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
};

export default Dashboard;