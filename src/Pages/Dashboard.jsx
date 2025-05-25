import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaChartPie, FaCog, FaSignOutAlt, FaTable } from "react-icons/fa";

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true); // ✅ Toggle sidebar
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchContacts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "contacts"));
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Apakah kamu yakin ingin menghapus kontak ini?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "contacts", id));
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error("Gagal menghapus kontak:", error);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* ✅ Sidebar Toggle Button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.toggleButton}>
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* ✅ Sidebar */}
      {sidebarOpen && (
        <aside style={styles.sidebar}>
          <h2 style={styles.logo}>📊 Dashboard</h2>
          <nav style={styles.nav}>
            <a href="#" style={styles.navItemActive}><FaTable /> &nbsp;Data Kontak</a>
            <a href="#" style={styles.navItem}><FaChartPie /> &nbsp;Statistik</a>
            <a href="#" style={styles.navItem}><FaCog /> &nbsp;Pengaturan</a>
            <button onClick={handleLogout} style={styles.logoutButton}><FaSignOutAlt /> &nbsp;Logout</button>
          </nav>
        </aside>
      )}

      {/* ✅ Main Content */}
      <main style={{ ...styles.mainContent, marginLeft: sidebarOpen ? 250 : 0 }}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>📋 Kontak Masuk</h1>
          <input
            type="text"
            placeholder="🔍 Cari kontak..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        {loading ? (
          <p style={styles.statusText}>Loading data...</p>
        ) : filteredContacts.length === 0 ? (
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
                  <tr key={contact.id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f8f8f8" }}>
                    <td style={styles.td}>{contact.name}</td>
                    <td style={styles.td}>{contact.email}</td>
                    <td style={styles.td}>{contact.message}</td>
                    <td style={styles.td}>
                      {contact.timestamp?.toDate ? contact.timestamp.toDate().toLocaleString() : "-"}
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => handleDelete(contact.id)} style={styles.deleteButton}>
                        🗑️ Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f0f2f5",
  },
  toggleButton: {
    position: "fixed",
    top: 20,
    left: 20,
    zIndex: 1000,
    backgroundColor: "#ff6600",
    color: "white",
    border: "none",
    borderRadius: "50%",
    padding: 10,
    cursor: "pointer",
    fontSize: 18,
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  sidebar: {
    width: 250,
    backgroundColor: "#ff6600",
    color: "white",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    zIndex: 999,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  navItem: {
    padding: "10px 14px",
    borderRadius: 6,
    color: "white",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.3s",
  },
  navItemActive: {
    padding: "10px 14px",
    borderRadius: 6,
    backgroundColor: "#e65c00",
    color: "white",
    fontWeight: "bold",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
  },
  logoutButton: {
    marginTop: 40,
    padding: "10px 16px",
    backgroundColor: "white",
    color: "#ff6600",
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  mainContent: {
    flex: 1,
    padding: 30,
    marginLeft: 250,
    transition: "margin-left 0.3s",
    width: "100%",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  searchInput: {
    padding: "10px 14px",
    borderRadius: 6,
    border: "1px solid #ccc",
    minWidth: 200,
  },
  statusText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    marginTop: 20,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#ff6600",
    color: "white",
    padding: 12,
    textAlign: "left",
    fontSize: 14,
  },
  td: {
    padding: 12,
    borderBottom: "1px solid #ddd",
    fontSize: 14,
    verticalAlign: "top",
  },
  deleteButton: {
    backgroundColor: "#d63031",
    color: "white",
    padding: "6px 10px",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: "bold",
  },
};

export default Dashboard;