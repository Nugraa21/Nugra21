import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
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

  return (
    <ErrorBoundary>
      <div style={styles.container}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={styles.toggleButton}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {sidebarOpen && (
          <aside style={styles.sidebar}>
            <h2 style={styles.logo}>📊 Dashboard</h2>
            <nav style={styles.nav}>
              <button
                onClick={() => {
                  setActiveTab("contacts");
                  setSearchTerm("");
                }}
                style={activeTab === "contacts" ? styles.navItemActive : styles.navItem}
              >
                <FaTable /> Data Kontak
              </button>
              <button
                onClick={() => {
                  setActiveTab("comments");
                  setSearchTerm("");
                }}
                style={activeTab === "comments" ? styles.navItemActive : styles.navItem}
              >
                <FaComments /> Komentar
              </button>
              <a href="#" style={styles.navItem}>
                <FaChartPie /> Statistik
              </a>
              <a href="#" style={styles.navItem}>
                <FaCog /> Pengaturan
              </a>
              <button onClick={handleLogout} style={styles.logoutButton}>
                <FaSignOutAlt /> Logout
              </button>
            </nav>
          </aside>
        )}

        <main style={{ ...styles.mainContent, marginLeft: sidebarOpen ? 250 : 0 }}>
          {error && (
            <div style={{ color: "red", marginBottom: 16 }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          <div style={styles.headerRow}>
            <h1 style={styles.title}>
              {activeTab === "contacts" ? "📋 Kontak Masuk" : "💬 Komentar"}
            </h1>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder={activeTab === "contacts" ? "🔍 Cari kontak..." : "🔍 Cari komentar..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          {loading ? (
            <p style={styles.statusText}>Loading data...</p>
          ) : activeTab === "contacts" ? (
            filteredContacts.length === 0 ? (
              <p style={styles.statusText}>📭 Tidak ada data kontak yang cocok.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Nama</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Pesan</th>
                      <th style={styles.th}>Tanggal</th>
                      <th style={styles.th}>Aksi</th>
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
                            title="Hapus kontak"
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
          ) : (
            filteredComments.length === 0 ? (
              <p style={styles.statusText}>💬 Belum ada komentar.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Nama</th>
                      <th style={styles.th}>Komentar</th>
                      <th style={styles.th}>Tanggal</th>
                      <th style={styles.th}>Aksi</th>
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
                            onClick={() => handleDelete(comment.id)}
                            style={styles.deleteButton}
                            title="Hapus komentar"
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
          )}

          {commentFormOpen && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <h2>{commentFormData.id ? "Edit Komentar" : "Tambah Komentar"}</h2>
                <form onSubmit={submitCommentForm}>
                  <div style={styles.formGroup}>
                    <label htmlFor="name">Nama:</label>
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
                    <label htmlFor="message">Komentar:</label>
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
                      Batal
                    </button>{" "}
                    <button
                      type="submit"
                      disabled={commentLoading}
                      style={styles.submitButton}
                    >
                      {commentLoading ? "Menyimpan..." : "Simpan"}
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
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  toggleButton: {
    position: "fixed",
    top: 10,
    left: 10,
    backgroundColor: "#ff6600",
    border: "none",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 4,
    cursor: "pointer",
    zIndex: 1001,
    fontSize: 20,
  },
  sidebar: {
    width: 250,
    backgroundColor: "#ff6600",
    color: "#fff",
    padding: "20px 15px",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
  },
  logo: {
    margin: 0,
    marginBottom: 30,
    fontWeight: "bold",
    fontSize: 22,
    userSelect: "none",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  navItem: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    padding: "10px 15px",
    textAlign: "left",
    fontSize: 16,
    cursor: "pointer",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
  },
  navItemActive: {
    backgroundColor: "#e65c00",
    border: "none",
    color: "#fff",
    padding: "10px 15px",
    textAlign: "left",
    fontSize: 16,
    cursor: "pointer",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: "auto",
    backgroundColor: "#cc3300",
    border: "none",
    color: "#fff",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  mainContent: {
    flexGrow: 1,
    padding: 20,
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
    fontSize: 26,
  },
  searchInput: {
    padding: "8px 12px",
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
    width: 220,
  },
  addButton: {
    backgroundColor: "#ff6600",
    border: "none",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 16,
    fontStyle: "italic",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    borderBottom: "2px solid #ff6600",
    padding: "10px 15px",
    textAlign: "left",
    backgroundColor: "#ffe6cc",
  },
  td: {
    padding: "10px 15px",
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
    padding: "6px 10px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
  },
  editButton: {
    backgroundColor: "#007acc",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
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
    width: 400,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  formGroup: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
  },
  formInput: {
    padding: "8px 10px",
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  formTextarea: {
    padding: "8px 10px",
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
    resize: "vertical",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#ff6600",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 16,
  },
};

export default Dashboard;