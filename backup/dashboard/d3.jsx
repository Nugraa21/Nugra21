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
import AOS from "aos";
import "aos/dist/aos.css";
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
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg text-orange-700">
          <h2 className="text-xl font-bold">Something went wrong!</h2>
          <p>{this.state.error?.message || "Please try again or check the browser console."}</p>
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
  const [activeTab, setActiveTab] = useState("projects"); // Default to projects tab
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      easing: "ease-out-cubic",
    });

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
        // Fetch Contacts
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

        // Fetch Comments
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

        // Fetch Projects
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

        // Fetch Certificates
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
    }
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormData(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    // Basic validation
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
      // Use setDoc to create or update the document with the specified ID
      await setDoc(doc(db, collection, id), {
        ...data,
        updatedAt: serverTimestamp(),
        createdAt: data.createdAt || serverTimestamp(), // Preserve createdAt if exists
      });

      // Update local state
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
      <div className="min-h-screen bg-white font-sans">
        {isMobile && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center">
              <FaExclamationTriangle className="text-orange-500 text-5xl mb-6 mx-auto" />
              <h2 className="text-2xl font-extrabold text-orange-600 mb-4">Device Not Supported</h2>
              <p className="text-gray-600">This dashboard is optimized for desktop devices to provide the best experience.</p>
            </div>
          </div>
        )}

        <header className="bg-white shadow-lg sticky top-0 z-40" data-aos="fade-down">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-extrabold text-orange-600">Dashboard</h2>
              <button
                onClick={() => setNavbarOpen(!navbarOpen)}
                className="text-orange-600 hover:text-orange-700 md:hidden transition-transform duration-300"
              >
                {navbarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
            <nav className={`${navbarOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-4 absolute md:static top-16 left-0 right-0 bg-white md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none transition-all duration-500 ease-in-out`}>
              <button
                onClick={() => { setActiveTab("contacts"); setSearchTerm(""); setNavbarOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === "contacts" ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-orange-100"} transition-transform hover:scale-105 duration-200`}
              >
                <FaTable size={16} /> Contacts
              </button>
              <button
                onClick={() => { setActiveTab("comments"); setSearchTerm(""); setNavbarOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === "comments" ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-orange-100"} transition-transform hover:scale-105 duration-200`}
              >
                <FaComments size={16} /> Comments
              </button>
              <button
                onClick={() => { setActiveTab("projects"); setSearchTerm(""); setNavbarOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === "projects" ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-orange-100"} transition-transform hover:scale-105 duration-200`}
              >
                <FaProjectDiagram size={16} /> Projects
              </button>
              <button
                onClick={() => { setActiveTab("certificates"); setSearchTerm(""); setNavbarOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === "certificates" ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-orange-100"} transition-transform hover:scale-105 duration-200`}
              >
                <FaCertificate size={16} /> Certificates
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-transform hover:scale-105 duration-200"
              >
                <FaSignOutAlt size={16} /> Sign Out
              </button>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {error && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-8 text-orange-700" data-aos="fade-up">
              <strong>Error:</strong> {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6" data-aos="fade-up">
            <h1 className="text-3xl font-extrabold text-orange-600">
              {activeTab === "contacts" ? "📋 Incoming Contacts" :
               activeTab === "comments" ? "💬 Comments" :
               activeTab === "projects" ? "🚀 Projects" : "🏆 Certificates"}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder={`🔍 Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 w-full sm:w-64"
              />
              {(activeTab === "comments" || activeTab === "projects" || activeTab === "certificates") && (
                <button
                  onClick={() => openForm(activeTab)}
                  className="flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-transform hover:scale-105 duration-200"
                >
                  <FaPlus size={16} /> Add {activeTab.slice(0, -1)}
                </button>
              )}
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-transform hover:scale-105 duration-200"
              >
                <FaFileExport size={16} /> Export Data
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-600 text-lg font-medium" data-aos="fade-up">Loading data...</p>
          ) : activeTab === "contacts" ? (
            filteredContacts.length === 0 ? (
              <p className="text-center text-gray-600 text-lg font-medium" data-aos="fade-up">📭 No matching contacts found.</p>
            ) : (
              <>
                <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-orange-500 text-white">
                        <th className="p-4 text-left font-semibold text-sm">Name</th>
                        <th className="p-4 text-left font-semibold text-sm">Email</th>
                        <th className="p-4 text-left font-semibold text-sm">Message</th>
                        <th className="p-4 text-left font-semibold text-sm">Date</th>
                        <th className="p-4 text-left font-semibold text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact, index) => (
                        <tr
                          key={contact.id || index}
                          className={`${index % 2 === 0 ? "bg-white" : "bg-orange-50"} hover:bg-orange-100 transition duration-200`}
                        >
                          <td className="p-4 text-gray-900 text-sm">{contact.name || "N/A"}</td>
                          <td className="p-4 text-gray-900 text-sm">{contact.email || "N/A"}</td>
                          <td className="p-4 text-gray-900 text-sm">{contact.message || "N/A"}</td>
                          <td className="p-4 text-gray-900 text-sm">{contact.createdAt?.toDate().toLocaleString() || "-"}</td>
                          <td className="p-4">
                            <button
                              onClick={() => handleDelete(contact.id, "contacts")}
                              className="text-red-500 hover:text-red-600 transition-transform hover:scale-110 duration-200"
                              title="Delete contact"
                              disabled={!contact.id}
                            >
                              <FaTrash size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-6" data-aos="fade-up">
                  {filteredContacts.map((contact, index) => (
                    <div key={contact.id || index} className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-orange-600">{contact.name || "N/A"}</h3>
                      <p className="text-gray-600 text-sm mt-2"><strong>Email:</strong> {contact.email || "N/A"}</p>
                      <p className="text-gray-600 text-sm mt-1"><strong>Message:</strong> {contact.message || "N/A"}</p>
                      <p className="text-gray-600 text-sm mt-1"><strong>Date:</strong> {contact.createdAt?.toDate().toLocaleString() || "-"}</p>
                      <button
                        onClick={() => handleDelete(contact.id, "contacts")}
                        className="mt-4 text-red-500 hover:text-red-600 transition-transform hover:scale-105 duration-200 flex items-center gap-2 text-sm"
                        title="Delete contact"
                        disabled={!contact.id}
                      >
                        <FaTrash size={14} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : activeTab === "comments" ? (
            filteredComments.length === 0 ? (
              <p className="text-center text-gray-600 text-lg font-medium" data-aos="fade-up">💬 No comments yet.</p>
            ) : (
              <>
                <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-orange-500 text-white">
                        <th className="p-4 text-left font-semibold text-sm">Name</th>
                        <th className="p-4 text-left font-semibold text-sm">Comment</th>
                        <th className="p-4 text-left font-semibold text-sm">Date</th>
                        <th className="p-4 text-left font-semibold text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComments.map((comment, index) => (
                        <tr
                          key={comment.id || index}
                          className={`${index % 2 === 0 ? "bg-white" : "bg-orange-50"} hover:bg-orange-100 transition duration-200`}
                        >
                          <td className="p-4 text-gray-900 text-sm">{comment.name || "N/A"}</td>
                          <td className="p-4 text-gray-900 text-sm">{comment.message || "N/A"}</td>
                          <td className="p-4 text-gray-900 text-sm">{comment.createdAt?.toDate().toLocaleString() || "-"}</td>
                          <td className="p-4 flex gap-3">
                            <button
                              onClick={() => openForm("comments", comment)}
                              className="text-orange-500 hover:text-orange-600 transition-transform hover:scale-110 duration-200"
                              title="Edit comment"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id, "comments")}
                              className="text-red-500 hover:text-red-600 transition-transform hover:scale-110 duration-200"
                              title="Delete comment"
                              disabled={!comment.id}
                            >
                              <FaTrash size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-6" data-aos="fade-up">
                  {filteredComments.map((comment, index) => (
                    <div key={comment.id || index} className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-orange-600">{comment.name || "N/A"}</h3>
                      <p className="text-gray-600 text-sm mt-2"><strong>Comment:</strong> {comment.message || "N/A"}</p>
                      <p className="text-gray-600 text-sm mt-1"><strong>Date:</strong> {comment.createdAt?.toDate().toLocaleString() || "-"}</p>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => openForm("comments", comment)}
                          className="text-orange-500 hover:text-orange-600 transition-transform hover:scale-105 duration-200 flex items-center gap-2 text-sm"
                          title="Edit comment"
                        >
                          <FaEdit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id, "comments")}
                          className="text-red-500 hover:text-red-600 transition-transform hover:scale-105 duration-200 flex items-center gap-2 text-sm"
                          title="Delete comment"
                          disabled={!comment.id}
                        >
                          <FaTrash size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : activeTab === "projects" ? (
            filteredProjects.length === 0 ? (
              <p className="text-center text-gray-600 text-lg font-medium" data-aos="fade-up">🚀 No projects found.</p>
            ) : (
              <>
                <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-orange-500 text-white">
                        <th className="p-4 text-left font-semibold text-sm">Title</th>
                        <th className="p-4 text-left font-semibold text-sm">Category</th>
                        <th className="p-4 text-left font-semibold text-sm">Description</th>
                        <th className="p-4 text-left font-semibold text-sm">Tech Stack</th>
                        <th className="p-4 text-left font-semibold text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project, index) => (
                        <tr
                          key={project.id || index}
                          className={`${index % 2 === 0 ? "bg-white" : "bg-orange-50"} hover:bg-orange-100 transition duration-200`}
                        >
                          <td className="p-4 text-gray-900 text-sm">{project.Title || "N/A"}</td>
                          <td className="p-4 text-gray-900 text-sm">{project.category || "N/A"}</td>
                          <td className="p-4 text-gray-900 text-sm truncate max-w-xs">{project.Description || "N/A"}</td>
                          <td className="p-4 text-gray-900 text-sm">{project.TechStack?.join(", ") || "N/A"}</td>
                          <td className="p-4 flex gap-3">
                            <button
                              onClick={() => openForm("projects", project)}
                              className="text-orange-500 hover:text-orange-600 transition-transform hover:scale-110 duration-200"
                              title="Edit project"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id, "projects")}
                              className="text-red-500 hover:text-red-600 transition-transform hover:scale-110 duration-200"
                              title="Delete project"
                              disabled={!project.id}
                            >
                              <FaTrash size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-6" data-aos="fade-up">
                  {filteredProjects.map((project, index) => (
                    <div key={project.id || index} className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-orange-600">{project.Title || "N/A"}</h3>
                      <p className="text-gray-600 text-sm mt-2"><strong>Category:</strong> {project.category || "N/A"}</p>
                      <p className="text-gray-600 text-sm mt-1"><strong>Description:</strong> {project.Description || "N/A"}</p>
                      <p className="text-gray-600 text-sm mt-1"><strong>Tech Stack:</strong> {project.TechStack?.join(", ") || "N/A"}</p>
                      <p className="text-gray-600 text-sm mt-1"><strong>Features:</strong> {project.Features?.join(", ") || "N/A"}</p>
                      <p className="text-gray-600 text-sm mt-1"><strong>Github:</strong> {project.Github || "N/A"}</p>
                      <p className="text-gray-600 text-sm mt-1"><strong>Link:</strong> {project.Link || "N/A"}</p>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => openForm("projects", project)}
                          className="text-orange-500 hover:text-orange-600 transition-transform hover:scale-105 duration-200 flex items-center gap-2 text-sm"
                          title="Edit project"
                        >
                          <FaEdit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, "projects")}
                          className="text-red-500 hover:text-red-600 transition-transform hover:scale-105 duration-200 flex items-center gap-2 text-sm"
                          title="Delete project"
                          disabled={!project.id}
                        >
                          <FaTrash size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : (
            filteredCertificates.length === 0 ? (
              <p className="text-center text-gray-600 text-lg font-medium" data-aos="fade-up">🏆 No certificates found.</p>
            ) : (
              <>
                <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-orange-500 text-white">
                        <th className="p-4 text-left font-semibold text-sm">Title</th>
                        <th className="p-4 text-left font-semibold text-sm">Issuer</th>
                        <th className="p-4 text-left font-semibold text-sm">Date</th>
                        <th className="p-4 text-left font-semibold text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCertificates.map((certificate, index) => (
                        <tr
                          key={certificate.id || index}
                          className={`${index % 2 === 0 ? "bg-white" : "bg-orange-50"} hover:bg-orange-100 transition duration-200`}
                        >
                          <td className="p-4 text-gray-900 text-sm">{certificate.title || "N/A"}</td>
                          <td className="p-4 text-gray-900 text-sm">{certificate.issuer || "N/A"}</td>
                          <td className="p-4 text-gray-900 text-sm">{certificate.date || "N/A"}</td>
                          <td className="p-4 flex gap-3">
                            <button
                              onClick={() => openForm("certificates", certificate)}
                              className="text-orange-500 hover:text-orange-600 transition-transform hover:scale-110 duration-200"
                              title="Edit certificate"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(certificate.id, "certificates")}
                              className="text-red-500 hover:text-red-600 transition-transform hover:scale-110 duration-200"
                              title="Delete certificate"
                              disabled={!certificate.id}
                            >
                              <FaTrash size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-6" data-aos="fade-up">
                  {filteredCertificates.map((certificate, index) => (
                    <div key={certificate.id || index} className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-orange-600">{certificate.title || "N/A"}</h3>
                      <p className="text-gray-600 text-sm mt-2"><strong>Issuer:</strong> {certificate.issuer || "N/A"}</p>
                      <p className="text-gray-600 text-sm mt-1"><strong>Date:</strong> {certificate.date || "N/A"}</p>
                      <p className="text-gray-600 text-sm mt-1"><strong>Description:</strong> {certificate.description || "N/A"}</p>
                      <p className="text-gray-600 text-sm mt-1"><strong>Link:</strong> {certificate.Link || "N/A"}</p>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => openForm("certificates", certificate)}
                          className="text-orange-500 hover:text-orange-600 transition-transform hover:scale-105 duration-200 flex items-center gap-2 text-sm"
                          title="Edit certificate"
                        >
                          <FaEdit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(certificate.id, "certificates")}
                          className="text-red-500 hover:text-red-600 transition-transform hover:scale-105 duration-200 flex items-center gap-2 text-sm"
                          title="Delete certificate"
                          disabled={!certificate.id}
                        >
                          <FaTrash size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          )}

          {formOpen && formData && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full" data-aos="zoom-in">
                <h2 className="text-2xl font-extrabold text-orange-600 mb-6">
                  {formData.id ? `Edit ${formData.collection.slice(0, -1)}` : `Add ${formData.collection.slice(0, -1)}`}
                </h2>
                <form onSubmit={submitForm}>
                  {(formData.collection === "comments" || formData.collection === "projects" || formData.collection === "certificates") && (
                    <div className="mb-5">
                      <label htmlFor="id" className="block text-orange-600 font-semibold mb-2 text-sm">ID:</label>
                      <input
                        type="text"
                        name="id"
                        id="id"
                        value={formData.id}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  )}
                  {formData.collection === "comments" && (
                    <>
                      <div className="mb-5">
                        <label htmlFor="name" className="block text-orange-600 font-semibold mb-2 text-sm">Name:</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="message" className="block text-orange-600 font-semibold mb-2 text-sm">Comment:</label>
                        <textarea
                          name="message"
                          id="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                    </>
                  )}
                  {formData.collection === "projects" && (
                    <>
                      <div className="mb-5">
                        <label htmlFor="Title" className="block text-orange-600 font-semibold mb-2 text-sm">Title:</label>
                        <input
                          type="text"
                          name="Title"
                          id="Title"
                          value={formData.Title}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="Description" className="block text-orange-600 font-semibold mb-2 text-sm">Description:</label>
                        <textarea
                          name="Description"
                          id="Description"
                          rows={4}
                          value={formData.Description}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="Img" className="block text-orange-600 font-semibold mb-2 text-sm">Image URL:</label>
                        <input
                          type="text"
                          name="Img"
                          id="Img"
                          value={formData.Img}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="Github" className="block text-orange-600 font-semibold mb-2 text-sm">Github URL:</label>
                        <input
                          type="text"
                          name="Github"
                          id="Github"
                          value={formData.Github}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="Link" className="block text-orange-600 font-semibold mb-2 text-sm">Link URL:</label>
                        <input
                          type="text"
                          name="Link"
                          id="Link"
                          value={formData.Link}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                      <div className="mb-5">
                        <label className="block text-orange-600 font-semibold mb-2 text-sm">Tech Stack:</label>
                        {formData.TechStack.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleArrayChange(e, "TechStack", index)}
                              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem("TechStack", index)}
                              className="text-red-500 hover:text-red-600 transition duration-200"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem("TechStack")}
                          className="text-orange-600 text-sm font-semibold hover:underline"
                        >
                          + Add Tech
                        </button>
                      </div>
                      <div className="mb-5">
                        <label className="block text-orange-600 font-semibold mb-2 text-sm">Features:</label>
                        {formData?.Features?.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => handleArrayChange(e, "Features", index)}
                              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem("Features", index)}
                              className="text-right-500 hover:text-red-600 transition duration-200"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem("Features")}
                          className="text-orange-600 text-sm font-semibold hover duration-200 transition duration-200"
                        >
                          + Add Feature
                        </button>
                      </div>
                      <div className="mb-5">
                        <label htmlFor="category" className="block text-orange-600 font-semibold mb-2 text-sm">Category:</label>
                        <input
                          type="text"
                          name="category"
                          id="category"
                          value={formData.category}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                    </>
                  )}
                  {formData.collection === "certificates" && (
                    <>
                      <div className="mb-5">
                        <label htmlFor="title" className="block text-orange-600 font-semibold mb-2 text-sm">Title:</label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={formData.title}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="description" className="block text-orange-600 font-semibold mb-2 text-sm">Description:</label>
                        <textarea
                          name="description"
                          id="description"
                          rows={4}
                          value={formData.description}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="Img" className="block text-orange-600 font-semibold mb-2 text-sm">Image URL:</label>
                        <input
                          type="text"
                          name="Img"
                          id="Img"
                          value={formData.Img}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="issuer" className="block text-orange-600 font-semibold mb-2 text-sm">Issuer:</label>
                        <input
                          type="text"
                          name="issuer"
                          id="issuer"
                          value={formData.issuer}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="date" className="block text-orange-600 font-semibold mb-2 text-sm">Date:</label>
                        <input
                          type="text"
                          name="date"
                          id="date"
                          value={formData.date}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="Link" className="block text-orange-600 font-semibold mb-2 text-sm">Link URL:</label>
                        <input
                          type="text"
                          name="Link"
                          id="Link"
                          value={formData.Link}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-4 py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-transform hover:scale-105 duration-200 text-sm"
                      disabled={formLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-transform hover:scale-105 duration-200 text-sm"
                    >
                      {formLoading ? "Saving..." : "Save"}
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
// fxi 