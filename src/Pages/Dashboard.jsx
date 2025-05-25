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
  FaChartPie,
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
        <div style={{ padding: 20, color: "red" }}>
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("contacts");
  const [commentFormOpen, setCommentFormOpen] = useState(false);
  const [commentFormData, setCommentFormData] = useState({ id: null, name: "", message: "" });
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({ theme: "light", language: "id", notifications: true });

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    console.log("isLoggedIn:", isLoggedIn); // Debugging
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
            console.log("Contacts data:", data); // Debugging
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
            console.log("Comments data:", data); // Debugging
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

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      <div style={{ ...styles.container, backgroundColor: settings.theme === "dark" ? "#222" : "#f9f9f9", color: settings.theme === "dark" ? "#fff" : "#333" }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={styles.toggleButton}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        <aside style={{ ...styles.sidebar, transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
          <h2 style={styles.logo}>📊 Dashboard</h2>
          <nav style={styles.nav}>
            <button
              onClick={() => { setActiveTab("contacts"); setSearchTerm(""); }}
              style={activeTab === "contacts" ? styles.navItemActive : styles.navItem}
            >
              <FaTable /> {settings.language === "id" ? "Data Kontak" : "Contacts"}
            </button>
            <button
              onClick={() => { setActiveTab("comments"); setSearchTerm(""); }}
              style={activeTab === "comments" ? styles.navItemActive : styles.navItem}
            >
              <FaComments /> {settings.language === "id" ? "Komentar" : "Comments"}
            </button>
            <button
              onClick={() => { setActiveTab("statistics"); setSearchTerm(""); }}
              style={activeTab === "statistics" ? styles.navItemActive : styles.navItem}
            >
              <FaChartPie /> {settings.language === "id" ? "Statistik" : "Statistics"}
            </button>
            <button
              onClick={() => { setActiveTab("settings"); setSearchTerm(""); }}
              style={activeTab === "settings" ? styles.navItemActive : styles.navItem}
            >
              <FaCog /> {settings.language === "id" ? "Pengaturan" : "Settings"}
            </button>
            <button
              onClick={() => { setActiveTab("info"); setSearchTerm(""); }}
              style={activeTab === "info" ? styles.navItemActive : styles.navItem}
            >
              <FaInfoCircle /> {settings.language === "id" ? "Informasi" : "Info"}
            </button>
            <button onClick={handleLogout} style={styles.logoutButton}>
              <FaSignOutAlt /> {settings.language === "id" ? "Logout" : "Sign Out"}
            </button>
          </nav>
        </aside>

        <main style={{ ...styles.mainContent, marginLeft: sidebarOpen ? 250 : 0 }}>
          {error && (
            <div style={{ color: "red", marginBottom: 16, padding: "10px", backgroundColor: "#ffe6e6", borderRadius: 4 }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          <div style={styles.headerRow}>
            <h1 style={styles.title}>
              {activeTab === "contacts" ? (settings.language === "id" ? "📋 Kontak Masuk" : "📋 Incoming Contacts") :
               activeTab === "comments" ? (settings.language === "id" ? "💬 Komentar" : "💬 Comments") :
               activeTab === "statistics" ? (settings.language === "id" ? "📊 Statistik" : "📊 Statistics") :
               activeTab === "settings" ? (settings.language === "id" ? "⚙️ Pengaturan" : "⚙️ Settings") :
               (settings.language === "id" ? "ℹ️ Informasi" : "ℹ️ Info")}
            </h1>
            {activeTab !== "settings" && activeTab !== "statistics" && activeTab !== "info" && (
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
                    <FaPlus /> {settings.language === "id" ? "Tambah Komentar" : "Add Comment"}
                  </button>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <p style={styles.statusText}>{settings.language === "id" ? "Memuat data..." : "Loading data..."}</p>
          ) : activeTab === "contacts" ? (
            filteredContacts.length === 0 ? (
              <p style={styles.statusText}>{settings.language === "id" ? "📭 Tidak ada data kontak yang cocok." : "📭 No matching contacts found."}</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
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
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === "comments" ? (
            filteredComments.length === 0 ? (
              <p style={styles.statusText}>{settings.language === "id" ? "💬 Belum ada komentar." : "💬 No comments yet."}</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
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
                            <FaEdit />
                          </button>{" "}
                          <button
                            onClick={() => handleDelete(comment.id)}
                            style={styles.deleteButton}
                            title={settings.language === "id" ? "Hapus komentar" : "Delete comment"}
                            disabled={!comment.id}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === "statistics" ? (
            <div style={styles.statsContainer}>
              <h3 style={{ fontSize: 20, marginBottom: 16 }}>{settings.language === "id" ? "Ringkasan Data" : "Data Summary"}</h3>
              <div style={styles.statsBox}>
                <p><strong>{settings.language === "id" ? "Total Kontak:" : "Total Contacts:"}</strong> {contacts.length}</p>
                <p><strong>{settings.language === "id" ? "Total Komentar:" : "Total Comments:"}</strong> {comments.length}</p>
                <p><strong>{settings.language === "id" ? "Kontak Terbaru:" : "Latest Contact:"}</strong> {contacts[0]?.createdAt?.toDate().toLocaleString() || "-"}</p>
                <p><strong>{settings.language === "id" ? "Komentar Terbaru:" : "Latest Comment:"}</strong> {comments[0]?.createdAt?.toDate().toLocaleString() || "-"}</p>
              </div>
              <button onClick={exportData} style={styles.submitButton}>
                <FaFileExport /> {settings.language === "id" ? "Ekspor Data" : "Export Data"}
              </button>
            </div>
          ) : activeTab === "settings" ? (
            <div style={styles.settingsContainer}>
              <h3 style={{ fontSize: 20, marginBottom: 16 }}>{settings.language === "id" ? "Pengaturan Dashboard" : "Dashboard Settings"}</h3>
              <div style={styles.formGroup}>
                <label htmlFor="theme" style={{ fontWeight: "bold" }}>{settings.language === "id" ? "Tema:" : "Theme:"}</label>
                <select
                  name="theme"
                  id="theme"
                  value={settings.theme}
                  onChange={handleSettingsChange}
                  style={styles.formInput}
                >
                  <option value="light">{settings.language === "id" ? "Terang" : "Light"}</option>
                  <option value="dark">{settings.language === "id" ? "Gelap" : "Dark"}</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="language" style={{ fontWeight: "bold" }}>{settings.language === "id" ? "Bahasa:" : "Language:"}</label>
                <select
                  name="language"
                  id="language"
                  value={settings.language}
                  onChange={handleSettingsChange}
                  style={styles.formInput}
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleSettingsChange}
                    style={{ width: 16, height: 16 }}
                  />
                  {settings.language === "id" ? "Aktifkan Notifikasi" : "Enable Notifications"}
                </label>
              </div>
              <button onClick={exportData} style={styles.submitButton}>
                <FaFileExport /> {settings.language === "id" ? "Ekspor Data Saat Ini" : "Export Current Data"}
              </button>
            </div>
          ) : (
            <div style={styles.infoContainer}>
              <h3 style={{ fontSize: 20, marginBottom: 16 }}>{settings.language === "id" ? "Tentang Dashboard" : "About Dashboard"}</h3>
              <p style={{ marginBottom: 12 }}>{settings.language === "id" ? 
                "Dashboard ini dirancang untuk mengelola kontak dan komentar dengan mudah. Gunakan tab navigasi di sisi kiri untuk beralih antara fitur." :
                "This dashboard is designed to manage contacts and comments easily. Use the navigation tabs on the left to switch between features."}</p>
              <h4 style={{ fontSize: 18, marginBottom: 8 }}>{settings.language === "id" ? "Tips Penggunaan" : "Usage Tips"}</h4>
              <ul style={{ listStyleType: "disc", paddingLeft: 20, marginBottom: 12 }}>
                <li>{settings.language === "id" ? "Gunakan kolom pencarian untuk menemukan data spesifik." : "Use the search field to find specific data."}</li>
                <li>{settings.language === "id" ? "Sesuaikan tema di pengaturan untuk kenyamanan visual." : "Customize the theme in settings for visual comfort."}</li>
                <li>{settings.language === "id" ? "Ekspor data untuk analisis lebih lanjut dalam format CSV." : "Export data for further analysis in CSV format."}</li>
              </ul>
              <p><strong>{settings.language === "id" ? "Versi:" : "Version:"}</strong> 1.2.0</p>
              <p><strong>{settings.language === "id" ? "Dukungan:" : "Support:"}</strong> <a href="mailto:support@example.com" style={{ color: "#ff6600" }}>support@example.com</a></p>
            </div>
          )}

          {commentFormOpen && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <h2>{commentFormData.id ? (settings.language === "id" ? "Edit Komentar" : "Edit Comment") : (settings.language === "id" ? "Tambah Komentar" : "Add Comment")}</h2>
                <form onSubmit={submitCommentForm}>
                  <div style={styles.formGroup}>
                    <label htmlFor="name">{settings.language === "id" ? "Nama:" : "Name:"}</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={commentFormData.name}
                      onChange={handleCommentChange}
                      required
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="message">{settings.language === "id" ? "Komentar:" : "Comment:"}</label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      value={commentFormData.message}
                      onChange={handleCommentChange}
                      required
                      style={styles.formTextarea}
                    />
                  </div>
                  <div style={{ marginTop: 16, textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={closeCommentForm}
                      style={styles.cancelButton}
                      disabled={commentLoading}
                    >
                      {settings.language === "id" ? "Batal" : "Cancel"}
                    </button>{" "}
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
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  toggleButton: {
    position: "fixed",
    top: 15,
    left: 15,
    backgroundColor: "#ff6600",
    border: "none",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 6,
    cursor: "pointer",
    zIndex: 1001,
    fontSize: 22,
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "background-color 0.2s",
  },
  sidebar: {
    width: 250,
    backgroundColor: "#ff6600",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    transition: "transform 0.3s ease",
    boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
  },
  logo: {
    margin: 0,
    marginBottom: 30,
    fontWeight: "bold",
    fontSize: 24,
    userSelect: "none",
    textAlign: "center",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flexGrow: 1,
  },
  navItem: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    padding: "12px 16px",
    textAlign: "left",
    fontSize: 16,
    cursor: "pointer",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    transition: "background-color 0.2s",
  },
  navItemActive: {
    backgroundColor: "#e65c00",
    border: "none",
    color: "#fff",
    padding: "12px 16px",
    textAlign: "left",
    fontSize: 16,
    cursor: "pointer",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: "bold",
    transition: "background-color 0.2s",
  },
  logoutButton: {
    marginTop: "auto",
    backgroundColor: "#cc3300",
    border: "none",
    color: "#fff",
    padding: "12px 16px",
    cursor: "pointer",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 16,
    transition: "background-color 0.2s",
  },
  mainContent: {
    flexGrow: 1,
    padding: 30,
    transition: "margin-left 0.3s ease",
    minHeight: "100vh",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12,
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: "bold",
  },
  searchInput: {
    padding: "10px 14px",
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #bbb",
    width: 240,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#ff6600",
    border: "none",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "background-color 0.2s",
  },
  statusText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#666",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: 6,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  th: {
    borderBottom: "2px solid #ff6600",
    padding: "12px 16px",
    textAlign: "left",
    backgroundColor: "#ffe6cc",
    fontWeight: "bold",
  },
  td: {
    padding: "12px 16px",
    verticalAlign: "top",
    borderBottom: "1px solid #ddd",
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
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
    transition: "background-color 0.2s",
  },
  editButton: {
    backgroundColor: "#555",
    border: "none",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
    transition: "background-color 0.2s",
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
    borderRadius: 8,
    padding: 24,
    width: "100%",
    maxWidth: 450,
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  },
  formGroup: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  formInput: {
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  },
  formTextarea: {
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    resize: "vertical",
    backgroundColor: "#fff",
    minHeight: 100,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    padding: "10px 20px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 16,
    transition: "background-color 0.2s",
  },
  submitButton: {
    backgroundColor: "#ff6600",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "background-color 0.2s",
  },
  statsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    maxWidth: 600,
  },
  statsBox: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 6,
  },
  settingsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    maxWidth: 600,
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    maxWidth: 600,
  },
};

export default Dashboard;