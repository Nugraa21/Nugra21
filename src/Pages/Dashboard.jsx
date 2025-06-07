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
        <div className="bg-red-50 border-l-4 border-red-400 p-5 rounded-lg shadow-lg max-w-2xl mx-auto mt-10">
          <h2 className="text-lg font-bold text-red-700">Error Occurred</h2>
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

  const navigate = useNavigate();

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
            setProjects(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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

  const handleDelete = async (id, collectionName) => {
    if (!window.confirm(`Delete ${collectionName.slice(0, -1)}?`)) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === "contacts") setContacts((prev) => prev.filter((item) => item.id !== id));
      else if (collectionName === "comments") setComments((prev) => prev.filter((item) => item.id !== id));
      else if (collectionName === "projects") setProjects((prev) => prev.filter((item) => item.id !== id));
      else if (collectionName === "certificates") setCertificates((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setError(`Failed to delete ${collectionName.slice(0, -1)}: ${error.message}`);
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    [contact.name, contact.email, contact.message].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredComments = comments.filter((comment) =>
    [comment.name, comment.message].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredProjects = projects.filter((project) =>
    [project.Title, project.Description, project.category].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredCertificates = certificates.filter((certificate) =>
    [certificate.title, certificate.description, certificate.issuer].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
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

  const submitForm = async (e) => {
    e.preventDefault();
    const { collection, id, ...data } = formData;

    if (collection === "comments" && (!data.name.trim() || !data.message.trim())) {
      alert("Name and Message are required.");
      return;
    } else if (collection === "projects" && (!data.Title.trim() || !data.Description.trim() || !id.trim())) {
      alert("ID, Title, and Description are required.");
      return;
    } else if (collection === "certificates" && (!data.title.trim() || !data.description.trim() || !id.trim())) {
      alert("ID, Title, and Description are required.");
      return;
    }

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
      projects: "Title,Description,Img,Github,Link,TechStack,Features,Category",
      certificates: "Title,Description,Img,Issuer,Date,Link"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans text-gray-900">
        {/* {isMobile && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md text-center">
              <FaExclamationTriangle className="text-red-500 text-5xl mb-4 mx-auto" />
              <h2 className="text-xl font-bold text-gray-800">Unsupported Device</h2>
              <p className="mt-2 text-gray-600">This dashboard is optimized for desktop use.</p>
              <button
                onClick={() => setNavbarOpen(false)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )} */}

        <header className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setNavbarOpen(!navbarOpen)}
                className="text-orange-500 hover:text-orange-600 md:hidden focus:outline-none"
              >
                {navbarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
              <h1 className="text-2xl font-bold text-orange-600">Dashboard</h1>
            </div>
            <nav
              className={`${
                navbarOpen ? "flex" : "hidden md:flex"
              } flex-col md:flex-row gap-2 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none rounded-lg md:rounded-none`}
            >
              {["contacts", "comments", "projects", "certificates"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearchTerm(""); setNavbarOpen(false); }}
                  className={`flex items-center gap-3 px-5 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-orange-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
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
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-md mb-6 text-sm">
              <strong className="font-medium">Error:</strong> {error}
            </div>
          )}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              {activeTab === "contacts" && "📋 Contacts"}
              {activeTab === "comments" && "💬 Comments"}
              {activeTab === "projects" && "🚀 Projects"}
              {activeTab === "certificates" && "🏆 Certificates"}
            </h2>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`🔍 Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-72 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 shadow-sm"
                />
                <span className="absolute right-3 top-2 text-gray-400">{searchTerm.length}</span>
              </div>
              {(activeTab === "comments" || activeTab === "projects" || activeTab === "certificates") && (
                <button
                  onClick={() => openForm(activeTab)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-md"
                >
                  <FaPlus size={16} /> Add New
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
              <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <p className="text-gray-600 text-lg">📭 No contacts found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="w-full">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Message</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact, index) => (
                      <tr key={contact.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm text-gray-600">{contact.name || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{contact.email || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{contact.message || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{contact.createdAt?.toDate().toLocaleString() || "-"}</td>
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
              <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <p className="text-gray-600 text-lg">💬 No comments found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="w-full">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Comment</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComments.map((comment, index) => (
                      <tr key={comment.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm text-gray-600">{comment.name || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{comment.message || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{comment.createdAt?.toDate().toLocaleString() || "-"}</td>
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
              <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <p className="text-gray-600 text-lg">🚀 No projects found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <h3 className="text-xl font-bold text-orange-600 truncate">{project.Title || "N/A"}</h3>
                    <p className="text-gray-600 text-sm mt-2"><strong>Category:</strong> {project.category || "N/A"}</p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{project.Description || "N/A"}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {project.TechStack?.map((tech, idx) => (
                        <span key={idx} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          {tech || "N/A"}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
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
                ))}
              </div>
            )
          ) : (
            filteredCertificates.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <p className="text-gray-600 text-lg">🏆 No certificates found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map((certificate, index) => (
                  <div
                    key={certificate.id || index}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <h3 className="text-xl font-bold text-orange-600 truncate">{certificate.title || "N/A"}</h3>
                    <p className="text-gray-600 text-sm mt-2"><strong>Issuer:</strong> {certificate.issuer || "N/A"}</p>
                    <p className="text-gray-600 text-sm mt-1"><strong>Date:</strong> {certificate.date || "N/A"}</p>
                    <div className="flex justify-end gap-3 mt-4">
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
                ))}
              </div>
            )
          )}

          {formOpen && formData && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-5xl h-[90vh] flex flex-col md:flex-row rounded-xl shadow-2xl overflow-hidden">
                <div className="w-full md:w-1/2 p-6 bg-gray-50 overflow-y-auto">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                    {formData.id ? `Edit ${formData.collection.slice(0, -1)}` : `Add New ${formData.collection.slice(0, -1)}`}
                  </h2>
                  <form onSubmit={submitForm} className="space-y-5">
                    {(formData.collection === "comments" || formData.collection === "projects" || formData.collection === "certificates") && (
                      <div>
                        <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                        <input
                          type="text"
                          name="id"
                          id="id"
                          value={formData.id}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    )}
                    {formData.collection === "comments" && (
                      <>
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                          <textarea
                            name="message"
                            id="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </>
                    )}
                    {formData.collection === "projects" && (
                      <>
                        <div>
                          <label htmlFor="Title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            name="Title"
                            id="Title"
                            value={formData.Title}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label htmlFor="Description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            name="Description"
                            id="Description"
                            rows={3}
                            value={formData.Description}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label htmlFor="Img" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                          <input
                            type="text"
                            name="Img"
                            id="Img"
                            value={formData.Img}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label htmlFor="Github" className="block text-sm font-medium text-gray-700 mb-1">Github URL</label>
                          <input
                            type="text"
                            name="Github"
                            id="Github"
                            value={formData.Github}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label htmlFor="Link" className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
                          <input
                            type="text"
                            name="Link"
                            id="Link"
                            value={formData.Link}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                          {formData.TechStack.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange(e, "TechStack", index)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
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
                            className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors duration-200"
                          >
                            + Add Tech
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                          {formData.Features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleArrayChange(e, "Features", index)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
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
                            className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors duration-200"
                          >
                            + Add Feature
                          </button>
                        </div>
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <input
                            type="text"
                            name="category"
                            id="category"
                            value={formData.category}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </>
                    )}
                    {formData.collection === "certificates" && (
                      <>
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            name="description"
                            id="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label htmlFor="Img" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                          <input
                            type="text"
                            name="Img"
                            id="Img"
                            value={formData.Img}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 mb-1">Issuer</label>
                          <input
                            type="text"
                            name="issuer"
                            id="issuer"
                            value={formData.issuer}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="text"
                            name="date"
                            id="date"
                            value={formData.date}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label htmlFor="Link" className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                          <input
                            type="text"
                            name="Link"
                            id="Link"
                            value={formData.Link}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </>
                    )}
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        type="button"
                        onClick={closeForm}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300"
                        disabled={formLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300 flex items-center gap-2"
                      >
                        {formLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
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
                  </form>
                </div>
                <div className="w-full md:w-1/2 p-6 bg-white overflow-y-auto">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Preview</h2>
                  {formData.collection === "comments" && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="text-sm font-medium text-gray-700">ID: <span className="text-gray-900">{formData.id || "N/A"}</span></p>
                        <p className="text-sm font-medium text-gray-700">Name: <span className="text-gray-900">{formData.name || "N/A"}</span></p>
                        <p className="text-sm font-medium text-gray-700">Comment: <span className="text-gray-900">{formData.message || "N/A"}</span></p>
                      </div>
                    </div>
                  )}
                  {formData.collection === "projects" && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="text-sm font-medium text-gray-700">ID: <span className="text-gray-900">{formData.id || "N/A"}</span></p>
                        <p className="text-sm font-medium text-gray-700">Title: <span className="text-gray-900">{formData.Title || "N/A"}</span></p>
                        <p className="text-sm font-medium text-gray-700">Description: <span className="text-gray-900">{formData.Description || "N/A"}</span></p>
                        <p className="text-sm font-medium text-gray-700">Image URL: <span className="text-gray-900">{formData.Img || "N/A"}</span></p>
                        {formData.Img && (
                          <img
                            src={formData.Img}
                            alt="Preview"
                            className="w-full max-w-xs h-48 object-cover rounded-lg shadow-md mt-2"
                            onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found")}
                          />
                        )}
                        <p className="text-sm font-medium text-gray-700">Github URL: <span className="text-gray-900">{formData.Github || "N/A"}</span></p>
                        <p className="text-sm font-medium text-gray-700">Project URL: <span className="text-gray-900">{formData.Link || "N/A"}</span></p>
                        <p className="text-sm font-medium text-gray-700">Tech Stack:</p>
                        {formData.TechStack.length > 0 ? (
                          <ul className="list-disc list-inside text-sm text-gray-900 mt-1">
                            {formData.TechStack.map((tech, index) => (
                              <li key={index}>{tech || "N/A"}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-600">N/A</p>
                        )}
                        <p className="text-sm font-medium text-gray-700">Features:</p>
                        {formData.Features.length > 0 ? (
                          <ul className="list-disc list-inside text-sm text-gray-900 mt-1">
                            {formData.Features.map((feature, index) => (
                              <li key={index}>{feature || "N/A"}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-600">N/A</p>
                        )}
                        <p className="text-sm font-medium text-gray-700">Category: <span className="text-gray-900">{formData.category || "N/A"}</span></p>
                      </div>
                    </div>
                  )}
                  {formData.collection === "certificates" && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="text-sm font-medium text-gray-700">ID: <span className="text-gray-900">{formData.id || "N/A"}</span></p>
                        <p className="text-sm font-medium text-gray-700">Title: <span className="text-gray-900">{formData.title || "N/A"}</span></p>
                        <p className="text-sm font-medium text-gray-700">Description: <span className="text-gray-900">{formData.description || "N/A"}</span></p>
                        <p className="text-sm font-medium text-gray-700">Image URL: <span className="text-gray-900">{formData.Img || "N/A"}</span></p>
                        {formData.Img && (
                          <img
                            src={formData.Img}
                            alt="Preview"
                            className="w-full max-w-xs h-48 object-cover rounded-lg shadow-md mt-2"
                            onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found")}
                          />
                        )}
                        <p className="text-sm font-medium text-gray-700">Issuer: <span className="text-gray-900">{formData.issuer || "N/A"}</span></p>
                        <p className="text-sm font-medium text-gray-700">Date: <span className="text-gray-900">{formData.date || "N/A"}</span></p>
                        <p className="text-sm font-medium text-gray-700">Link URL: <span className="text-gray-900">{formData.Link || "N/A"}</span></p>
                      </div>
                    </div>
                  )}
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