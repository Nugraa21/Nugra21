import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
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
  FaChartBar,
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
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-xl shadow-lg max-w-md mx-auto mt-12">
          <h2 className="text-xl font-semibold text-amber-700">Oops, Something Broke</h2>
          <p className="mt-2 text-sm text-amber-600">{this.state.error?.message || "Check the console or try again later."}</p>
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
  const [showSummary, setShowSummary] = useState(false);
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
      <div className={`min-h-screen font-inter transition-colors duration-500 ${theme === "light" ? "bg-gray-50 text-gray-900" : "bg-gray-950 text-gray-100"}`}>
        {isMobile && (
          <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm text-center">
              <FaExclamationTriangle className="text-amber-500 text-4xl mb-4 mx-auto" />
              <h2 className="text-lg font-semibold text-gray-800">Mobile Not Supported</h2>
              <p className="mt-2 text-sm text-gray-600">Use a desktop for the full experience.</p>
              <button
                onClick={() => setIsMobile(false)}
                className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="flex">
          <aside className={`fixed inset-y-0 left-0 w-64 ${navbarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out ${theme === "light" ? "bg-white" : "bg-gray-900"} shadow-lg z-50`}>
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-amber-600">Nugra21 Studio</h1>
              <button
                onClick={() => setNavbarOpen(false)}
                className="md:hidden text-amber-500 hover:text-amber-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-2 p-4">
              {["contacts", "comments", "projects", "certificates"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearchTerm(""); setCategoryFilter("All"); setNavbarOpen(false); setShowSummary(false); }}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab
                      ? "bg-amber-500 text-white shadow-md"
                      : theme === "light"
                      ? "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                      : "text-gray-300 hover:bg-amber-900 hover:text-amber-400"
                  }`}
                >
                  {tab === "contacts" && <FaTable size={16} />}
                  {tab === "comments" && <FaComments size={16} />}
                  {tab === "projects" && <FaProjectDiagram size={16} />}
                  {tab === "certificates" && <FaCertificate size={16} />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
              <button
                onClick={() => setShowSummary(!showSummary)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  showSummary
                    ? "bg-amber-500 text-white shadow-md"
                    : theme === "light"
                    ? "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                    : "text-gray-300 hover:bg-amber-900 hover:text-amber-400"
                }`}
              >
                <FaChartBar size={16} /> Summary
              </button>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                {theme === "light" ? <FaMoon size={16} /> : <FaSun size={16} />}
                {theme === "light" ? "Dark" : "Light"}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <FaSignOutAlt size={16} /> Logout
              </button>
            </nav>
          </aside>

          <div className="flex-1 md:ml-64">
            <header className={`sticky top-0 z-40 ${theme === "light" ? "bg-white" : "bg-gray-900"} shadow-sm`}>
              <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <button
                  onClick={() => setNavbarOpen(!navbarOpen)}
                  className="text-amber-500 hover:text-amber-600 md:hidden"
                >
                  <FaBars size={20} />
                </button>
                <h1 className="text-xl font-bold text-amber-600">Dashboard</h1>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
              {error && (
                <div className={`bg-amber-50 text-amber-600 p-4 rounded-xl text-sm shadow-md mb-6 ${theme === "dark" && "bg-amber-900 text-amber-200"} animate-pulse`}>
                  <strong className="font-semibold">Error:</strong> {error}
                </div>
              )}
              {showSummary && (
                <div className={`mb-8 p-6 rounded-2xl ${theme === "light" ? "bg-white" : "bg-gray-900"} shadow-lg`}>
                  <h2 className="text-xl font-semibold text-amber-600 mb-4">Data Summary</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-amber-50 dark:bg-amber-900 rounded-lg shadow-md text-center transform transition-all duration-300 hover:scale-105">
                      <h3 className="text-sm font-medium text-amber-600">Contacts</h3>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{contacts.length}</p>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900 rounded-lg shadow-md text-center transform transition-all duration-300 hover:scale-105">
                      <h3 className="text-sm font-medium text-amber-600">Comments</h3>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{comments.length}</p>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900 rounded-lg shadow-md text-center transform transition-all duration-300 hover:scale-105">
                      <h3 className="text-sm font-medium text-amber-600">Projects</h3>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{projects.length}</p>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900 rounded-lg shadow-md text-center transform transition-all duration-300 hover:scale-105">
                      <h3 className="text-sm font-medium text-amber-600">Certificates</h3>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{certificates.length}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-semibold text-amber-600">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={`Search ${activeTab}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full md:w-64 px-4 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                        theme === "light" ? "bg-white border-gray-200 text-gray-800" : "bg-gray-800 border-gray-700 text-gray-200"
                      }`}
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400">{searchTerm.length}</span>
                  </div>
                  {activeTab === "projects" && (
                    <div className="relative">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={`w-full md:w-36 px-4 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                          theme === "light" ? "bg-white border-gray-200 text-gray-800" : "bg-gray-800 border-gray-700 text-gray-200"
                        }`}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <FaFilter className="absolute right-3 top-3 text-gray-400 text-xs" />
                    </div>
                  )}
                  {(activeTab === "comments" || activeTab === "projects" || activeTab === "certificates") && (
                    <button
                      onClick={() => openForm(activeTab)}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      <FaPlus size={12} /> Add
                    </button>
                  )}
                  {selectedItems.length > 0 && (
                    <button
                      onClick={() => handleBulkDelete(activeTab)}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white text-sm rounded-lg hover:bg-rose-600 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      <FaTrash size={12} /> Delete ({selectedItems.length})
                    </button>
                  )}
                  <button
                    onClick={exportData}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    <FaFileExport size={12} /> Export
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                </div>
              ) : activeTab === "contacts" ? (
                filteredContacts.length === 0 ? (
                  <div className={`text-center py-12 rounded-xl ${theme === "light" ? "bg-white" : "bg-gray-900"} shadow-lg`}>
                    <p className="text-sm text-gray-500">No contacts found.</p>
                  </div>
                ) : (
                  <div className={`rounded-xl overflow-hidden ${theme === "light" ? "bg-white" : "bg-gray-900"} shadow-lg`}>
                    <table className="w-full text-sm">
                      <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">
                            <input
                              type="checkbox"
                              onChange={(e) => setSelectedItems(e.target.checked ? filteredContacts.map((c) => c.id) : [])}
                              className="rounded border-gray-300"
                            />
                          </th>
                          <th className="px-4 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort("name")}>
                            Name <FaSort size={12} className="inline" />
                          </th>
                          <th className="px-4 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort("email")}>
                            Email <FaSort size={12} className="inline" />
                          </th>
                          <th className="px-4 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort("message")}>
                            Message <FaSort size={12} className="inline" />
                          </th>
                          <th className="px-4 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort("createdAt")}>
                            Date <FaSort size={12} className="inline" />
                          </th>
                          <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredContacts.map((contact, index) => (
                          <tr key={contact.id || index} className={`border-t ${theme === "light" ? "border-gray-100 hover:bg-amber-50" : "border-gray-800 hover:bg-amber-900"} transition-all duration-200`}>
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(contact.id)}
                                onChange={() => handleSelectItem(contact.id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="px-4 py-3">{contact.name || "N/A"}</td>
                            <td className="px-4 py-3">{contact.email || "N/A"}</td>
                            <td className="px-4 py-3">{contact.message || "N/A"}</td>
                            <td className="px-4 py-3">{contact.createdAt?.toDate().toLocaleString() || "-"}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDelete(contact.id, "contacts")}
                                className="text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors duration-300"
                              >
                                <FaTrash size={12} />
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
                  <div className={`text-center py-12 rounded-xl ${theme === "light" ? "bg-white" : "bg-gray-900"} shadow-lg`}>
                    <p className="text-sm text-gray-500">No comments found.</p>
                  </div>
                ) : (
                  <div className={`rounded-xl overflow-hidden ${theme === "light" ? "bg-white" : "bg-gray-900"} shadow-lg`}>
                    <table className="w-full text-sm">
                      <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">
                            <input
                              type="checkbox"
                              onChange={(e) => setSelectedItems(e.target.checked ? filteredComments.map((c) => c.id) : [])}
                              className="rounded border-gray-300"
                            />
                          </th>
                          <th className="px-4 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort("name")}>
                            Name <FaSort size={12} className="inline" />
                          </th>
                          <th className="px-4 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort("message")}>
                            Comment <FaSort size={12} className="inline" />
                          </th>
                          <th className="px-4 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort("createdAt")}>
                            Date <FaSort size={12} className="inline" />
                          </th>
                          <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredComments.map((comment, index) => (
                          <tr key={comment.id || index} className={`border-t ${theme === "light" ? "border-gray-100 hover:bg-amber-50" : "border-gray-800 hover:bg-amber-900"} transition-all duration-200`}>
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(comment.id)}
                                onChange={() => handleSelectItem(comment.id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="px-4 py-3">{comment.name || "N/A"}</td>
                            <td className="px-4 py-3">{comment.message || "N/A"}</td>
                            <td className="px-4 py-3">{comment.createdAt?.toDate().toLocaleString() || "-"}</td>
                            <td className="px-4 py-3 flex gap-2">
                              <button
                                onClick={() => openForm("comments", comment)}
                                className="text-amber-500 hover:text-amber-600 flex items-center gap-1 transition-colors duration-300"
                              >
                                <FaEdit size={12} />
                              </button>
                              <button
                                onClick={() => handleDelete(comment.id, "comments")}
                                className="text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors duration-300"
                              >
                                <FaTrash size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : activeTab === "projects" ? (
                filteredProjects.length === 0 ? (
                  <div className={`text-center py-12 rounded-xl ${theme === "light" ? "bg-white" : "bg-gray-900"} shadow-lg`}>
                    <p className="text-sm text-gray-500">No projects found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                      <div
                        key={project.id || index}
                        className={`rounded-xl p-5 ${theme === "light" ? "bg-white" : "bg-gray-900"} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-amber-600 truncate">{project.Title || "N/A"}</h3>
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
                            className="w-full h-36 object-cover rounded-lg mb-3 transition-transform duration-300 hover:scale-110"
                            onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found")}
                          />
                        )}
                        <p className="text-xs text-gray-500 mb-1">{project.category || "N/A"}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{project.Description || "N/A"}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.TechStack?.map((tech, idx) => (
                            <span key={idx} className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                              {tech || "N/A"}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs">
                          <div className="flex gap-3">
                            {project.Github && (
                              <a href={project.Github} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-600 transition-colors duration-300">
                                GitHub
                              </a>
                            )}
                            {project.Link && (
                              <a href={project.Link} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-600 transition-colors duration-300">
                                Live
                              </a>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => openForm("projects", project)}
                              className="text-amber-500 hover:text-amber-600 transition-colors duration-300"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id, "projects")}
                              className="text-rose-500 hover:text-rose-600 transition-colors duration-300"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                filteredCertificates.length === 0 ? (
                  <div className={`text-center py-12 rounded-xl ${theme === "light" ? "bg-white" : "bg-gray-900"} shadow-lg`}>
                    <p className="text-sm text-gray-500">No certificates found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCertificates.map((certificate, index) => (
                      <div
                        key={certificate.id || index}
                        className={`rounded-xl p-5 ${theme === "light" ? "bg-white" : "bg-gray-900"} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-amber-600 truncate">{certificate.title || "N/A"}</h3>
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
                            className="w-full h-36 object-cover rounded-lg mb-3 transition-transform duration-300 hover:scale-110"
                            onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found")}
                          />
                        )}
                        <p className="text-xs text-gray-500 mb-1">{certificate.issuer || "N/A"}</p>
                        <p className="text-xs text-gray-500">{certificate.date || "N/A"}</p>
                        <div className="flex justify-between mt-4 text-xs">
                          {certificate.Link && (
                            <a href={certificate.Link} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-600 transition-colors duration-300">
                              View
                            </a>
                          )}
                          <div className="flex gap-3">
                            <button
                              onClick={() => openForm("certificates", certificate)}
                              className="text-amber-500 hover:text-amber-600 transition-colors duration-300"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete(certificate.id, "certificates")}
                              className="text-rose-500 hover:text-rose-600 transition-colors duration-300"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {formOpen && formData && (
                <div className="fixed inset-0 bg-gray-950 bg-opacity-80 flex items-center justify-center z-50">
                  <div className={`w-full max-w-4xl rounded-2xl ${theme === "light" ? "bg-white" : "bg-gray-900"} shadow-2xl transform transition-all duration-500 scale-95 hover:scale-100`}>
                    <div className="flex flex-col max-h-[85vh]">
                      <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-amber-600">
                          {formData.id ? `Edit ${formData.collection.slice(0, -1)}` : `New ${formData.collection.slice(0, -1)}`}
                        </h2>
                        <button
                          onClick={closeForm}
                          className="text-gray-500 hover:text-gray-600 transition-colors duration-300"
                        >
                          <FaTimes size={20} />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <form onSubmit={submitForm} className="lg:col-span-2 space-y-4">
                            {(formData.collection === "comments" || formData.collection === "projects" || formData.collection === "certificates") && (
                              <div>
                                <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>ID <span className="text-rose-500">*</span></label>
                                <input
                                  type="text"
                                  name="id"
                                  value={formData.id}
                                  onChange={handleFormChange}
                                  required
                                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                    theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                  } ${!formData.id.trim() ? "border-rose-500" : ""}`}
                                />
                                {!formData.id.trim() && <p className="text-rose-500 text-xs mt-1 animate-pulse">ID is required</p>}
                              </div>
                            )}
                            {formData.collection === "comments" && (
                              <>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Name <span className="text-rose-500">*</span></label>
                                  <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    } ${!formData.name.trim() ? "border-rose-500" : ""}`}
                                  />
                                  {!formData.name.trim() && <p className="text-rose-500 text-xs mt-1 animate-pulse">Name is required</p>}
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Comment <span className="text-rose-500">*</span></label>
                                  <textarea
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleFormChange}
                                    required
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 resize-y transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    } ${!formData.message.trim() ? "border-rose-500" : ""}`}
                                  />
                                  {!formData.message.trim() && <p className="text-rose-500 text-xs mt-1 animate-pulse">Comment is required</p>}
                                </div>
                              </>
                            )}
                            {formData.collection === "projects" && (
                              <>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Title <span className="text-rose-500">*</span></label>
                                  <input
                                    type="text"
                                    name="Title"
                                    value={formData.Title}
                                    onChange={handleFormChange}
                                    required
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    } ${!formData.Title.trim() ? "border-rose-500" : ""}`}
                                  />
                                  {!formData.Title.trim() && <p className="text-rose-500 text-xs mt-1 animate-pulse">Title is required</p>}
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Description <span className="text-rose-500">*</span></label>
                                  <textarea
                                    name="Description"
                                    rows={3}
                                    value={formData.Description}
                                    onChange={handleFormChange}
                                    required
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 resize-y transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    } ${!formData.Description.trim() ? "border-rose-500" : ""}`}
                                  />
                                  {!formData.Description.trim() && <p className="text-rose-500 text-xs mt-1 animate-pulse">Description is required</p>}
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Image URL</label>
                                  <input
                                    type="text"
                                    name="Img"
                                    value={formData.Img}
                                    onChange={handleFormChange}
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Github URL</label>
                                  <input
                                    type="text"
                                    name="Github"
                                    value={formData.Github}
                                    onChange={handleFormChange}
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Project URL</label>
                                  <input
                                    type="text"
                                    name="Link"
                                    value={formData.Link}
                                    onChange={handleFormChange}
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Tech Stack</label>
                                  {formData.TechStack.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                      <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleArrayChange(e, "TechStack", index)}
                                        className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                          theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                        }`}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem("TechStack", index)}
                                        className="text-rose-500 hover:text-rose-600 transition-colors duration-300"
                                      >
                                        <FaTrash size={12} />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => addArrayItem("TechStack")}
                                    className="text-amber-500 text-xs hover:text-amber-600 flex items-center gap-1 mt-1 transition-colors duration-300"
                                  >
                                    <FaPlus size={10} /> Add Tech
                                  </button>
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Features</label>
                                  {formData.Features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                      <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleArrayChange(e, "Features", index)}
                                        className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                          theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                        }`}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem("Features", index)}
                                        className="text-rose-500 hover:text-rose-600 transition-colors duration-300"
                                      >
                                        <FaTrash size={12} />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => addArrayItem("Features")}
                                    className="text-amber-500 text-xs hover:text-amber-600 flex items-center gap-1 mt-1 transition-colors duration-300"
                                  >
                                    <FaPlus size={10} /> Add Feature
                                  </button>
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Category <span className="text-rose-500">*</span></label>
                                  <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleFormChange}
                                    required
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    } ${!formData.category.trim() ? "border-rose-500" : ""}`}
                                  >
                                    <option value="">Select Category</option>
                                    {categories.slice(1).map((cat) => (
                                      <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                  </select>
                                  {!formData.category.trim() && <p className="text-rose-500 text-xs mt-1 animate-pulse">Category is required</p>}
                                </div>
                              </>
                            )}
                            {formData.collection === "certificates" && (
                              <>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Title <span className="text-rose-500">*</span></label>
                                  <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    required
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    } ${!formData.title.trim() ? "border-rose-500" : ""}`}
                                  />
                                  {!formData.title.trim() && <p className="text-rose-500 text-xs mt-1 animate-pulse">Title is required</p>}
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Description <span className="text-rose-500">*</span></label>
                                  <textarea
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    required
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 resize-y transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    } ${!formData.description.trim() ? "border-rose-500" : ""}`}
                                  />
                                  {!formData.description.trim() && <p className="text-rose-500 text-xs mt-1 animate-pulse">Description is required</p>}
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Image URL</label>
                                  <input
                                    type="text"
                                    name="Img"
                                    value={formData.Img}
                                    onChange={handleFormChange}
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Issuer <span className="text-rose-500">*</span></label>
                                  <input
                                    type="text"
                                    name="issuer"
                                    value={formData.issuer}
                                    onChange={handleFormChange}
                                    required
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    } ${!formData.issuer.trim() ? "border-rose-500" : ""}`}
                                  />
                                  {!formData.issuer.trim() && <p className="text-rose-500 text-xs mt-1 animate-pulse">Issuer is required</p>}
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Date <span className="text-rose-500">*</span></label>
                                  <input
                                    type="text"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleFormChange}
                                    required
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    } ${!formData.date.trim() ? "border-rose-500" : ""}`}
                                  />
                                  {!formData.date.trim() && <p className="text-rose-500 text-xs mt-1 animate-pulse">Date is required</p>}
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}>Link URL</label>
                                  <input
                                    type="text"
                                    name="Link"
                                    value={formData.Link}
                                    onChange={handleFormChange}
                                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 ${
                                      theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                                    }`}
                                  />
                                </div>
                              </>
                            )}
                          </form>
                          {(formData.collection === "projects" || formData.collection === "certificates") && (
                            <div className="lg:col-span-1">
                              <h3 className={`text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-2`}>Preview</h3>
                              <div className={`rounded-xl p-4 ${theme === "light" ? "bg-gray-50" : "bg-gray-800"} shadow-lg transition-all duration-300 transform hover:scale-105`}>
                                <h4 className="text-base font-semibold text-amber-600 mb-2">{formData.Title || formData.title || "Untitled"}</h4>
                                {imagePreview && (
                                  <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded-lg mb-2 transition-transform duration-300 hover:scale-110"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found")}
                                  />
                                )}
                                <p className="text-xs text-gray-500 mb-1">{formData.category || formData.issuer || "N/A"}</p>
                                <p className="text-xs text-gray-600 line-clamp-2">{formData.Description || formData.description || "N/A"}</p>
                                {formData.collection === "projects" && (
                                  <>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {formData.TechStack?.map((tech, idx) => (
                                        <span key={idx} className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                                          {tech || "N/A"}
                                        </span>
                                      ))}
                                    </div>
                                    {formData.Features?.length > 0 && (
                                      <div className="mt-2">
                                        <p className="text-xs text-gray-500">Features:</p>
                                        <ul className="list-disc list-inside text-xs text-gray-600">
                                          {formData.Features.map((feature, idx) => (
                                            <li key={idx}>{feature || "N/A"}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </>
                                )}
                                {formData.collection === "certificates" && (
                                  <p className="text-xs text-gray-500 mt-1">{formData.date || "N/A"}</p>
                                )}
                                <div className="flex gap-3 mt-3 text-xs">
                                  {formData.Github && (
                                    <a href={formData.Github} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-600 transition-colors duration-300">
                                      GitHub
                                    </a>
                                  )}
                                  {formData.Link && (
                                    <a href={formData.Link} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-600 transition-colors duration-300">
                                      {formData.collection === "projects" ? "Live" : "View"}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-6 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          type="button"
                          onClick={closeForm}
                          className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 transform hover:scale-105 ${
                            theme === "light" ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                          disabled={formLoading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          onClick={submitForm}
                          disabled={formLoading || !validateForm()}
                          className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                            theme === "light" ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-amber-600 text-white hover:bg-amber-700"
                          } ${!validateForm() || formLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {formLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Saving...
                            </span>
                          ) : (
                            "Save"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;