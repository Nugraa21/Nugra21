import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
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
  FaFileExport,
  FaExclamationTriangle,
  FaProjectDiagram,
  FaCertificate,
  FaSun,
  FaMoon,
  FaSort,
  FaFilter,
} from "react-icons/fa";
import "tailwindcss/tailwind.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-10">
          <h2 className="text-lg font-bold text-red-700">Something Went Wrong</h2>
          <p className="mt-2 text-sm text-red-600">{this.state.error?.message || "Please check the console or try again later."}</p>
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
  const [activeTab, setActiveTab] = useState("projects");
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [imagePreview, setImagePreview] = useState("");
  const [theme, setTheme] = useState("light");
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [categoryFilter, setCategoryFilter] = useState("All");
  const navigate = useNavigate();

  const categories = ["All", "Project", "Materi", "Web", "Game", "Ilustrasi"];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

      const unsubscribes = [];
      try {
        if (activeTab === "contacts" || activeTab === "all") {
          const contactsUnsubscribe = onSnapshot(collection(db, "contacts"), (querySnapshot) => {
            setContacts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            if (activeTab === "contacts") setLoading(false);
          }, (error) => { setError(error.message); setLoading(false); });
          unsubscribes.push(contactsUnsubscribe);
        }
        if (activeTab === "comments" || activeTab === "all") {
          const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
          const commentsUnsubscribe = onSnapshot(q, (querySnapshot) => {
            setComments(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            if (activeTab === "comments") setLoading(false);
          }, (error) => { setError(error.message); setLoading(false); });
          unsubscribes.push(commentsUnsubscribe);
        }
        if (activeTab === "projects" || activeTab === "all") {
          const projectsUnsubscribe = onSnapshot(collection(db, "projects"), (querySnapshot) => {
            const projectsData = querySnapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .sort((a, b) => parseInt(a.id) - parseInt(b.id));
            setProjects(projectsData);
            if (activeTab === "projects") setLoading(false);
          }, (error) => { setError(error.message); setLoading(false); });
          unsubscribes.push(projectsUnsubscribe);
        }
        if (activeTab === "certificates" || activeTab === "all") {
          const certificatesUnsubscribe = onSnapshot(collection(db, "certificates"), (querySnapshot) => {
            setCertificates(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            if (activeTab === "certificates") setLoading(false);
          }, (error) => { setError(error.message); setLoading(false); });
          unsubscribes.push(certificatesUnsubscribe);
        }
        if (activeTab === "all") setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
      return () => unsubscribes.forEach((unsubscribe) => unsubscribe && unsubscribe());
    };

    const unsubscribe = fetchData();
    return () => unsubscribe && unsubscribe();
  }, [navigate, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleDelete = async (id, collectionName) => {
    if (!window.confirm(`Delete ${collectionName.slice(0, -1)}?`)) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === "contacts") setContacts((prev) => prev.filter((item) => item.id !== id));
      else if (collectionName === "comments") setComments((prev) => prev.filter((item) => item.id !== id));
      else if (collectionName === "projects") setProjects((prev) => prev.filter((item) => item.id !== id));
      else if (collectionName === "certificates") setCertificates((prev) => prev.filter((item) => item.id !== id));
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } catch (error) {
      setError(`Failed to delete ${collectionName.slice(0, -1)}: ${error.message}`);
    }
  };

  const handleBulkDelete = async (collectionName) => {
    if (!window.confirm(`Delete ${selectedItems.length} selected ${collectionName}?`)) return;
    try {
      await Promise.all(selectedItems.map((id) => deleteDoc(doc(db, collectionName, id))));
      if (collectionName === "contacts") setContacts((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
      else if (collectionName === "comments") setComments((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
      else if (collectionName === "projects") setProjects((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
      else if (collectionName === "certificates") setCertificates((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    } catch (error) {
      setError(`Failed to delete selected ${collectionName}: ${error.message}`);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) => prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      if (key === "createdAt") {
        const aDate = a[key]?.toDate() || new Date(0);
        const bDate = b[key]?.toDate() || new Date(0);
        return direction === "asc" ? aDate - bDate : bDate - aDate;
      }
      const aValue = a[key]?.toString().toLowerCase() || "";
      const bValue = b[key]?.toString().toLowerCase() || "";
      return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  };

  const filteredContacts = sortData(
    contacts.filter((contact) =>
      [contact.name, contact.email, contact.message].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
    sortConfig.key,
    sortConfig.direction
  );

  const filteredComments = sortData(
    comments.filter((comment) =>
      [comment.name, comment.message].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
    sortConfig.key,
    sortConfig.direction
  );

  const filteredProjects = sortData(
    projects.filter((project) =>
      [project.Title, project.Description, project.category].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (categoryFilter === "All" || project.category === categoryFilter)
    ),
    sortConfig.key,
    sortConfig.direction
  );

  const filteredCertificates = sortData(
    certificates.filter((certificate) =>
      [certificate.title, certificate.description, certificate.issuer].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
    sortConfig.key,
    sortConfig.direction
  );

  const openForm = (collectionName, item = null) => {
    if (collectionName === "comments") {
      setFormData({ collection: "comments", id: item?.id || "", name: item?.name || "", message: item?.message || "" });
    } else if (collectionName === "projects") {
      setFormData({
        collection: "projects",
        id: item?.id || "",
        Title: item?.Title || "",
        Description: item?.Description || "",
        Img: item?.Img || "",
        Github: item?.Github || "",
        Link: item?.Link || "",
        TechStack: item?.TechStack || [],
        Features: item?.Features || [],
        category: item?.category || "",
      });
      setImagePreview(item?.Img || "");
    } else if (collectionName === "certificates") {
      setFormData({
        collection: "certificates",
        id: item?.id || "",
        title: item?.title || "",
        description: item?.description || "",
        Img: item?.Img || "",
        issuer: item?.issuer || "",
        date: item?.date || "",
        Link: item?.Link || "",
      });
      setImagePreview(item?.Img || "");
    }
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormData(null);
    setImagePreview("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "Img") setImagePreview(value);
  };

  const handleArrayChange = (e, field, index) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [field]: prev[field].map((item, i) => i === index ? value : item) }));
  };

  const addArrayItem = (field) => setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  const removeArrayItem = (field, index) => setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));

  const validateForm = () => {
    if (formData.collection === "comments") {
      return formData.name.trim() && formData.message.trim() && formData.id.trim();
    } else if (formData.collection === "projects") {
      return formData.Title.trim() && formData.Description.trim() && formData.id.trim() && formData.category.trim();
    } else if (formData.collection === "certificates") {
      return formData.title.trim() && formData.description.trim() && formData.id.trim() && formData.issuer.trim() && formData.date.trim();
    }
    return false;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError("Please fill all required fields correctly.");
      return;
    }

    const { collection, id, ...data } = formData;
    setFormLoading(true);
    try {
      await setDoc(doc(db, collection, id), { ...data, updatedAt: serverTimestamp(), createdAt: data.createdAt || serverTimestamp() });
      if (collection === "comments") setComments((prev) => prev.some((c) => c.id === id) ? prev.map((c) => c.id === id ? { id, ...data } : c) : [...prev, { id, ...data }]);
      else if (collection === "projects") setProjects((prev) => prev.some((p) => p.id === id) ? prev.map((p) => p.id === id ? { id, ...data } : p) : [...prev, { id, ...data }]);
      else if (collection === "certificates") setCertificates((prev) => prev.some((c) => c.id === id) ? prev.map((c) => c.id === id ? { id, ...data } : c) : [...prev, { id, ...data }]);
      closeForm();
    } catch (error) {
      setError(`Failed to save ${collection.slice(0, -1)}: ${error.message}`);
    }
    setFormLoading(false);
  };

  const exportData = () => {
    const dataMap = { contacts: filteredContacts, comments: filteredComments, projects: filteredProjects, certificates: filteredCertificates };
    const headersMap = {
      contacts: "Name,Email,Message,Date",
      comments: "Name,Message,Date",
      projects: "ID,Title,Description,Img,Github,Link,TechStack,Features,Category",
      certificates: "ID,Title,Description,Img,Issuer,Date,Link"
    };
    const data = dataMap[activeTab];
    const headers = headersMap[activeTab];
    const csv = [headers, ...data.map((item) => Object.values(item).map((v) => `"${(Array.isArray(v) ? v.join(", ") : v?.toString().replace(/"/g, '""') || "N/A")}"`).join(","))].join("\n");
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
      <div className={`min-h-screen transition-colors duration-300 ${theme === "light" ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-gray-100"} font-sans`}>
        {isMobile && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md text-center">
              <FaExclamationTriangle className="text-red-500 text-5xl mb-4 mx-auto" />
              <h2 className="text-xl font-bold text-gray-800">Mobile Not Supported</h2>
              <p className="mt-2 text-gray-600">Please use a desktop device for the best experience.</p>
              <button
                onClick={() => setNavbarOpen(false)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <header className={`sticky top-0 z-50 shadow-lg ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setNavbarOpen(!navbarOpen)}
                className="text-orange-500 hover:text-orange-600 md:hidden focus:outline-none"
              >
                {navbarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
              <h1 className="text-2xl font-bold text-orange-600">Nugra21 Dashboard</h1>
            </div>
            <nav
              className={`${
                navbarOpen ? "flex" : "hidden md:flex"
              } flex-col md:flex-row gap-2 absolute md:static top-16 left-0 w-full md:w-auto ${theme === "light" ? "bg-white" : "bg-gray-800"} p-4 md:p-0 shadow-lg md:shadow-none rounded-lg md:rounded-none`}
            >
              {["contacts", "comments", "projects", "certificates"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearchTerm(""); setCategoryFilter("All"); setNavbarOpen(false); }}
                  className={`flex items-center gap-3 px-5 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-orange-600 text-white shadow-md"
                      : theme === "light"
                      ? "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                      : "text-gray-200 hover:bg-orange-700 hover:text-white"
                  }`}
                >
                  {tab === "contacts" && <FaTable size={18} />}
                  {tab === "comments" && <FaComments size={18} />}
                  {tab === "projects" && <FaProjectDiagram size={18} />}
                  {tab === "certificates" && <FaCertificate size={18} />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-5 py-2 rounded-md text-base font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300"
              >
                {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-5 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 mt-3 md:mt-0"
              >
                <FaSignOutAlt size={18} /> Logout
              </button>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <div className={`border-l-4 border-red-400 p-4 rounded-lg shadow-md mb-6 text-sm ${theme === "light" ? "bg-red-50 text-red-600" : "bg-red-900 text-red-200"}`}>
              <strong className="font-medium">Error:</strong> {error}
            </div>
          )}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              {activeTab === "contacts" && "Contacts"}
              {activeTab === "comments" && "Comments"}
              {activeTab === "projects" && "Projects"}
              {activeTab === "certificates" && "Certificates"}
            </h2>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`🔍 Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full md:w-72 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 shadow-sm ${
                    theme === "light" ? "bg-white text-gray-800 border-gray-300" : "bg-gray-700 text-gray-200 border-gray-600"
                  }`}
                />
                <span className="absolute right-3 top-2 text-gray-400">{searchTerm.length}</span>
              </div>
              {activeTab === "projects" && (
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className={`w-full md:w-40 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 shadow-sm ${
                      theme === "light" ? "bg-white text-gray-800 border-gray-300" : "bg-gray-700 text-gray-200 border-gray-600"
                    }`}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <FaFilter className="absolute right-3 top-3 text-gray-400" />
                </div>
              )}
              {(activeTab === "comments" || activeTab === "projects" || activeTab === "certificates") && (
                <button
                  onClick={() => openForm(activeTab)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-md"
                >
                  <FaPlus size={16} /> Add New
                </button>
              )}
              {selectedItems.length > 0 && (
                <button
                  onClick={() => handleBulkDelete(activeTab)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md"
                >
                  <FaTrash size={16} /> Delete Selected ({selectedItems.length})
                </button>
              )}
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md"
              >
                <FaFileExport size={16} /> Export
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-600"></div>
            </div>
          ) : activeTab === "contacts" ? (
            filteredContacts.length === 0 ? (
              <div className={`text-center py-10 rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
                <p className="text-lg">📭 No contacts found.</p>
              </div>
            ) : (
              <div className={`overflow-x-auto rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
                <table className="w-full">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        <input
                          type="checkbox"
                          onChange={(e) => setSelectedItems(e.target.checked ? filteredContacts.map((c) => c.id) : [])}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold cursor-pointer" onClick={() => handleSort("name")}>
                        Name <FaSort />
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold cursor-pointer" onClick={() => handleSort("email")}>
                        Email <FaSort />
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold cursor-pointer" onClick={() => handleSort("message")}>
                        Message <FaSort />
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold cursor-pointer" onClick={() => handleSort("createdAt")}>
                        Date <FaSort />
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact, index) => (
                      <tr key={contact.id || index} className={`border-b transition-colors duration-200 ${theme === "light" ? "hover:bg-gray-50" : "hover:bg-gray-700"}`}>
                        <td className="px-6 py-4 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(contact.id)}
                            onChange={() => handleSelectItem(contact.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm">{contact.name || "N/A"}</td>
                        <td className="px-6 py-4 text-sm">{contact.email || "N/A"}</td>
                        <td className="px-6 py-4 text-sm">{contact.message || "N/A"}</td>
                        <td className="px-6 py-4 text-sm">{contact.createdAt?.toDate().toLocaleString() || "-"}</td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleDelete(contact.id, "contacts")}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors duration-200"
                          >
                            <FaTrash size={14} /> Delete
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
              <div className={`text-center py-10 rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
                <p className="text-lg">💬 No comments found.</p>
              </div>
            ) : (
              <div className={`overflow-x-auto rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
                <table className="w-full">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        <input
                          type="checkbox"
                          onChange={(e) => setSelectedItems(e.target.checked ? filteredComments.map((c) => c.id) : [])}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold cursor-pointer" onClick={() => handleSort("name")}>
                        Name <FaSort />
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold cursor-pointer" onClick={() => handleSort("message")}>
                        Comment <FaSort />
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold cursor-pointer" onClick={() => handleSort("createdAt")}>
                        Date <FaSort />
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComments.map((comment, index) => (
                      <tr key={comment.id || index} className={`border-b transition-colors duration-200 ${theme === "light" ? "hover:bg-gray-50" : "hover:bg-gray-700"}`}>
                        <td className="px-6 py-4 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(comment.id)}
                            onChange={() => handleSelectItem(comment.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm">{comment.name || "N/A"}</td>
                        <td className="px-6 py-4 text-sm">{comment.message || "N/A"}</td>
                        <td className="px-6 py-4 text-sm">{comment.createdAt?.toDate().toLocaleString() || "-"}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openForm("comments", comment)}
                              className="text-orange-600 hover:text-orange-800 flex items-center gap-1 transition-colors duration-200"
                            >
                              <FaEdit size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id, "comments")}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors duration-200"
                            >
                              <FaTrash size={14} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === "projects" ? (
            filteredProjects.length === 0 ? (
              <div className={`text-center py-10 rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
                <p className="text-lg">🚀 No projects found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    className={`rounded-xl p-6 shadow-lg border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
                      theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-orange-600 truncate">{project.Title || "N/A"}</h3>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(project.id)}
                        onChange={() => handleSelectItem(project.id)}
                        className="rounded border-gray-300"
                      />
                    </div>
                    {project.Img && (
                      <img
                        src={project.Img}
                        alt={project.Title}
                        className="w-full h-40 object-cover rounded-lg mt-3"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found")}
                      />
                    )}
                    <p className="text-sm mt-2"><strong>Category:</strong> {project.category || "N/A"}</p>
                    <p className="text-sm mt-1 line-clamp-2">{project.Description || "N/A"}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {project.TechStack?.map((tech, idx) => (
                        <span key={idx} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          {tech || "N/A"}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between gap-3 mt-4">
                      {project.Github && (
                        <a href={project.Github} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800 text-sm">
                          GitHub
                        </a>
                      )}
                      {project.Link && (
                        <a href={project.Link} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800 text-sm">
                          Live
                        </a>
                      )}
                      <div className="flex gap-3">
                        <button
                          onClick={() => openForm("projects", project)}
                          className="text-orange-600 hover:text-orange-800 flex items-center gap-1 text-sm transition-colors duration-200"
                        >
                          <FaEdit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, "projects")}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm transition-colors duration-200"
                        >
                          <FaTrash size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            filteredCertificates.length === 0 ? (
              <div className={`text-center py-10 rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
                <p className="text-lg">🏆 No certificates found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map((certificate, index) => (
                  <div
                    key={certificate.id || index}
                    className={`rounded-xl p-6 shadow-lg border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
                      theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-orange-600 truncate">{certificate.title || "N/A"}</h3>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(certificate.id)}
                        onChange={() => handleSelectItem(certificate.id)}
                        className="rounded border-gray-300"
                      />
                    </div>
                    {certificate.Img && (
                      <img
                        src={certificate.Img}
                        alt={certificate.title}
                        className="w-full h-40 object-cover rounded-lg mt-3"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found")}
                      />
                    )}
                    <p className="text-sm mt-2"><strong>Issuer:</strong> {certificate.issuer || "N/A"}</p>
                    <p className="text-sm mt-1"><strong>Date:</strong> {certificate.date || "N/A"}</p>
                    <div className="flex justify-between gap-3 mt-4">
                      {certificate.Link && (
                        <a href={certificate.Link} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800 text-sm">
                          View Certificate
                        </a>
                      )}
                      <div className="flex gap-3">
                        <button
                          onClick={() => openForm("certificates", certificate)}
                          className="text-orange-600 hover:text-orange-800 flex items-center gap-1 text-sm transition-colors duration-200"
                        >
                          <FaEdit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(certificate.id, "certificates")}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm transition-colors duration-200"
                        >
                          <FaTrash size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {formOpen && formData && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 animate-fade-in">
              <div className={`w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
                theme === "light" ? "bg-white" : "bg-gray-800"
              }`}>
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className={`text-2xl font-bold ${theme === "light" ? "text-gray-800" : "text-gray-100"}`}>
                      {formData.id ? `Edit ${formData.collection.slice(0, -1)}` : `Add New ${formData.collection.slice(0, -1)}`}
                    </h2>
                    <button
                      onClick={closeForm}
                      className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(formData.collection === "comments" || formData.collection === "projects" || formData.collection === "certificates") && (
                        <div>
                          <label htmlFor="id" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>ID <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="id"
                            id="id"
                            value={formData.id}
                            onChange={handleFormChange}
                            required
                            className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                              theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                            } ${!formData.id.trim() ? "border-red-500" : ""}`}
                          />
                          {!formData.id.trim() && <p className="text-red-500 text-xs mt-1">ID is required</p>}
                        </div>
                      )}
                      {formData.collection === "comments" && (
                        <>
                          <div>
                            <label htmlFor="name" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Name <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={formData.name}
                              onChange={handleFormChange}
                              required
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              } ${!formData.name.trim() ? "border-red-500" : ""}`}
                            />
                            {!formData.name.trim() && <p className="text-red-500 text-xs mt-1">Name is required</p>}
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="message" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Comment <span className="text-red-500">*</span></label>
                            <textarea
                              name="message"
                              id="message"
                              rows={4}
                              value={formData.message}
                              onChange={handleFormChange}
                              required
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              } ${!formData.message.trim() ? "border-red-500" : ""}`}
                            />
                            {!formData.message.trim() && <p className="text-red-500 text-xs mt-1">Comment is required</p>}
                          </div>
                        </>
                      )}
                      {formData.collection === "projects" && (
                        <>
                          <div>
                            <label htmlFor="Title" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Title <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="Title"
                              id="Title"
                              value={formData.Title}
                              onChange={handleFormChange}
                              required
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              } ${!formData.Title.trim() ? "border-red-500" : ""}`}
                            />
                            {!formData.Title.trim() && <p className="text-red-500 text-xs mt-1">Title is required</p>}
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="Description" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Description <span className="text-red-500">*</span></label>
                            <textarea
                              name="Description"
                              id="Description"
                              rows={3}
                              value={formData.Description}
                              onChange={handleFormChange}
                              required
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              } ${!formData.Description.trim() ? "border-red-500" : ""}`}
                            />
                            {!formData.Description.trim() && <p className="text-red-500 text-xs mt-1">Description is required</p>}
                          </div>
                          <div>
                            <label htmlFor="Img" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Image URL</label>
                            <input
                              type="text"
                              name="Img"
                              id="Img"
                              value={formData.Img}
                              onChange={handleFormChange}
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              }`}
                            />
                          </div>
                          <div>
                            <label htmlFor="Github" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Github URL</label>
                            <input
                              type="text"
                              name="Github"
                              id="Github"
                              value={formData.Github}
                              onChange={handleFormChange}
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              }`}
                            />
                          </div>
                          <div>
                            <label htmlFor="Link" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Project URL</label>
                            <input
                              type="text"
                              name="Link"
                              id="Link"
                              value={formData.Link}
                              onChange={handleFormChange}
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              }`}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Tech Stack</label>
                            {formData.TechStack.map((item, index) => (
                              <div key={index} className="flex items-center gap-2 mb-2">
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => handleArrayChange(e, "TechStack", index)}
                                  className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                    theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem("TechStack", index)}
                                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addArrayItem("TechStack")}
                              className={`text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors duration-200`}
                            >
                              + Add Tech
                            </button>
                          </div>
                          <div className="md:col-span-2">
                            <label className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Features</label>
                            {formData.Features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 mb-2">
                                <input
                                  type="text"
                                  value={feature}
                                  onChange={(e) => handleArrayChange(e, "Features", index)}
                                  className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                    theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem("Features", index)}
                                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addArrayItem("Features")}
                              className={`text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors duration-200`}
                            >
                              + Add Feature
                            </button>
                          </div>
                          <div>
                            <label htmlFor="category" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Category <span className="text-red-500">*</span></label>
                            <select
                              name="category"
                              id="category"
                              value={formData.category}
                              onChange={handleFormChange}
                              required
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              } ${!formData.category.trim() ? "border-red-500" : ""}`}
                            >
                              <option value="">Select Category</option>
                              {categories.slice(1).map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                            {!formData.category.trim() && <p className="text-red-500 text-xs mt-1">Category is required</p>}
                          </div>
                        </>
                      )}
                      {formData.collection === "certificates" && (
                        <>
                          <div>
                            <label htmlFor="title" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Title <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="title"
                              id="title"
                              value={formData.title}
                              onChange={handleFormChange}
                              required
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              } ${!formData.title.trim() ? "border-red-500" : ""}`}
                            />
                            {!formData.title.trim() && <p className="text-red-500 text-xs mt-1">Title is required</p>}
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="description" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Description <span className="text-red-500">*</span></label>
                            <textarea
                              name="description"
                              id="description"
                              rows={3}
                              value={formData.description}
                              onChange={handleFormChange}
                              required
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              } ${!formData.description.trim() ? "border-red-500" : ""}`}
                            />
                            {!formData.description.trim() && <p className="text-red-500 text-xs mt-1">Description is required</p>}
                          </div>
                          <div>
                            <label htmlFor="Img" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Image URL</label>
                            <input
                              type="text"
                              name="Img"
                              id="Img"
                              value={formData.Img}
                              onChange={handleFormChange}
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              }`}
                            />
                          </div>
                          <div>
                            <label htmlFor="issuer" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Issuer <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="issuer"
                              id="issuer"
                              value={formData.issuer}
                              onChange={handleFormChange}
                              required
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              } ${!formData.issuer.trim() ? "border-red-500" : ""}`}
                            />
                            {!formData.issuer.trim() && <p className="text-red-500 text-xs mt-1">Issuer is required</p>}
                          </div>
                          <div>
                            <label htmlFor="date" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Date <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="date"
                              id="date"
                              value={formData.date}
                              onChange={handleFormChange}
                              required
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              } ${!formData.date.trim() ? "border-red-500" : ""}`}
                            />
                            {!formData.date.trim() && <p className="text-red-500 text-xs mt-1">Date is required</p>}
                          </div>
                          <div>
                            <label htmlFor="Link" className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Link URL</label>
                            <input
                              type="text"
                              name="Link"
                              id="Link"
                              value={formData.Link}
                              onChange={handleFormChange}
                              className={`w-full px-4 py-2 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                                theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"
                              }`}
                            />
                          </div>
                        </>
                      )}
                    </form>
                  </div>
                  <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={closeForm}
                      className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                        theme === "light" ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      }`}
                      disabled={formLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={submitForm}
                      disabled={formLoading || !validateForm()}
                      className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                        theme === "light" ? "bg-orange-600 text-white hover:bg-orange-700" : "bg-orange-500 text-white hover:bg-orange-600"
                      } ${!validateForm() || formLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {formLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;