import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Import dari file firebase.js kamu
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek login di localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    console.log("isLoggedIn:", isLoggedIn);
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
        console.log("Fetched contacts:", data);
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

  if (loading) return <p style={{ textAlign: "center" }}>Loading data...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h2
        style={{ textAlign: "center", color: "#ff6600", marginBottom: 20 }}
      >
        Dashboard Kontak
      </h2>
      <button
        onClick={handleLogout}
        style={{
          marginBottom: 20,
          padding: "8px 16px",
          backgroundColor: "#ff6600",
          border: "none",
          color: "white",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Logout
      </button>

      {contacts.length === 0 ? (
        <p>Tidak ada data kontak.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#ff6600", color: "white" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Nama</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Pesan</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {contact.name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {contact.email}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {contact.message}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {contact.timestamp && contact.timestamp.toDate
                    ? contact.timestamp.toDate().toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
