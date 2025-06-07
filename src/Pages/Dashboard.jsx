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
        <div className="bg-orange-100 border-l-4 border-orange-600 p-6 rounded-xl text-orange-800 max-w-3xl mx-auto mt-8">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <p className="mt-2">{this.state.error?.message || "Please check the console or try again."}</p>
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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
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
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setContacts(data);
            if (activeTab === "contacts") setLoading(false);
          }, (error) => {
            console.error("Error fetching contacts:", error.message);
            setError(error.message);
            setLoading(false);
          });
          unsubscribes.push(contactsUnsubscribe);
        }

        if (activeTab === "comments" || activeTab === "all") {
          const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
          const commentsUnsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setComments(data);
            if (activeTab === "comments") setLoading(false);
          }, (error) => {
            console.error("Error fetching comments:", error.message);
            setError(error.message);
            setLoading(false);
          });
          unsubscribes.push(commentsUnsubscribe);
        }

        if (activeTab === "projects" || activeTab === "all") {
          const projectsUnsubscribe = onSnapshot(collection(db, "projects"), (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setProjects(data);
            if (activeTab === "projects") setLoading(false);
          }, (error) => {
            console.error("Error fetching projects:", error.message);
            setError(error.message);
            setLoading(false);
          });
          unsubscribes.push(projectsUnsubscribe);
        }

        if (activeTab === "certificates" || activeTab === "all") {
          const certificatesUnsubscribe = onSnapshot(collection(db, "certificates"), (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCertificates(data);
            if (activeTab === "certificates") setLoading(false);
          }, (error) => {
            console.error("Error fetching certificates:", error.message);
            setError(error.message);
            setLoading(false);
          });
          unsubscribes.push(certificatesUnsubscribe);
        }

        if (activeTab === "all") setLoading(false);
      } catch (error) {
        console.error("Error setting up listener:", error.message);
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
    const confirmDelete = window.confirm(`Are you sure you want to delete this ${collectionName.slice(0, -1)}?`);
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === "contacts") {
        setContacts((prev) => prev.filter((item) => item.id !== id));
      } else if (collectionName === "comments") {
        setComments((prev) => prev.filter((item) => item.id !== id));
      } else if (collectionName === "projects") {
        setProjects((prev) => prev.filter((item) => item.id !== id));
      } else if (collectionName === "certificates") {
        setCertificates((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error(`Failed to delete ${collectionName.slice(0, -1)}:`, error.message);
      setError(`Failed to delete ${collectionName.slice(0, -1)}: ${error.message}`);
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

  const filteredProjects = projects.filter(
    (project) =>
      project.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCertificates = certificates.filter(
    (certificate) =>
      certificate.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.issuer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openForm = (collectionName, item = null) => {
    if (collectionName === "comments") {
      setFormData({
        collection: "comments",
        id: item ? item.id : "",
        name: item ? item.name || "" : "",
        message: item ? item.message || "" : "",
      });
    } else if (collectionName === "projects") {
      setFormData({
        collection: "projects",
        id: item ? item.id : "",
        Title: item ? item.Title || "" : "",
        Description: item ? item.Description || "" : "",
        Img: item ? item.Img || "" : "",
        Github: item ? item.Github || "" : "",
        Link: item ? item.Link || "" : "",
        TechStack: item ? item.TechStack || [] : [],
        Features: item ? item.Features || [] : [],
        category: item ? item.category || "" : "",
      });
      setImagePreview(item?.Img || "");
    } else if (collectionName === "certificates") {
      setFormData({
        collection: "certificates",
        id: item ? item.id : "",
        title: item ? item.title || "" : "",
        description: item ? item.description || "" : "",
        Img: item ? item.Img || "" : "",
        issuer: item ? item.issuer || "" : "",
        date: item ? item.date || "" : "",
        Link: item ? item.Link || "" : "",
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
    if (name === "Img") {
      setImagePreview(value);
    }
  };

  const handleArrayChange = (e, field, index) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

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
      await setDoc(doc(db, collection, id), {
        ...data,
        updatedAt: serverTimestamp(),
        createdAt: data.createdAt || serverTimestamp(),
      });

      if (collection === "comments") {
        setComments((prev) =>
          prev.some((c) => c.id === id)
            ? prev.map((c) => (c.id === id ? { id, ...data } : c))
            : [...prev, { id, ...data }]
        );
      } else if (collection === "projects") {
        setProjects((prev) =>
          prev.some((p) => p.id === id)
            ? prev.map((p) => (p.id === id ? { id, ...data } : p))
            : [...prev, { id, ...data }]
        );
      } else if (collection === "certificates") {
        setCertificates((prev) =>
          prev.some((c) => c.id === id)
            ? prev.map((c) => (c.id === id ? { id, ...data } : c))
            : [...prev, { id, ...data }]
        );
      }
      closeForm();
    } catch (error) {
      console.error(`Failed to save ${collection.slice(0, -1)}:`, error.message);
      setError(`Failed to save ${collection.slice(0, -1)}: ${error.message}`);
    }
    setFormLoading(false);
  };

  const exportData = () => {
    let data;
    let headers;
    if (activeTab === "contacts") {
      data = filteredContacts;
      headers = "Name,Email,Message,Date";
    } else if (activeTab === "comments") {
      data = filteredComments;
      headers = "Name,Message,Date";
    } else if (activeTab === "projects") {
      data = filteredProjects;
      headers = "Title,Description,Img,Github,Link,TechStack,Features,Category";
    } else if (activeTab === "certificates") {
      data = filteredCertificates;
      headers = "Title,Description,Img,Issuer,Date,Link";
    }

    const csv = [
      headers,
      ...data.map((item) =>
        Object.values(item)
          .map((value) =>
            Array.isArray(value)
              ? `"${value.join(", ")}"`
              : `"${value?.toString().replace(/"/g, '""') || "N/A"}"`
          )
          .join(",")
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
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* {isMobile && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md text-center">
              <FaExclamationTriangle className="text-orange-500 text-5xl mb-4 mx-auto" />
              <h2 className="text-xl font-bold text-orange-600 mb-2">Device Not Supported</h2>
              <p className="text-gray-600 mb-4">This dashboard is optimized for desktop devices.</p>
              <button
                onClick={() => setNavbarOpen(false)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )} */}

        <header className="bg-white shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setNavbarOpen(!navbarOpen)}
                className="text-orange-600 hover:text-orange-700 md:hidden transition-transform duration-300"
              >
                {navbarOpen ? <FaTimes size={24} /> : <FaBars />}
              </button>
              <h2 className="text-2xl font-bold text-orange-600">Dashboard</h2>
            </div>
            <nav
              className={`${
                navbarOpen ? "flex" : "hidden md:flex"
              } flex-col md:flex-row gap-2 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none transition-all duration-300`}
            >
              {["contacts", "comments", "projects", "certificates"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearchTerm(""); setNavbarOpen(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-orange-100 hover:shadow-sm"
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
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-md mt-2 md:mt-0"
              >
                <FaSignOutAlt size={16} /> Sign Out
              </button>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {error && (
            <div className="bg-orange-100 border-l-4 border-orange-600 p-4 rounded-lg mb-6 text-orange-800">
              <strong>Error:</strong> {error}
            </div>
          )}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-orange-600">
              {activeTab === "contacts" ? "📋 Contacts" :
               activeTab === "comments" ? "💬 Comments" :
               activeTab === "projects" ? "🚀 Projects" : "🏆 Certificates"}
            </h1>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder={`🔍 Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 w-full md:w-64 shadow-sm"
              />
              {(activeTab === "comments" || activeTab === "projects" || activeTab === "certificates") && (
                <button
                  onClick={() => openForm(activeTab)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md"
                >
                  <FaPlus size={16} /> Add {activeTab.slice(0, -1)}
                </button>
              )}
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md"
              >
                <FaFileExport size={16} /> Export
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-600 text-lg font-medium">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading...</span>
            </div>
          ) : activeTab === "contacts" ? (
            filteredContacts.length === 0 ? (
              <p className="text-center text-gray-600 text-lg font-medium">📭 No contacts found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Message</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact, index) => (
                      <tr key={contact.id || index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-3 px-4">{contact.name || "N/A"}</td>
                        <td className="py-3 px-4">{contact.email || "N/A"}</td>
                        <td className="py-3 px-4">{contact.message || "N/A"}</td>
                        <td className="py-3 px-4">{contact.createdAt?.toDate().toLocaleString() || "-"}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDelete(contact.id, "contacts")}
                            className="text-red-500 hover:text-red-600 mr-2 transition-all duration-200"
                            title="Delete contact"
                            disabled={!contact.id}
                          >
                            <FaTrash size={16} />
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
              <p className="text-center text-gray-600 text-lg font-medium">💬 No comments found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Comment</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComments.map((comment, index) => (
                      <tr key={comment.id || index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-3 px-4">{comment.name || "N/A"}</td>
                        <td className="py-3 px-4">{comment.message || "N/A"}</td>
                        <td className="py-3 px-4">{comment.createdAt?.toDate().toLocaleString() || "-"}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => openForm("comments", comment)}
                            className="text-orange-500 hover:text-orange-600 mr-2 transition-all duration-200"
                            title="Edit comment"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id, "comments")}
                            className="text-red-500 hover:text-red-600 transition-all duration-200"
                            title="Delete comment"
                            disabled={!comment.id}
                          >
                            <FaTrash size={16} />
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
              <p className="text-center text-gray-600 text-lg font-medium">🚀 No projects found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
                  >
                    <h3 className="text-lg font-semibold text-orange-600">{project.Title || "N/A"}</h3>
                    <p className="text-gray-600 text-sm mt-2"><strong>Category:</strong> {project.category || "N/A"}</p>
                    <p className="text-gray-600 text-sm mt-1"><strong>Description:</strong> {project.Description || "N/A"}</p>
                    <p className="text-gray-600 text-sm mt-1"><strong>Tech Stack:</strong> {project.TechStack?.join(", ") || "N/A"}</p>
                    <p className="text-gray-600 text-sm mt-1"><strong>Features:</strong> {project.Features?.join(", ") || "N/A"}</p>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => openForm("projects", project)}
                        className="text-orange-500 hover:text-orange-600 flex items-center gap-2 text-sm transition-all duration-200"
                        title="Edit project"
                      >
                        <FaEdit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, "projects")}
                        className="text-red-500 hover:text-red-600 flex items-center gap-2 text-sm transition-all duration-200"
                        title="Delete project"
                        disabled={!project.id}
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
              <p className="text-center text-gray-600 text-lg font-medium">🏆 No certificates found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map((certificate, index) => (
                  <div
                    key={certificate.id || index}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
                  >
                    <h3 className="text-lg font-semibold text-orange-600">{certificate.title || "N/A"}</h3>
                    <p className="text-gray-600 text-sm mt-2"><strong>Issuer:</strong> {certificate.issuer || "N/A"}</p>
                    <p className="text-gray-600 text-sm mt-1"><strong>Date:</strong> {certificate.date || "N/A"}</p>
                    <p className="text-gray-600 text-sm mt-1"><strong>Description:</strong> {certificate.description || "N/A"}</p>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => openForm("certificates", certificate)}
                        className="text-orange-500 hover:text-orange-600 flex items-center gap-2 text-sm transition-all duration-200"
                        title="Edit certificate"
                      >
                        <FaEdit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(certificate.id, "certificates")}
                        className="text-red-500 hover:text-red-600 flex items-center gap-2 text-sm transition-all duration-200"
                        title="Delete certificate"
                        disabled={!certificate.id}
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
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 overflow-y-auto">
              <div className="bg-white w-full h-screen flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/2 p-6 overflow-y-auto">
                  <h2 className="text-2xl font-bold text-orange-600 mb-6">
                    {formData.id ? `Edit ${formData.collection.slice(0, -1)}` : `Add ${formData.collection.slice(0, -1)}`}
                  </h2>
                  <form onSubmit={submitForm} className="space-y-5">
                    {(formData.collection === "comments" || formData.collection === "projects" || formData.collection === "certificates") && (
                      <div>
                        <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">ID</label>
                        <input
                          type="text"
                          name="id"
                          id="id"
                          value={formData.id}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                          placeholder="Enter unique ID"
                        />
                      </div>
                    )}
                    {formData.collection === "comments" && (
                      <>
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter name"
                          />
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                          <textarea
                            name="message"
                            id="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter comment"
                          />
                        </div>
                      </>
                    )}
                    {formData.collection === "projects" && (
                      <>
                        <div>
                          <label htmlFor="Title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            name="Title"
                            id="Title"
                            value={formData.Title}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter project title"
                          />
                        </div>
                        <div>
                          <label htmlFor="Description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            name="Description"
                            id="Description"
                            rows={3}
                            value={formData.Description}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter project description"
                          />
                        </div>
                        <div>
                          <label htmlFor="Img" className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                          <input
                            type="text"
                            name="Img"
                            id="Img"
                            value={formData.Img}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter image URL"
                          />
                        </div>
                        <div>
                          <label htmlFor="Github" className="block text-sm font-medium text-gray-700 mb-2">Github URL</label>
                          <input
                            type="text"
                            name="Github"
                            id="Github"
                            value={formData.Github}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter Github URL"
                          />
                        </div>
                        <div>
                          <label htmlFor="Link" className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
                          <input
                            type="text"
                            name="Link"
                            id="Link"
                            value={formData.Link}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter project URL"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
                          {formData.TechStack.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange(e, "TechStack", index)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                placeholder={`Tech ${index + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => removeArrayItem("TechStack", index)}
                                className="text-red-500 hover:text-red-600 transition-all duration-200"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addArrayItem("TechStack")}
                            className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-all duration-200 mt-2"
                          >
                            + Add Tech
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                          {formData.Features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleArrayChange(e, "Features", index)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                placeholder={`Feature ${index + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => removeArrayItem("Features", index)}
                                className="text-red-500 hover:text-red-600 transition-all duration-200"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addArrayItem("Features")}
                            className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-all duration-200 mt-2"
                          >
                            + Add Feature
                          </button>
                        </div>
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <input
                            type="text"
                            name="category"
                            id="category"
                            value={formData.category}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter category"
                          />
                        </div>
                      </>
                    )}
                    {formData.collection === "certificates" && (
                      <>
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter certificate title"
                          />
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            name="description"
                            id="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter certificate description"
                          />
                        </div>
                        <div>
                          <label htmlFor="Img" className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                          <input
                            type="text"
                            name="Img"
                            id="Img"
                            value={formData.Img}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter image URL"
                          />
                        </div>
                        <div>
                          <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 mb-2">Issuer</label>
                          <input
                            type="text"
                            name="issuer"
                            id="issuer"
                            value={formData.issuer}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter issuer"
                          />
                        </div>
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                          <input
                            type="text"
                            name="date"
                            id="date"
                            value={formData.date}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter date (e.g., YYYY-MM-DD)"
                          />
                        </div>
                        <div>
                          <label htmlFor="Link" className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
                          <input
                            type="text"
                            name="Link"
                            id="Link"
                            value={formData.Link}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Enter certificate URL"
                          />
                        </div>
                      </>
                    )}
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        type="button"
                        onClick={closeForm}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm"
                        disabled={formLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md flex items-center gap-2"
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
                          "Save"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
                {(formData.collection === "projects" || formData.collection === "certificates") && (
                  <div className="w-full md:w-1/2 bg-gray-50 p-6 flex items-center justify-center">
                    {imagePreview ? (
                      <div className="w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Image Preview</h3>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                          onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found")}
                        />
                        <p className="text-sm text-gray-500 mt-2 text-center">Preview of the provided image URL</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <p>No image URL provided</p>
                        <p className="text-sm mt-2">Enter an image URL to see a preview</p>
                      </div>
                    )}
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