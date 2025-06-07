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
  FaProjectDiagram,
  FaCertificate,
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
        } else if (activeTab === "projects") {
          const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
          unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setProjects(data);
            setLoading(false);
          }, (error) => {
            console.error("Error fetching projects:", error);
            setError(error.message);
            setLoading(false);
          });
        } else if (activeTab === "certificates") {
          const q = query(collection(db, "certificates"), orderBy("createdAt", "desc"));
          unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCertificates(data);
            setLoading(false);
          }, (error) => {
            console.error("Error fetching certificates:", error);
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

  const handleDelete = async (id, type) => {
    const confirmDelete = window.confirm(
      settings.language === "id" ? `Apakah kamu yakin ingin menghapus ${type} ini?` : `Are you sure you want to delete this ${type}?`
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, type, id));
      if (type === "contacts") {
        setContacts((prev) => prev.filter((item) => item.id !== id));
      } else if (type === "comments") {
        setComments((prev) => prev.filter((item) => item.id !== id));
      } else if (type === "projects") {
        setProjects((prev) => prev.filter((item) => item.id !== id));
      } else if (type === "certificates") {
        setCertificates((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error(`Gagal menghapus ${type}:`, error);
      setError(
        settings.language === "id" ? `Gagal menghapus ${type}: ${error.message}` : `Failed to delete ${type}: ${error.message}`
      );
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
          alert(settings.language === "id" ? "Nama dan Pesan wajib diisi." : "Name and Message are required.");
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
          alert(settings.language === "id" ? "Judul dan Deskripsi wajib diisi." : "Title and Description are required.");
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
          alert(
            settings.language === "id"
              ? "Judul, Deskripsi, Penerbit, dan Tanggal wajib diisi."
              : "Title, Description, Issuer, and Date are required."
          );
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
    } catch (error) {
      console.error(`Gagal simpan ${type}:`, error);
      setError(
        settings.language === "id" ? `Gagal simpan ${type}: ${error.message}` : `Failed to save ${type}: ${error.message}`
      );
    }
    setFormLoading(false);
  };

  const handleThemeChange = (theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const handleLanguageChange = (language) => {
    setSettings((prev) => ({ ...prev, language }));
  };

  const exportData = () => {
    let data;
    let headers;
    let filename;
    if (activeTab === "contacts") {
      data = filteredData(contacts, "contacts");
      headers = "Name,Email,Message,Date";
      filename = "contacts";
    } else if (activeTab === "comments") {
      data = filteredData(comments, "comments");
      headers = "Name,Message,Date";
      filename = "comments";
    } else if (activeTab === "projects") {
      data = filteredData(projects, "projects");
      headers = "Title,Description,Category,TechStack,Features,Github,Link,Image,Date";
      filename = "projects";
    } else if (activeTab === "certificates") {
      data = filteredData(certificates, "certificates");
      headers = "Title,Description,Issuer,Date,Image,Link";
      filename = "certificates";
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
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_export_${new Date().toISOString().slice(0, 10)}.csv`;
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
            max-width: 600px;
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
              onClick={() => { setActiveTab("projects"); setSearchTerm(""); setNavbarOpen(false); }}
              className={`nav-item ${activeTab === "projects" ? "active" : ""}`}
            >
              <FaProjectDiagram size={16} /> {settings.language === "id" ? "Proyek" : "Projects"}
            </button>
            <button
              onClick={() => { setActiveTab("certificates"); setSearchTerm(""); setNavbarOpen(false); }}
              className={`nav-item ${activeTab === "certificates" ? "active" : ""}`}
            >
              <FaCertificate size={16} /> {settings.language === "id" ? "Sertifikat" : "Certificates"}
            </button>
            <button
              onClick={() => { setActiveTab("settings"); setSearchTerm(""); setNavbarOpen(false); }}
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            >
              <FaCog size={16} /> {settings.language === "id" ? "Pengaturan" : "Settings"}
            </button>
            <button
              onClick={() => { setActiveTab("info"); setSearchTerm(""); setNavbarOpen(false); }}
              className={`nav-item ${activeTab === "info" ? "active" : ""}`}
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
               activeTab === "projects" ? (settings.language === "id" ? "📂 Proyek" : "📂 Projects") :
               activeTab === "certificates" ? (settings.language === "id" ? "🎓 Sertifikat" : "🎓 Certificates") :
               activeTab === "settings" ? (settings.language === "id" ? "⚙️ Pengaturan" : "⚙️ Settings") :
               (settings.language === "id" ? "ℹ️ Informasi" : "ℹ️ Info")}
            </h1>
            {activeTab !== "settings" && activeTab !== "info" && (
              <div className="action-buttons">
                <input
                  type="text"
                  placeholder={
                    activeTab === "contacts" ? (settings.language === "id" ? "🔍 Cari kontak..." : "🔍 Search contacts...") :
                    activeTab === "comments" ? (settings.language === "id" ? "🔍 Cari komentar..." : "🔍 Search comments...") :
                    activeTab === "projects" ? (settings.language === "id" ? "🔍 Cari proyek..." : "🔍 Search projects...") :
                    (settings.language === "id" ? "🔍 Cari sertifikat..." : "🔍 Search certificates...")
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {(activeTab === "comments" || activeTab === "projects" || activeTab === "certificates") && (
                  <button
                    onClick={() => openForm(activeTab)}
                    className="add-button"
                  >
                    <FaPlus size={16} />
                    {settings.language === "id"
                      ? activeTab === "comments" ? "Tambah Komentar" :
                        activeTab === "projects" ? "Tambah Proyek" : "Tambah Sertifikat"
                      : activeTab === "comments" ? "Add Comment" :
                        activeTab === "projects" ? "Add Project" : "Add Certificate"}
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
            filteredData(contacts, "contacts").length === 0 ? (
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
                      {filteredData(contacts, "contacts").map((contact, index) => (
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
                              onClick={() => handleDelete(contact.id, "contacts")}
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
                  {filteredData(contacts, "contacts").map((contact, index) => (
                    <div key={contact.id || index} className="card">
                      <div className="card-header">{contact.name || "N/A"}</div>
                      <div className="card-content">
                        <p><strong>Email:</strong> {contact.email || "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Pesan" : "Message"}:</strong> {contact.message || "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Tanggal" : "Date"}:</strong> {contact.createdAt?.toDate().toLocaleString() || "-"}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => handleDelete(contact.id, "contacts")}
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
            filteredData(comments, "comments").length === 0 ? (
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
                      {filteredData(comments, "comments").map((comment, index) => (
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
                              onClick={() => openForm("comments", comment)}
                              className="edit-button"
                              title={settings.language === "id" ? "Edit komentar" : "Edit comment"}
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id, "comments")}
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
                  {filteredData(comments, "comments").map((comment, index) => (
                    <div key={comment.id || index} className="card">
                      <div className="card-header">{comment.name || "N/A"}</div>
                      <div className="card-content">
                        <p><strong>{settings.language === "id" ? "Komentar" : "Comment"}:</strong> {comment.message || "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Tanggal" : "Date"}:</strong> {comment.createdAt?.toDate().toLocaleString() || "-"}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => openForm("comments", comment)}
                          className="edit-button"
                          title={settings.language === "id" ? "Edit komentar" : "Edit comment"}
                        >
                          <FaEdit size={12} /> {settings.language === "id" ? "Edit" : "Edit"}
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id, "comments")}
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
          ) : activeTab === "projects" ? (
            filteredData(projects, "projects").length === 0 ? (
              <p className="status-text" data-aos="fade-up">{settings.language === "id" ? "📂 Belum ada proyek." : "📂 No projects yet."}</p>
            ) : (
              <>
                <div className="table-container" data-aos="fade-up">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="th">{settings.language === "id" ? "Judul" : "Title"}</th>
                        <th className="th">{settings.language === "id" ? "Deskripsi" : "Description"}</th>
                        <th className="th">{settings.language === "id" ? "Kategori" : "Category"}</th>
                        <th className="th">{settings.language === "id" ? "Teknologi" : "Tech Stack"}</th>
                        <th className="th">{settings.language === "id" ? "Tanggal" : "Date"}</th>
                        <th className="th">{settings.language === "id" ? "Aksi" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData(projects, "projects").map((project, index) => (
                        <tr
                          key={project.id || index}
                          className={index % 2 === 0 ? "tr-even" : "tr-odd"}
                        >
                          <td className="td">{project.Title || "N/A"}</td>
                          <td className="td">{project.Description?.substring(0, 50) || "N/A"}...</td>
                          <td className="td">{project.category || "N/A"}</td>
                          <td className="td">{project.TechStack?.join(", ") || "N/A"}</td>
                          <td className="td">
                            {project.createdAt?.toDate().toLocaleString() || "-"}
                          </td>
                          <td className="td">
                            <button
                              onClick={() => openForm("projects", project)}
                              className="edit-button"
                              title={settings.language === "id" ? "Edit proyek" : "Edit project"}
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id, "projects")}
                              className="delete-button"
                              title={settings.language === "id" ? "Hapus proyek" : "Delete project"}
                              disabled={!project.id}
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
                  {filteredData(projects, "projects").map((project, index) => (
                    <div key={project.id || index} className="card">
                      <div className="card-header">{project.Title || "N/A"}</div>
                      <div className="card-content">
                        <p><strong>{settings.language === "id" ? "Deskripsi" : "Description"}:</strong> {project.Description || "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Kategori" : "Category"}:</strong> {project.category || "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Teknologi" : "Tech Stack"}:</strong> {project.TechStack?.join(", ") || "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Fitur" : "Features"}:</strong> {project.Features?.join(", ") || "N/A"}</p>
                        <p><strong>GitHub:</strong> {project.Github !== "----" ? <a href={project.Github} target="_blank" rel="noopener noreferrer">{project.Github}</a> : "N/A"}</p>
                        <p><strong>Link:</strong> {project.Link !== "----" ? <a href={project.Link} target="_blank" rel="noopener noreferrer">{project.Link}</a> : "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Gambar" : "Image"}:</strong> {project.Img !== "----" ? <a href={project.Img} target="_blank" rel="noopener noreferrer">{project.Img}</a> : "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Tanggal" : "Date"}:</strong> {project.createdAt?.toDate().toLocaleString() || "-"}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => openForm("projects", project)}
                          className="edit-button"
                          title={settings.language === "id" ? "Edit proyek" : "Edit project"}
                        >
                          <FaEdit size={12} /> {settings.language === "id" ? "Edit" : "Edit"}
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, "projects")}
                          className="delete-button"
                          title={settings.language === "id" ? "Hapus proyek" : "Delete project"}
                          disabled={!project.id}
                        >
                          <FaTrash size={12} /> {settings.language === "id" ? "Hapus" : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : activeTab === "certificates" ? (
            filteredData(certificates, "certificates").length === 0 ? (
              <p className="status-text" data-aos="fade-up">{settings.language === "id" ? "🎓 Belum ada sertifikat." : "🎓 No certificates yet."}</p>
            ) : (
              <>
                <div className="table-container" data-aos="fade-up">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="th">{settings.language === "id" ? "Judul" : "Title"}</th>
                        <th className="th">{settings.language === "id" ? "Deskripsi" : "Description"}</th>
                        <th className="th">{settings.language === "id" ? "Penerbit" : "Issuer"}</th>
                        <th className="th">{settings.language === "id" ? "Tanggal" : "Date"}</th>
                        <th className="th">{settings.language === "id" ? "Aksi" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData(certificates, "certificates").map((certificate, index) => (
                        <tr
                          key={certificate.id || index}
                          className={index % 2 === 0 ? "tr-even" : "tr-odd"}
                        >
                          <td className="td">{certificate.title || "N/A"}</td>
                          <td className="td">{certificate.description?.substring(0, 50) || "N/A"}...</td>
                          <td className="td">{certificate.issuer || "N/A"}</td>
                          <td className="td">{certificate.date || "N/A"}</td>
                          <td className="td">
                            <button
                              onClick={() => openForm("certificates", certificate)}
                              className="edit-button"
                              title={settings.language === "id" ? "Edit sertifikat" : "Edit certificate"}
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete(certificate.id, "certificates")}
                              className="delete-button"
                              title={settings.language === "id" ? "Hapus sertifikat" : "Delete certificate"}
                              disabled={!certificate.id}
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
                  {filteredData(certificates, "certificates").map((certificate, index) => (
                    <div key={certificate.id || index} className="card">
                      <div className="card-header">{certificate.title || "N/A"}</div>
                      <div className="card-content">
                        <p><strong>{settings.language === "id" ? "Deskripsi" : "Description"}:</strong> {certificate.description || "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Penerbit" : "Issuer"}:</strong> {certificate.issuer || "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Tanggal" : "Date"}:</strong> {certificate.date || "N/A"}</p>
                        <p><strong>{settings.language === "id" ? "Gambar" : "Image"}:</strong> {certificate.Img !== "----" ? <a href={certificate.Img} target="_blank" rel="noopener noreferrer">{certificate.Img}</a> : "N/A"}</p>
                        <p><strong>Link:</strong> {certificate.Link !== "----" ? <a href={certificate.Link} target="_blank" rel="noopener noreferrer">{certificate.Link}</a> : "N/A"}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => openForm("certificates", certificate)}
                          className="edit-button"
                          title={settings.language === "id" ? "Edit sertifikat" : "Edit certificate"}
                        >
                          <FaEdit size={12} /> {settings.language === "id" ? "Edit" : "Edit"}
                        </button>
                        <button
                          onClick={() => handleDelete(certificate.id, "certificates")}
                          className="delete-button"
                          title={settings.language === "id" ? "Hapus sertifikat" : "Delete certificate"}
                          disabled={!certificate.id}
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
                  "Dashboard ini dirancang untuk mengelola kontak, komentar, proyek, dan sertifikat dengan mudah. Gunakan navigasi di atas untuk beralih antara fitur."
                  : "This dashboard is designed to manage contacts, comments, projects, and certificates easily. Use the navigation above to switch between features."}
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

          {formOpen && (
            <div className="modal-overlay">
              <div className="modal-content" data-aos="zoom-in">
                <h2 className="modal-title">
                  {formData.type === "comments" ? 
                    (formData.id ? (settings.language === "id" ? "Edit Komentar" : "Edit Comment") : (settings.language === "id" ? "Tambah Komentar" : "Add Comment")) :
                   formData.type === "projects" ?
                    (formData.id ? (settings.language === "id" ? "Edit Proyek" : "Edit Project") : (settings.language === "id" ? "Tambah Proyek" : "Add Project")) :
                    (formData.id ? (settings.language === "id" ? "Edit Sertifikat" : "Edit Certificate") : (settings.language === "id" ? "Tambah Sertifikat" : "Add Certificate"))}
                </h2>
                <form onSubmit={submitForm}>
                  {formData.type === "comments" ? (
                    <>
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">{settings.language === "id" ? "Nama:" : "Name:"}</label>
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
                        <label htmlFor="message" className="form-label">{settings.language === "id" ? "Komentar:" : "Comment:"}</label>
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
                        <label htmlFor="Title" className="form-label">{settings.language === "id" ? "Judul:" : "Title:"}</label>
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
                        <label htmlFor="Description" className="form-label">{settings.language === "id" ? "Deskripsi:" : "Description:"}</label>
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
                        <label htmlFor="category" className="form-label">{settings.language === "id" ? "Kategori:" : "Category:"}</label>
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
                        <label htmlFor="TechStack" className="form-label">{settings.language === "id" ? "Teknologi (pisahkan dengan koma):" : "Tech Stack (comma-separated):"}</label>
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
                        <label htmlFor="Features" className="form-label">{settings.language === "id" ? "Fitur (pisahkan dengan koma):" : "Features (comma-separated):"}</label>
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
                        <label htmlFor="Img" className="form-label">{settings.language === "id" ? "URL Gambar:" : "Image URL:"}</label>
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
                        <label htmlFor="title" className="form-label">{settings.language === "id" ? "Judul:" : "Title:"}</label>
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
                        <label htmlFor="description" className="form-label">{settings.language === "id" ? "Deskripsi:" : "Description:"}</label>
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
                        <label htmlFor="issuer" className="form-label">{settings.language === "id" ? "Penerbit:" : "Issuer:"}</label>
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
                        <label htmlFor="date" className="form-label">{settings.language === "id" ? "Tanggal:" : "Date:"}</label>
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
                        <label htmlFor="Img" className="form-label">{settings.language === "id" ? "URL Gambar:" : "Image URL:"}</label>
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
                      {settings.language === "id" ? "Batal" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="submit-button"
                    >
                      {formLoading ? (settings.language === "id" ? "Menyimpan..." : "Saving...") : (settings.language === "id" ? "Simpan" : "Save")}
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