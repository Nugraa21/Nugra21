import React, { useState, useEffect } from "react";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineMessage,
  AiFillGithub,
  AiFillInstagram,
  AiFillLinkedin,
  AiFillYoutube,
} from "react-icons/ai";
import { FaThumbtack } from "react-icons/fa";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet";
import {
  db,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
} from "../firebase";

const ContactFooter = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [commentData, setCommentData] = useState({ name: "", message: "", profileEmoji: "😊" });
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Daftar emoji lengkap
  const emojiOptions = [
    { value: "😀", label: "😀 Grinning Face" },
    { value: "😊", label: "😊 Smiling Face" },
    { value: "😂", label: "😂 Laughing Face" },
    { value: "😍", label: "😍 Heart Eyes" },
    { value: "😎", label: "😎 Cool Face" },
    { value: "😢", label: "😢 Crying Face" },
    { value: "😡", label: "😡 Angry Face" },
    { value: "🥳", label: "🥳 Party Face" },
    { value: "🤓", label: "🤓 Nerd Face" },
    { value: "🤗", label: "🤗 Hugging Face" },
    { value: "🐱", label: "🐱 Cat" },
    { value: "🐶", label: "🐶 Dog" },
    { value: "🦁", label: "🦁 Lion" },
    { value: "🐘", label: "🐘 Elephant" },
    { value: "🐼", label: "🐼 Panda" },
    { value: "🐸", label: "🐸 Frog" },
    { value: "🐵", label: "🐵 Monkey" },
    { value: "🦄", label: "🦄 Unicorn" },
    { value: "🐝", label: "🐝 Bee" },
    { value: "🌟", label: "🌟 Star" },
    { value: "🚀", label: "🚀 Rocket" },
    { value: "🎉", label: "🎉 Party Popper" },
    { value: "💡", label: "💡 Light Bulb" },
    { value: "🌈", label: "🌈 Rainbow" },
    { value: "🍎", label: "🍎 Apple" },
    { value: "🍕", label: "🍕 Pizza" },
    { value: "☕", label: "☕ Coffee" },
    { value: "🎸", label: "🎸 Guitar" },
    { value: "⚽", label: "⚽ Soccer" },
    { value: "🏀", label: "🏀 Basketball" },
    { value: "🎮", label: "🎮 Game Controller" },
    { value: "📚", label: "📚 Books" },
    { value: "💻", label: "💻 Laptop" },
    { value: "🔥", label: "🔥 Fire" },
    { value: "🍀", label: "🍀 Four Leaf Clover" },
    { value: "🌍", label: "🌍 Globe" },
    { value: "🎥", label: "🎥 Camera" },
    { value: "✈️", label: "✈️ Airplane" },
    { value: "🕒", label: "🕒 Clock" },
    { value: "☀️", label: "☀️ Sun" },
    { value: "🌙", label: "🌙 Moon" },
  ];

  // Warna untuk kartu komentar
  const commentColors = [
    "#F9FAFB", // Soft Gray
    "#F3F4F6", // Light Gray
    "#E5E7EB", // Gray
    "#F1F5F9", // Slate
    "#E2E8F0", // Cool Gray
    "#F5F5F5", // Neutral Gray
  ];

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 600,
      easing: "ease-out",
      mirror: false,
    });

    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const commentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentList);
      },
      (error) => {
        console.error("Error fetching comments:", error.message);
        Swal.fire({
          title: "Gagal!",
          text: "Gagal memuat komentar: " + error.message,
          icon: "error",
          confirmButtonColor: "#f97316",
        });
      }
    );

    return () => unsubscribe();
  }, []);

  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = "Nama diperlukan";
    if (!data.email.trim()) errors.email = "Email diperlukan";
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Email tidak valid";
    if (!data.message.trim()) errors.message = "Pesan diperlukan";
    return errors;
  };

  const validateComment = (data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = "Nama diperlukan";
    if (!data.message.trim()) errors.message = "Komentar diperlukan";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setCommentData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    Swal.fire({
      title: "Mengirim Pesan...",
      html: "Harap tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Pesan kamu sudah terkirim!",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 2000,
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact:", error.message);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal mengirim pesan: " + error.message,
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const errors = validateComment(commentData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsCommentSubmitting(true);
    Swal.fire({
      title: "Mengirim Komentar...",
      html: "Harap tunggu, sedang mengunggah data...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await addDoc(collection(db, "comments"), {
        name: commentData.name,
        message: commentData.message,
        profileEmoji: commentData.profileEmoji,
        isPinned: false,
        createdAt: serverTimestamp(),
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Komentar kamu sudah terkirim!",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 2000,
      });

      setCommentData({ name: "", message: "", profileEmoji: "😊" });
    } catch (error) {
      console.error("Error submitting comment:", error.message);
      Swal.fire({
        title: "Gagal!",
        text: `Gagal mengirim komentar: ${error.message}`,
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handlePinComment = async (commentId) => {
    try {
      const pinnedComment = comments.find((comment) => comment.isPinned);
      if (pinnedComment) {
        await updateDoc(doc(db, "comments", pinnedComment.id), {
          isPinned: false,
        });
      }

      await updateDoc(doc(db, "comments", commentId), {
        isPinned: true,
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Komentar telah dipin!",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 1500,
      });
    } catch (error) {
      console.error("Error pinning comment:", error.message);
      Swal.fire({
        title: "Gagal!",
        text: `Gagal memin komentar: ${error.message}`,
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    }
  };

  const socialLinks = [
    { icon: <AiFillGithub size={30} />, name: "GitHub", href: "https://github.com/Nugraa21" },
    { icon: <AiFillInstagram size={30} />, name: "Instagram", href: "https://www.instagram.com/nugraa_21/" },
    { icon: <AiFillLinkedin size={30} />, name: "LinkedIn", href: "https://www.linkedin.com/in/ludang-prasetyo-4773b6361/" },
    { icon: <AiFillYoutube size={30} />, name: "YouTube", href: "https://youtube.com/@nugra21" },
  ];

  const pinnedComment = comments.find((comment) => comment.isPinned);
  const regularComments = comments.filter((comment) => !comment.isPinned);

  return (
    <>
      <Helmet>
        <title>Contact - Nugra.my.id</title>
        <meta name="description" content="Hubungi Ludang Prasetyo untuk kolaborasi atau pertanyaan." />
        <meta name="keywords" content="Ludang Prasetyo, Nugra21, Contact, Portfolio, Web Developer" />
        <meta property="og:title" content="Contact - Nugra.my.id" />
        <meta property="og:description" content="Hubungi Ludang Prasetyo untuk kolaborasi atau pertanyaan." />
        <meta property="og:url" content="https://nugra.my.id/contact" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nugra.my.id/contact" />
      </Helmet>

      <section
        id="contact"
        className=" px-4 sm:px-6 md:px-8 pt-16 pb-20"
      >
        <style jsx>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: #f3f4f6;
            border-radius: 8px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #f97316;
            border-radius: 8px;
          }
          .input-container {
            position: relative;
            width: 100%;
          }
          .input-field {
            width: 100%;
            padding: 0.75rem 1rem;
            padding-top: 1.75rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            background: #ffffff;
            color: #1f2937;
            font-size: 0.95rem;
            transition: border-color 0.2s ease;
          }
          .input-field:focus {
            border-color: #f97316;
            outline: none;
          }
          .input-label {
            position: absolute;
            left: 1rem;
            top: 1.25rem;
            color: #6b7280;
            font-size: 0.95rem;
            transition: all 0.2s ease;
            pointer-events: none;
          }
          .input-field:focus ~ .input-label,
          .input-field:not(:placeholder-shown) ~ .input-label {
            top: 0.5rem;
            font-size: 0.75rem;
            color: #f97316;
          }
          .error-text {
            color: #ef4444;
            font-size: 0.75rem;
            margin-top: 0.25rem;
            margin-left: 1rem;
          }
          .social-icon {
            transition: all 0.2s ease;
          }
          .social-icon:hover {
            background: #fff7ed;
            color: #f97316;
          }
          .emoji-avatar {
            font-size: 1.5rem;
            width: 2.5rem;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 1px solid #e5e7eb;
            background: #f9fafb;
          }
          .emoji-select {
            border: 1px solid #e5e7eb;
            padding: 0.5rem;
            border-radius: 0.5rem;
            background: #ffffff;
            cursor: pointer;
            transition: border-color 0.2s ease;
            width: 100%;
            font-size: 0.95rem;
            color: #1f2937;
          }
          .emoji-select:focus {
            border-color: #f97316;
            outline: none;
          }
          .pin-button {
            background: #f97316;
            color: #ffffff;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            transition: background-color 0.2s ease;
            cursor: pointer;
          }
          .pin-button:hover {
            background: #ea580c;
          }
          .timestamp {
            font-size: 0.65rem;
            color: #6b7280;
            margin-top: 0.25rem;
          }
          @media (max-width: 1024px) {
            .grid {
              grid-template-columns: 1fr;
            }
          }
          @media (max-width: 768px) {
            .input-field {
              padding: 0.65rem 0.85rem;
              padding-top: 1.5rem;
              font-size: 0.9rem;
            }
            .input-label {
              font-size: 0.9rem;
              top: 1rem;
            }
            .input-field:focus ~ .input-label,
            .input-field:not(:placeholder-shown) ~ .input-label {
              top: 0.4rem;
              font-size: 0.7rem;
            }
            .emoji-avatar {
              width: 2rem;
              height: 2rem;
              font-size: 1.25rem;
            }
            .pin-button {
              font-size: 0.7rem;
              padding: 0.2rem 0.4rem;
            }
            .timestamp {
              font-size: 0.6rem;
            }
          }
          @media (max-width: 480px) {
            .input-field {
              padding: 0.55rem 0.75rem;
              padding-top: 1.25rem;
              font-size: 0.85rem;
            }
            .input-label {
              font-size: 0.85rem;
              top: 0.9rem;
            }
            .input-field:focus ~ .input-label,
            .input-field:not(:placeholder-shown) ~ .input-label {
              top: 0.3rem;
              font-size: 0.65rem;
            }
            .emoji-avatar {
              width: 1.75rem;
              height: 1.75rem;
              font-size: 1rem;
            }
            .pin-button {
              font-size: 0.65rem;
              padding: 0.15rem 0.35rem;
            }
            .timestamp {
              font-size: 0.55rem;
            }
            h2, h3 {
              font-size: 1.75rem !important;
            }
            p, a, select, button {
              font-size: 0.9rem !important;
            }
          }
        `}</style>

        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-orange-600 tracking-tight animate-fade-in-up">
              Get in Touch
            </h2>
            <p className="mt-4 text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
              I’m open to collaborations, ideas, or just a friendly chat. Reach out via the form or leave a comment below.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About Section */}
            <div data-aos="fade-up" data-aos-delay="100" className="flex flex-col space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-4">About Me</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  I’m <span className="font-semibold text-orange-600">Ludang Prasetyo Nugroho</span>, a Computer Engineering student at UTDI Yogyakarta. I specialize in web development, IoT, and UI/UX design, creating intuitive and impactful solutions. Let’s connect to bring your ideas to life!
                </p>
                <div className="mt-4 space-y-3 text-gray-600 text-sm sm:text-base font-medium">
                  <div className="flex items-center gap-3">
                    <AiOutlineUser className="text-orange-600" size={20} />
                    Ludang Prasetyo Nugroho
                  </div>
                  <div className="flex items-center gap-3">
                    <AiOutlineMail className="text-orange-600" size={20} />
                    <a href="mailto:ludang.prasetyo@students.utdi.ac.id" className="hover:text-orange-600 transition-colors">
                      ludang.prasetyo@students.utdi.ac.id
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <AiOutlineMessage className="text-orange-600" size={20} />
                    Sleman, Yogyakarta
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg sm:text-xl font-semibold text-orange-600 mb-4">Follow Me</h3>
                <div className="flex gap-4 flex-wrap">
                  {socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon border border-gray-300 rounded-full p-3 text-gray-600"
                      aria-label={link.name}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-4">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="input-container">
                    <input
                      type="text"
                      name="name"
                      placeholder=" "
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="input-field"
                      required
                      aria-describedby="name-error"
                    />
                    <label className="input-label">Full Name</label>
                    {formErrors.name && <span id="name-error" className="error-text">{formErrors.name}</span>}
                  </div>
                  <div className="input-container">
                    <input
                      type="email"
                      name="email"
                      placeholder=" "
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="input-field"
                      required
                      aria-describedby="email-error"
                    />
                    <label className="input-label">Email</label>
                    {formErrors.email && <span id="email-error" className="error-text">{formErrors.email}</span>}
                  </div>
                  <div className="input-container">
                    <textarea
                      name="message"
                      placeholder=" "
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="input-field h-28"
                      rows="4"
                      required
                      aria-describedby="message-error"
                    />
                    <label className="input-label">Your Message</label>
                    {formErrors.message && <span id="message-error" className="error-text">{formErrors.message}</span>}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold text-sm tracking-wide shadow-sm hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Comment Form */}
            <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col lg:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-4">Leave a Comment</h3>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="input-container">
                    <input
                      type="text"
                      name="name"
                      placeholder=" "
                      value={commentData.name}
                      onChange={handleCommentChange}
                      disabled={isCommentSubmitting}
                      className="input-field"
                      required
                      aria-describedby="comment-name-error"
                    />
                    <label className="input-label">Your Name</label>
                    {formErrors.name && <span id="comment-name-error" className="error-text">{formErrors.name}</span>}
                  </div>
                  <div className="input-container">
                    <textarea
                      name="message"
                      placeholder=" "
                      value={commentData.message}
                      onChange={handleCommentChange}
                      disabled={isCommentSubmitting}
                      className="input-field h-24"
                      rows="3"
                      required
                      aria-describedby="comment-message-error"
                    />
                    <label className="input-label">Your Comment</label>
                    {formErrors.message && <span id="comment-message-error" className="error-text">{formErrors.message}</span>}
                  </div>
                  <div className="input-container">
                    <select
                      name="profileEmoji"
                      value={commentData.profileEmoji}
                      onChange={handleCommentChange}
                      disabled={isCommentSubmitting}
                      className="emoji-select"
                      aria-describedby="profile-emoji-error"
                    >
                      {emojiOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-500 mt-1 ml-2">Choose an emoji for your profile</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isCommentSubmitting}
                    className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold text-sm tracking-wide shadow-sm hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCommentSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Post Comment"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Comments Section */}
            <div data-aos="fade-up" data-aos-delay="400" className="lg:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="sticky top-0 z-10 px-4 py-3 bg-white border-b border-gray-200">
                  <h3 className="text-lg sm:text-xl font-semibold text-orange-600">
                    Comments ({comments.length})
                  </h3>
                </div>
                <div className="flex flex-col px-4 py-5 space-y-4 max-h-[500px] overflow-y-auto custom-scroll">
                  {pinnedComment && (
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <div className="flex justify-start">
                        <div className="flex items-start gap-3 max-w-full">
                          <span className="emoji-avatar">{pinnedComment.profileEmoji || "😊"}</span>
                          <div className="px-3 py-2 rounded-lg bg-white border border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-gray-600">{pinnedComment.name || "Anonymous"}</p>
                              <FaThumbtack className="text-orange-600" size={14} />
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                              {pinnedComment.message || "No message"}
                            </p>
                            <p className="timestamp">
                              {pinnedComment.createdAt?.toDate().toLocaleString("id-ID", {
                                dateStyle: "short",
                                timeStyle: "short",
                              }) || "Time unavailable"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {comments.length === 0 && !pinnedComment ? (
                    <p className="text-gray-500 text-sm italic text-center">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  ) : (
                    regularComments.map(({ id, name, message, profileEmoji, isUser }, index) => (
                      <div
                        key={id}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div className="flex items-start gap-3 max-w-full">
                          {!isUser && (
                            <span className="emoji-avatar">{profileEmoji || "😊"}</span>
                          )}
                          <div
                            className={`px-3 py-2 rounded-lg ${
                              isUser
                                ? "bg-orange-100 text-orange-600 rounded-br-none"
                                : "bg-white border border-gray-100 rounded-bl-none"
                            }`}
                            style={{ backgroundColor: isUser ? undefined : commentColors[index % commentColors.length] }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-gray-600">
                                {name || (isUser ? "Me" : "Anonymous")}
                              </p>
                              {!isUser && (
                                <button
                                  onClick={() => handlePinComment(id)}
                                  className="pin-button"
                                  aria-label="Pin Comment"
                                >
                                  Pin
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                              {message || "No message"}
                            </p>
                            <p className="timestamp">
                              {comments.find((c) => c.id === id)?.createdAt?.toDate().toLocaleString("id-ID", {
                                dateStyle: "short",
                                timeStyle: "short",
                              }) || "Time unavailable"}
                            </p>
                          </div>
                          {isUser && (
                            <span className="emoji-avatar">{profileEmoji || "😊"}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <p className="text-sm sm:text-base">
            © {new Date().getFullYear()} Ludang Prasetyo Nugroho. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon border border-gray-300 rounded-full p-3 text-gray-300"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </footer> */}
    </>
  );
};

export default ContactFooter;