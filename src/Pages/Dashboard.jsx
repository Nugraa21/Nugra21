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
  FaFileExport,
  FaExclamationTriangle,
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");
  const [commentFormOpen, setCommentFormOpen] = useState(false);
  const [commentFormData, setCommentFormData] = useState({ id: null, name: "", message: "" });
  const [commentLoading, setCommentLoading] = useState(false);
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
    const confirmDelete = window.confirm("Are you sure you want to delete this data?");
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
      console.error("Failed to delete data:", error);
      setError("Failed to delete data: " + error.message);
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
      alert("Name and Message are required.");
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
      console.error("Failed to save comment:", error);
      setError("Failed to save comment: " + error.message);
    }
    setCommentLoading(false);
  };

  const exportData = () => {
    const data = activeTab === "contacts" ? filteredContacts : filteredComments;
    const csv = [
      activeTab === "contacts"
        ? "Name,Email,Message,Date"
        : "Name,Message,Date",
      ...data.map((item) =>
        activeTab === "contacts"
          ? `"${item.name || "N/A"}","${item.email || "N/A"}","${item.message || "N/A"}","${item.createdAt?.toDate().toLocaleString() || "-"}"`
          : `"${item.name || "N/A"}","${item.message || "N/A"}","${item.createdAt?.toDate().toLocaleString() || "-"}"`
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
              <h2 className="text-2xl font-bold text-orange-600 mb-4">Device Not Supported</h2>
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
              {activeTab === "contacts" ? "📋 Incoming Contacts" : "💬 Comments"}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder={activeTab === "contacts" ? "🔍 Search contacts..." : "🔍 Search comments..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 w-full sm:w-64"
              />
              {activeTab === "comments" && (
                <button
                  onClick={() => openCommentForm()}
                  className="flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-transform hover:scale-105 duration-200"
                >
                  <FaPlus size={16} /> Add Comment
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
                              onClick={() => handleDelete(contact.id)}
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
                        onClick={() => handleDelete(contact.id)}
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
          ) : (
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
                              onClick={() => openCommentForm(comment)}
                              className="text-orange-500 hover:text-orange-600 transition-transform hover:scale-110 duration-200"
                              title="Edit comment"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id)}
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
                          onClick={() => openCommentForm(comment)}
                          className="text-orange-500 hover:text-orange-600 transition-transform hover:scale-105 duration-200 flex items-center gap-2 text-sm"
                          title="Edit comment"
                        >
                          <FaEdit size= {14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
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
          )}

          {commentFormOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full" data-aos="zoom-in">
                <h2 className="text-2xl font-extrabold text-orange-600 mb-6">
                  {commentFormData.id ? "Edit Comment" : "Add Comment"}
                </h2>
                <form onSubmit={submitCommentForm}>
                  <div className="mb-5">
                    <label htmlFor="name" className="block text-orange-600 font-semibold mb-2 text-sm">Name:</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={commentFormData.name}
                      onChange={handleCommentChange}
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
                      value={commentFormData.message}
                      onChange={handleCommentChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={closeCommentForm}
                      className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-transform hover:scale-105 duration-200 text-sm"
                      disabled={commentLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={commentLoading}
                      className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-transform hover:scale-105 duration-200 text-sm"
                    >
                      {commentLoading ? "Saving..." : "Save"}
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
// ================== FIX 