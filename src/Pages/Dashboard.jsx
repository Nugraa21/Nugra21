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
  FaSignOutAlt,
  FaTable,
  FaComments,
  FaPlus,
  FaEdit,
  FaTrash,
  FaProjectDiagram,
  FaCertificate,
  FaEye,
  FaFileExport,
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
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: null,
    id: null,
    Title: "",
    Description: "",
    Img: "",
    Github: "",
    Link: "",
    TechStack: "",
    Features: "",
    category: "",
    title: "",
    description: "",
    issuer: "",
    date: "",
    name: "",
    message: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      easing: "ease-out-cubic",
    });
  }, []);

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
          }, (err) => {
            console.error("Error fetching contacts:", err);
            setError(err.message);
            setLoading(false);
          });
        } else if (activeTab === "comments") {
          const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
          unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setComments(data);
            setLoading(false);
          }, (err) => {
            console.error("Error fetching comments:", err);
            setError(err.message);
            setLoading(false);
          });
        } else if (activeTab === "projects") {
          const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
          unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setProjects(data);
            setLoading(false);
          }, (err) => {
            console.error("Error fetching projects:", err);
            setError(err.message);
            setLoading(false);
          });
        } else if (activeTab === "certificates") {
          const q = query(collection(db, "certificates"), orderBy("createdAt", "desc"));
          unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCertificates(data);
            setLoading(false);
          }, (err) => {
            console.error("Error fetching certificates:", err);
            setError(err.message);
            setLoading(false);
          });
        }
      } catch (err) {
        console.error("Error setting up listener:", err);
        setError(err.message);
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

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Apakah kamu yakin ingin menghapus ${type.slice(0, -1)} ini?`)) return;

    try {
      await deleteDoc(doc(db, type, id));
      if (type === "contacts") setContacts((prev) => prev.filter((item) => item.id !== id));
      else if (type === "comments") setComments((prev) => prev.filter((item) => item.id !== id));
      else if (type === "projects") setProjects((prev) => prev.filter((item) => item.id !== id));
      else if (type === "certificates") setCertificates((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(`Gagal menghapus ${type}:`, err);
      setError(`Gagal menghapus ${type}: ${err.message}`);
    }
  };

  const filteredData = (data, type) => {
    return data.filter((item) =>
      type === "contacts"
        ? item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.message?.toLowerCase().includes(searchTerm.toLowerCase())
        : type === "comments"
        ? item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.message?.toLowerCase().includes(searchTerm.toLowerCase())
        : type === "projects"
        ? item.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase())
        : item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.issuer?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const openForm = (type, item = null) => {
    if (item) {
      setFormData({
        type,
        id: item.id,
        Title: item.Title || "",
        Description: item.Description || "",
        Img: item.Img || "",
        Github: item.Github || "",
        Link: item.Link || "",
        TechStack: item.TechStack ? item.TechStack.join(", ") : "",
        Features: item.Features ? item.Features.join(", ") : "",
        category: item.category || "",
        title: item.title || "",
        description: item.description || "",
        issuer: item.issuer || "",
        date: item.date || "",
        name: item.name || "",
        message: item.message || "",
      });
    } else {
      setFormData({
        type,
        id: null,
        Title: "",
        Description: "",
        Img: "",
        Github: "",
        Link: "",
        TechStack: "",
        Features: "",
        category: "",
        title: "",
        description: "",
        issuer: "",
        date: "",
        name: "",
        message: "",
      });
    }
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setPreviewOpen(false);
    setFormData({
      type: null,
      id: null,
      Title: "",
      Description: "",
      Img: "",
      Github: "",
      Link: "",
      TechStack: "",
      Features: "",
      category: "",
      title: "",
      description: "",
      issuer: "",
      date: "",
      name: "",
      message: "",
    });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const { type, id } = formData;
    setFormLoading(true);

    try {
      if (type === "comments") {
        const { name, message } = formData;
        if (!name.trim() || !message.trim()) {
          alert("Nama dan Komentar wajib diisi.");
          setFormLoading(false);
          return;
        }
        if (id) {
          await updateDoc(doc(db, "comments", id), { name, message, createdAt: serverTimestamp() });
          setComments((prev) => prev.map((c) => (c.id === id ? { ...c, name, message } : c)));
        } else {
          const docRef = await addDoc(collection(db, "comments"), {
            name,
            message,
            createdAt: serverTimestamp(),
          });
          setComments((prev) => [...prev, { id: docRef.id, name, message }]);
        }
      } else if (type === "projects") {
        const { Title, Description, Img, Github, Link, TechStack, Features, category } = formData;
        if (!Title.trim() || !Description.trim()) {
          alert("Judul dan Deskripsi wajib diisi.");
          setFormLoading(false);
          return;
        }
        const projectData = {
          Title,
          Description,
          Img: Img || "----",
          Github: Github || "----",
          Link: Link || "----",
          TechStack: TechStack ? TechStack.split(",").map((item) => item.trim()) : [],
          Features: Features ? Features.split(",").map((item) => item.trim()) : [],
          category: category || "Project",
          createdAt: serverTimestamp(),
        };
        if (id) {
          await updateDoc(doc(db, "projects", id), projectData);
          setProjects((prev) => prev.map((p) => (p.id === id ? { id, ...projectData } : p)));
        } else {
          const docRef = await addDoc(collection(db, "projects"), projectData);
          setProjects((prev) => [...prev, { id: docRef.id, ...projectData }]);
        }
      } else if (type === "certificates") {
        const { title, description, Img, issuer, date, Link } = formData;
        if (!title.trim() || !description.trim() || !issuer.trim() || !date.trim()) {
          alert("Judul, Deskripsi, Penerbit, dan Tanggal wajib diisi.");
          setFormLoading(false);
          return;
        }
        const certificateData = {
          title,
          description,
          Img: Img || "----",
          issuer,
          date,
          Link: Link || "----",
          createdAt: serverTimestamp(),
        };
        if (id) {
          await updateDoc(doc(db, "certificates", id), certificateData);
          setCertificates((prev) => prev.map((c) => (c.id === id ? { id, ...certificateData } : c)));
        } else {
          const docRef = await addDoc(collection(db, "certificates"), certificateData);
          setCertificates((prev) => [...prev, { id: docRef.id, ...certificateData }]);
        }
      }
      closeForm();
    } catch (err) {
      console.error(`Gagal menyimpan ${type}:`, err);
      setError(`Gagal menyimpan ${type}: ${err.message}`);
    }
    setFormLoading(false);
  };

  const exportData = () => {
    let data, headers, filename;
    if (activeTab === "contacts") {
      data = filteredData(contacts, "contacts");
      headers = "Nama,Email,Pesan,Tanggal";
      filename = "kontak";
    } else if (activeTab === "comments") {
      data = filteredData(comments, "comments");
      headers = "Nama,Komentar,Tanggal";
      filename = "komentar";
    } else if (activeTab === "projects") {
      data = filteredData(projects, "projects");
      headers = "Judul,Deskripsi,Kategori,Teknologi,Fitur,Github,Link,Gambar,Tanggal";
      filename = "proyek";
    } else if (activeTab === "certificates") {
      data = filteredData(certificates, "certificates");
      headers = "Judul,Deskripsi,Penerbit,Tanggal,Gambar,Link";
      filename = "sertifikat";
    }
    const csv = [
      headers,
      ...data.map((item) =>
        activeTab === "contacts"
          ? `"${item.name || "N/A"}","${item.email || "N/A"}","${item.message || "N/A"}","${item.createdAt?.toDate().toLocaleString() || "-"}"`
          : activeTab === "comments"
          ? `"${item.name || "N/A"}","${item.message || "N/A"}","${item.createdAt?.toDate().toLocaleString() || "-"}"`
          : activeTab === "projects"
          ? `"${item.Title || "N/A"}","${item.Description || "N/A"}","${item.category || "N/A"}","${item.TechStack?.join(", ") || "N/A"}","${item.Features?.join(", ") || "N/A"}","${item.Github || "N/A"}","${item.Link || "N/A"}","${item.Img || "N/A"}","${item.createdAt?.toDate().toLocaleString() || "-"}"`
          : `"${item.title || "N/A"}","${item.description || "N/A"}","${item.issuer || "N/A"}","${item.date || "N/A"}","${item.Img || "N/A"}","${item.Link || "N/A"}"`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = document.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ErrorBoundary>
      <div className="dashboard-wrapper">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

          :root {
            --primary: #6366F1;
            --primary-dark: #4F46E5;
            --secondary: #FBBF24;
            --text-dark: #333;
            --text-light: #666;
            --bg-light: #F9FAFB;
            --card-bg: #FFFFFF;
            --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            --border-radius: 8px;
            --transition: all 0.3s ease-in-out;
          }

          .dashboard-wrapper {
            min-height: 100vh;
            font-family: 'Poppins', sans-serif;
            background-color: var(--bg-light);
            color: var(--text-dark);
          }

          .navbar {
            background: var(--card-bg);
            padding: 16px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: var(--card-shadow);
            position: sticky;
            top: 0;
            z-index: 1000;
          }

          .navbar-brand {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .logo {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--primary);
            margin: 0;
          }

          .toggle-button {
            background: none;
            border: none;
            color: var(--primary);
            font-size: 1.5rem;
            cursor: pointer;
            display: none;
          }

          .nav {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .nav-item {
            padding: 10px 20px;
            font-size: 1rem;
            font-weight: 500;
            color: var(--text-light);
            background: none;
            border: none;
            cursor: pointer;
            border-radius: var(--border-radius);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: var(--transition);
          }

          .nav-item:hover {
            background: var(--primary);
            color: #FFFFFF;
          }

          .nav-item.active {
            background: var(--primary);
            color: #FFFFFF;
            font-weight: 600;
          }

          .logout-button {
            background: var(--secondary);
            color: var(--text-dark);
            padding: 10px 20px;
            border-radius: var(--border-radius);
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: var(--transition);
            border: none;
          }

          .logout-button:hover {
            background: #F59E0B;
            transform: translateY(-2px);
          }

          .main-content {
            padding: 32px;
            max-width: 1400px;
            margin: 0 auto;
          }

          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
          }

          .title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary);
            margin: 0;
          }

          .action-buttons {
            display: flex;
            gap: 12px;
            align-items: center;
            flex-wrap: wrap;
          }

          .search-input {
            padding: 12px 16px;
            font-size: 1rem;
            border: 1px solid #D1D5DB;
            border-radius: 6px;
            background: var(--card-bg);
            color: var(--text-dark);
            width: 250px;
            transition: var(--transition);
          }

          .search-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          }

          .add-button, .export-button, .submit-button {
            background: var(--primary);
            color: #FFFFFF;
            padding: 12px 20px;
            border-radius: var(--border-radius);
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: var(--transition);
            border: none;
          }

          .add-button:hover .export-button:hover, .submit-button:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
          }

          .status-text {
            font-size: 1.25rem;
            color: var(--text-light);
            text-align: center;
            margin: 32px 0;
          }

          .table-container {
            background: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--card-shadow);
            overflow-x: auto;
          }

          .table {
            width: 100%;
            border-collapse: collapse;
          }

          .th {
            padding: 16px;
            text-align: left;
            background: var(--primary);
            color: #FFFFFF;
            font-size: 1rem;
            font-weight: 600;
          }

          .td {
            padding: 16px;
            border-bottom: 1px solid #E5E7EB;
            font-size: 0.95rem;
            color: var(--text-dark);
          }

          .tr-even {
            background: var(--card-bg);
          }

          .tr-odd {
            background: #F9FAFB;
          }

          .action-buttons-table {
            display: flex;
            gap: 8px;
          }

          .delete-button, .edit-button, .preview-button {
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: var(--transition);
            border: none;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .edit-button {
            background: #10B981;
            color: #FFFFFF;
          }

          .edit-button:hover {
            background: #059669;
            transform: translateY(-1px);
          }

          .delete-button {
            background: #EF4444;
            color: #FFFFFF;
          }

          .delete-button:hover {
            background: #DC2626;
            transform: translateY(-1px);
          }

          .preview-button {
            background: var(--secondary);
            color: var(--text-dark);
          }

          .preview-button:hover {
            background: #F59E0B;
            transform: translateY(-1px);
          }

          .card-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }

          .card {
            background: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--card-shadow);
            padding: 20px;
            transition: var(--transition);
          }

          .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          }

          .card-header {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 12px;
          }

          .card-content {
            font-size: 0.95rem;
            color: var(--text-light);
            line-height: 1.5;
          }

          .card-content p {
            margin-bottom: 8px;
          }

          .card-actions {
            display: flex;
            gap: 12px;
            margin-top: 16px;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            backdrop-filter: blur(3px);
          }

          .modal-content {
            background: var(--card-bg);
            border-radius: 12px;
            padding: 32px;
            max-width: 900px;
            width: 90%;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            display: flex;
            gap: 24px;
            position: relative;
            max-height: 80vh;
            overflow-y: auto;
          }

          .modal-form {
            flex: 1;
          }

          .modal-preview {
            flex: 1;
            background: #F3F4F6;
            border-radius: 8px;
            padding: 20px;
            display: ${previewOpen ? 'block' : 'none'};
          }

          .modal-title {
            font-size: 1.75rem;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 24px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-label {
            font-size: 1rem;
            font-weight: 500;
            color: var(--text-dark);
            margin-bottom: 8px;
            display: block;
          }

          .form-input, .form-textarea {
            width: 100%;
            padding: 12px;
            font-size: 1rem;
            border: 1px solid #D1D5DB;
            border-radius: 6px;
            background: #F9FAFB;
            color: var(--text-dark);
            transition: var(--transition);
            font-family: 'Poppins', sans-serif;
          }

          .form-input:focus, .form-textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          }

          .form-textarea {
            resize: vertical;
            min-height: 100px;
          }

          .modal-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
          }

          .cancel-button {
            background: #E5E7EB;
            color: var(--text-dark);
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
            transition: var(--transition);
            border: none;
          }

          .cancel-button:hover {
            background: #D1D5DB;
            transform: translateY(-2px);
          }

          .preview-toggle {
            background: var(--secondary);
            color: var(--text-dark);
            padding: 10px 16px;
            border-radius: 6px;
            font-size: 0.95rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: var(--transition);
            border: none;
            margin-bottom: 20px;
          }

          .preview-toggle:hover {
            background: #F59E0B;
            transform: translateY(-2px);
          }

          .preview-content {
            font-size: 0.95rem;
            color: var(--text-dark);
          }

          .preview-content img {
            max-width: 100%;
            border-radius: 6px;
            margin-top: 12px;
          }

          .error-container {
            background: #FEF2F2;
            border: 1px solid #FECACA;
            border-radius: var(--border-radius);
            padding: 16px;
            margin-bottom: 24px;
            color: #DC2626;
            font-size: 1rem;
            text-align: center;
          }

          @media (max-width: 1024px) {
            .modal-content {
              flex-direction: column;
            }
            .modal-preview {
              display: ${previewOpen ? 'block' : 'none'};
            }
          }

          @media (max-width: 768px) {
            .main-content {
              padding: 16px;
            }
            .header-row {
              flex-direction: column;
              align-items: flex-start;
            }
            .action-buttons {
              flex-direction: column;
              width: 100%;
            }
            .search-input {
              width: 100%;
            }
            .toggle-button {
              display: block;
            }
            .nav {
              display: none;
              flex-direction: column;
              width: 100%;
              background: var(--card-bg);
              position: absolute;
              top: 64px;
              left: 0;
              padding: 16px;
              box-shadow: var(--card-shadow);
              z-index: 999;
            }
            .nav.open {
              display: flex;
            }
            .table-container {
              display: none;
            }
            .card-container {
              grid-template-columns: 1fr;
            }
            .modal-content {
              padding: 20px;
              width: 95%;
            }
          }

          @media (max-width: 576px) {
            .title {
              font-size: 1.5rem;
            }
            .card {
              padding: 16px;
            }
            .card-header {
              font-size: 1.1rem;
            }
            .card-content {
              font-size: 0.9rem;
            }
            .modal-title {
              font-size: 1.5rem;
            }
            .form-input, .form-textarea {
              font-size: 0.95rem;
            }
          }
        `}</style>

        <header className="navbar" data-aos="fade-down">
          <div className="navbar-brand">
            <h2 className="logo">Dashboard</h2>
            <button onClick={() => setNavbarOpen(!navbarOpen)} className="toggle-button">
              {navbarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
          <nav className={`nav ${navbarOpen ? "open" : ""}`}>
            <button
              onClick={() => { setActiveTab("contacts"); setSearchTerm(""); setNavbarOpen(false); }}
              className={`nav-item ${activeTab === "contacts" ? "active" : ""}`}
            >
              <FaTable size={16} /> Kontak
            </button>
            <button
              onClick={() => { setActiveTab("comments"); setSearchTerm(""); setNavbarOpen(false); }}
              className={`nav-item ${activeTab === "comments" ? "active" : ""}`}
            >
              <FaComments size={16} /> Komentar
            </button>
            <button
              onClick={() => { setActiveTab("projects"); setSearchTerm(""); setNavbarOpen(false); }}
              className={`nav-item ${activeTab === "projects" ? "active" : ""}`}
            >
              <FaProjectDiagram size={16} /> Proyek
            </button>
            <button
              onClick={() => { setActiveTab("certificates"); setSearchTerm(""); setNavbarOpen(false); }}
              className={`nav-item ${activeTab === "certificates" ? "active" : ""}`}
            >
              <FaCertificate size={16} /> Sertifikat
            </button>
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt size={16} /> Keluar
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
              {activeTab === "contacts" ? "📋 Kontak" :
               activeTab === "comments" ? "💬 Komentar" :
               activeTab === "projects" ? "📂 Proyek" :
               "🎓 Sertifikat"}
            </h1>
            <div className="action-buttons">
              <input
                type="text"
                placeholder={`🔍 Cari ${activeTab === "contacts" ? "kontak" : activeTab === "comments" ? "komentar" : activeTab === "projects" ? "proyek" : "sertifikat"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {(activeTab === "comments" || activeTab === "projects" || activeTab === "certificates") && (
                <button onClick={() => openForm(activeTab)} className="add-button">
                  <FaPlus size={16} />
                  Tambah {activeTab === "comments" ? "Komentar" : activeTab === "projects" ? "Proyek" : "Sertifikat"}
                </button>
              )}
              <button onClick={exportData} className="export-button">
                <FaFileExport size={16} /> Ekspor Data
              </button>
            </div>
          </div>

          {loading ? (
            <p className="status-text" data-aos="fade-up">Memuat data...</p>
          ) : activeTab === "contacts" ? (
            filteredData(contacts, "contacts").length === 0 ? (
              <p className="status-text" data-aos="fade-up">📭 Tidak ada kontak ditemukan.</p>
            ) : (
              <>
                <div className="table-container" data-aos="fade-up">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="th">Nama</th>
                        <th className="th">Email</th>
                        <th className="th">Pesan</th>
                        <th className="th">Tanggal</th>
                        <th className="th">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData(contacts, "contacts").map((contact, index) => (
                        <tr key={contact.id} className={index % 2 === 0 ? "tr-even" : "tr-odd"}>
                          <td className="td">{contact.name || "N/A"}</td>
                          <td className="td">{contact.email || "N/A"}</td>
                          <td className="td">{contact.message || "N/A"}</td>
                          <td className="td">{contact.createdAt?.toDate().toLocaleString() || "-"}</td>
                          <td className="td">
                            <div className="action-buttons-table">
                              <button
                                onClick={() => handleDelete(contact.id, "contacts")}
                                className="delete-button"
                                title="Hapus kontak"
                                disabled={!contact.id}
                              >
                                <FaTrash size={12} /> Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-container" data-aos="fade-up">
                  {filteredData(contacts, "contacts").map((contact) => (
                    <div key={contact.id} className="card">
                      <div className="card-header">{contact.name || "N/A"}</div>
                      <div className="card-content">
                        <p><strong>Email:</strong> {contact.email || "N/A"}</p>
                        <p><strong>Pesan:</strong> {contact.message || "N/A"}</p>
                        <p><strong>Tanggal:</strong> {contact.createdAt?.toDate().toLocaleString() || "-"}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => handleDelete(contact.id, "contacts")}
                          className="delete-button"
                          title="Hapus kontak"
                          disabled={!contact.id}
                        >
                          <FaTrash size={12} /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : activeTab === "comments" ? (
            filteredData(comments, "comments").length === 0 ? (
              <p className="status-text" data-aos="fade-up">💬 Tidak ada komentar ditemukan.</p>
            ) : (
              <>
                <div className="table-container" data-aos="fade-up">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="th">Nama</th>
                        <th className="th">Komentar</th>
                        <th className="th">Tanggal</th>
                        <th className="th">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData(comments, "comments").map((comment, index) => (
                        <tr key={comment.id} className={index % 2 === 0 ? "tr-even" : "tr-odd"}>
                          <td className="td">{comment.name || "N/A"}</td>
                          <td className="td">{comment.message || "N/A"}</td>
                          <td className="td">{comment.createdAt?.toDate().toLocaleString() || "-"}</td>
                          <td className="td">
                            <div className="action-buttons-table">
                              <button
                                onClick={() => openForm("comments", comment)}
                                className="edit-button"
                                title="Edit komentar"
                              >
                                <FaEdit size={12} /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(comment.id, "comments")}
                                className="delete-button"
                                title="Hapus komentar"
                                disabled={!comment.id}
                              >
                                <FaTrash size={12} /> Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-container" data-aos="fade-up">
                  {filteredData(comments, "comments").map((comment) => (
                    <div key={comment.id} className="card">
                      <div className="card-header">{comment.name || "N/A"}</div>
                      <div className="card-content">
                        <p><strong>Komentar:</strong> {comment.message || "N/A"}</p>
                        <p><strong>Tanggal:</strong> {comment.createdAt?.toDate().toLocaleString() || "-"}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => openForm("comments", comment)}
                          className="edit-button"
                          title="Edit komentar"
                        >
                          <FaEdit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id, "comments")}
                          className="delete-button"
                          title="Hapus komentar"
                          disabled={!comment.id}
                        >
                          <FaTrash size={12} /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : activeTab === "projects" ? (
            filteredData(projects, "projects").length === 0 ? (
              <p className="status-text" data-aos="fade-up">📂 Tidak ada proyek ditemukan.</p>
            ) : (
              <>
                <div className="table-container" data-aos="fade-up">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="th">Judul</th>
                        <th className="th">Deskripsi</th>
                        <th className="th">Kategori</th>
                        <th className="th">Teknologi</th>
                        <th className="th">Tanggal</th>
                        <th className="th">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData(projects, "projects").map((project, index) => (
                        <tr key={project.id} className={index % 2 === 0 ? "tr-even" : "tr-odd"}>
                          <td className="td">{project.Title || "N/A"}</td>
                          <td className="td">{project.Description?.substring(0, 50) || "N/A"}...</td>
                          <td className="td">{project.category || "N/A"}</td>
                          <td className="td">{project.TechStack?.join(", ") || "N/A"}</td>
                          <td className="td">{project.createdAt?.toDate().toLocaleString() || "-"}</td>
                          <td className="td">
                            <div className="action-buttons-table">
                              <button
                                onClick={() => openForm("projects", project)}
                                className="edit-button"
                                title="Edit proyek"
                              >
                                <FaEdit size={12} /> Edit
                              </button>
                              <button
                                onClick={() => { setFormData({ ...project, type: "projects" }); setPreviewOpen(true); setFormOpen(true); }}
                                className="preview-button"
                                title="Pratinjau proyek"
                              >
                                <FaEye size={12} /> Pratinjau
                              </button>
                              <button
                                onClick={() => handleDelete(project.id, "projects")}
                                className="delete-button"
                                title="Hapus proyek"
                                disabled={!project.id}
                              >
                                <FaTrash size={12} /> Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-container" data-aos="fade-up">
                  {filteredData(projects, "projects").map((project) => (
                    <div key={project.id} className="card">
                      <div className="card-header">{project.Title || "N/A"}</div>
                      <div className="card-content">
                        <p><strong>Deskripsi:</strong> {project.Description || "N/A"}</p>
                        <p><strong>Kategori:</strong> {project.category || "N/A"}</p>
                        <p><strong>Teknologi:</strong> {project.TechStack?.join(", ") || "N/A"}</p>
                        <p><strong>Fitur:</strong> {project.Features?.join(", ") || "N/A"}</p>
                        <p><strong>GitHub:</strong> {project.Github !== "----" ? <a href={project.Github} target="_blank" rel="noopener noreferrer">Link</a> : "N/A"}</p>
                        <p><strong>Link:</strong> {project.Link !== "----" ? <a href={project.Link} target="_blank" rel="noopener noreferrer">Link</a> : "N/A"}</p>
                        <p><strong>Gambar:</strong> {project.Img !== "----" ? <a href={project.Img} target="_blank" rel="noopener noreferrer">Lihat</a> : "N/A"}</p>
                        <p><strong>Tanggal:</strong> {project.createdAt?.toDate().toLocaleString() || "-"}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => openForm("projects", project)}
                          className="edit-button"
                          title="Edit proyek"
                        >
                          <FaEdit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => { setFormData({ ...project, type: "projects" }); setPreviewOpen(true); setFormOpen(true); }}
                          className="preview-button"
                          title="Pratinjau proyek"
                        >
                          <FaEye size={12} /> Pratinjau
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, "projects")}
                          className="delete-button"
                          title="Hapus proyek"
                          disabled={!project.id}
                        >
                          <FaTrash size={12} /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : activeTab === "certificates" ? (
            filteredData(certificates, "certificates").length === 0 ? (
              <p className="status-text" data-aos="fade-up">🎓 Tidak ada sertifikat ditemukan.</p>
            ) : (
              <>
                <div className="table-container" data-aos="fade-up">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="th">Judul</th>
                        <th className="th">Deskripsi</th>
                        <th className="th">Penerbit</th>
                        <th className="th">Tanggal</th>
                        <th className="th">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData(certificates, "certificates").map((certificate, index) => (
                        <tr key={certificate.id} className={index % 2 === 0 ? "tr-even" : "tr-odd"}>
                          <td className="td">{certificate.title || "N/A"}</td>
                          <td className="td">{certificate.description?.substring(0, 50) || "N/A"}...</td>
                          <td className="td">{certificate.issuer || "N/A"}</td>
                          <td className="td">{certificate.date || "N/A"}</td>
                          <td className="td">
                            <div className="action-buttons-table">
                              <button
                                onClick={() => openForm("certificates", certificate)}
                                className="edit-button"
                                title="Edit sertifikat"
                              >
                                <FaEdit size={12} /> Edit
                              </button>
                              <button
                                onClick={() => { setFormData({ ...certificate, type: "certificates" }); setPreviewOpen(true); setFormOpen(true); }}
                                className="preview-button"
                                title="Pratinjau sertifikat"
                              >
                                <FaEye size={12} /> Pratinjau
                              </button>
                              <button
                                onClick={() => handleDelete(certificate.id, "certificates")}
                                className="delete-button"
                                title="Hapus sertifikat"
                                disabled={!certificate.id}
                              >
                                <FaTrash size={12} /> Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-container" data-aos="fade-up">
                  {filteredData(certificates, "certificates").map((certificate) => (
                    <div key={certificate.id} className="card">
                      <div className="card-header">{certificate.title || "N/A"}</div>
                      <div className="card-content">
                        <p><strong>Deskripsi:</strong> {certificate.description || "N/A"}</p>
                        <p><strong>Penerbit:</strong> {certificate.issuer || "N/A"}</p>
                        <p><strong>Tanggal:</strong> {certificate.date || "N/A"}</p>
                        <p><strong>Gambar:</strong> {certificate.Img !== "----" ? <a href={certificate.Img} target="_blank" rel="noopener noreferrer">Lihat</a> : "N/A"}</p>
                        <p><strong>Link:</strong> {certificate.Link !== "----" ? <a href={certificate.Link} target="_blank" rel="noopener noreferrer">Link</a> : "N/A"}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => openForm("certificates", certificate)}
                          className="edit-button"
                          title="Edit sertifikat"
                        >
                          <FaEdit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => { setFormData({ ...certificate, type: "certificates" }); setPreviewOpen(true); setFormOpen(true); }}
                          className="preview-button"
                          title="Pratinjau sertifikat"
                        >
                          <FaEye size={12} /> Pratinjau
                        </button>
                        <button
                          onClick={() => handleDelete(certificate.id, "certificates")}
                          className="delete-button"
                          title="Hapus sertifikat"
                          disabled={!certificate.id}
                        >
                          <FaTrash size={12} /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : null}

          {formOpen && (
            <div className="modal-overlay">
              <div className="modal-content" data-aos="zoom-in">
                <div className="modal-form">
                  <h2 className="modal-title">
                    {formData.type === "comments" ? (formData.id ? "Edit Komentar" : "Tambah Komentar") :
                     formData.type === "projects" ? (formData.id ? "Edit Proyek" : "Tambah Proyek") :
                     (formData.id ? "Edit Sertifikat" : "Tambah Sertifikat")}
                  </h2>
                  <button
                    onClick={() => setPreviewOpen(!previewOpen)}
                    className="preview-toggle"
                  >
                    <FaEye size={16} /> {previewOpen ? "Sembunyikan Pratinjau" : "Tampilkan Pratinjau"}
                  </button>
                  <form onSubmit={submitForm}>
                    {formData.type === "comments" ? (
                      <>
                        <div className="form-group">
                          <label htmlFor="name" className="form-label">Nama:</label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            required
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="message" className="form-label">Komentar:</label>
                          <textarea
                            name="message"
                            id="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleFormChange}
                            required
                            className="form-textarea"
                          />
                        </div>
                      </>
                    ) : formData.type === "projects" ? (
                      <>
                        <div className="form-group">
                          <label htmlFor="Title" className="form-label">Judul:</label>
                          <input
                            type="text"
                            name="Title"
                            id="Title"
                            value={formData.Title}
                            onChange={handleFormChange}
                            required
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="Description" className="form-label">Deskripsi:</label>
                          <textarea
                            name="Description"
                            id="Description"
                            rows={4}
                            value={formData.Description}
                            onChange={handleFormChange}
                            required
                            className="form-textarea"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="category" className="form-label">Kategori:</label>
                          <input
                            type="text"
                            name="category"
                            id="category"
                            value={formData.category}
                            onChange={handleFormChange}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="TechStack" className="form-label">Teknologi (pisahkan dengan koma):</label>
                          <input
                            type="text"
                            name="TechStack"
                            id="TechStack"
                            value={formData.TechStack}
                            onChange={handleFormChange}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="Features" className="form-label">Fitur (pisahkan dengan koma):</label>
                          <input
                            type="text"
                            name="Features"
                            id="Features"
                            value={formData.Features}
                            onChange={handleFormChange}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="Img" className="form-label">URL Gambar:</label>
                          <input
                            type="text"
                            name="Img"
                            id="Img"
                            value={formData.Img}
                            onChange={handleFormChange}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="Github" className="form-label">GitHub URL:</label>
                          <input
                            type="text"
                            name="Github"
                            id="Github"
                            value={formData.Github}
                            onChange={handleFormChange}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="Link" className="form-label">Link:</label>
                          <input
                            type="text"
                            name="Link"
                            id="Link"
                            value={formData.Link}
                            onChange={handleFormChange}
                            className="form-input"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="form-group">
                          <label htmlFor="title" className="form-label">Judul:</label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            required
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="description" className="form-label">Deskripsi:</label>
                          <textarea
                            name="description"
                            id="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleFormChange}
                            required
                            className="form-textarea"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="issuer" className="form-label">Penerbit:</label>
                          <input
                            type="text"
                            name="issuer"
                            id="issuer"
                            value={formData.issuer}
                            onChange={handleFormChange}
                            required
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="date" className="form-label">Tanggal:</label>
                          <input
                            type="text"
                            name="date"
                            id="date"
                            value={formData.date}
                            onChange={handleFormChange}
                            required
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="Img" className="form-label">URL Gambar:</label>
                          <input
                            type="text"
                            name="Img"
                            id="Img"
                            value={formData.Img}
                            onChange={handleFormChange}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="Link" className="form-label">Link:</label>
                          <input
                            type="text"
                            name="Link"
                            id="Link"
                            value={formData.Link}
                            onChange={handleFormChange}
                            className="form-input"
                          />
                        </div>
                      </>
                    )}
                    <div className="modal-actions">
                      <button
                        type="button"
                        onClick={closeForm}
                        className="cancel-button"
                        disabled={formLoading}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="submit-button"
                      >
                        {formLoading ? "Menyimpan..." : "Simpan"}
                      </button>
                    </div>
                  </form>
                </div>
                {previewOpen && (
                  <div className="modal-preview">
                    <h3 className="modal-title">Pratinjau</h3>
                    <div className="preview-content">
                      {formData.type === "comments" ? (
                        <>
                          <p><strong>Nama:</strong> {formData.name || "N/A"}</p>
                          <p><strong>Komentar:</strong> {formData.message || "N/A"}</p>
                        </>
                      ) : formData.type === "projects" ? (
                        <>
                          <p><strong>Judul:</strong> {formData.Title || "N/A"}</p>
                          <p><strong>Deskripsi:</strong> {formData.Description || "N/A"}</p>
                          <p><strong>Kategori:</strong> {formData.category || "N/A"}</p>
                          <p><strong>Teknologi:</strong> {formData.TechStack || "N/A"}</p>
                          <p><strong>Fitur:</strong> {formData.Features || "N/A"}</p>
                          <p><strong>GitHub:</strong> {formData.Github !== "----" ? <a href={formData.Github} target="_blank" rel="noopener noreferrer">Link</a> : "N/A"}</p>
                          <p><strong>Link:</strong> {formData.Link !== "----" ? <a href={formData.Link} target="_blank" rel="noopener noreferrer">Link</a> : "N/A"}</p>
                          {formData.Img && formData.Img !== "----" && <img src={formData.Img} alt="Project Preview" />}
                        </>
                      ) : (
                        <>
                          <p><strong>Judul:</strong> {formData.title || "N/A"}</p>
                          <p><strong>Deskripsi:</strong> {formData.description || "N/A"}</p>
                          <p><strong>Penerbit:</strong> {formData.issuer || "N/A"}</p>
                          <p><strong>Tanggal:</strong> {formData.date || "N/A"}</p>
                          <p><strong>Link:</strong> {formData.Link !== "----" ? <a href={formData.Link} target="_blank" rel="noopener noreferrer">Link</a> : "N/A"}</p>
                          {formData.Img && formData.Img !== "----" && <img src={formData.Img} alt="Certificate Preview" />}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;