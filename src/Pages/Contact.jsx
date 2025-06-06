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
    "#FFF7ED", // Light Orange
    "#EDF7FF", // Light Blue
    "#EDFFF7", // Light Green
    "#FFF7F7", // Light Red
    "#F7EDFF", // Light Purple
    "#FFFFED", // Light Yellow
  ];

  useEffect(() => {
    AOS.init({
      once: true, // Animasi hanya sekali untuk performa lebih baik di mobile
      duration: 800, // Durasi lebih pendek untuk respons lebih cepat
      easing: "ease-out",
      mirror: false, // Nonaktifkan mirror untuk efisiensi
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
    { icon: <AiFillGithub size={24} />, name: "GitHub", href: "https://github.com/Nugraa21" },
    { icon: <AiFillInstagram size={24} />, name: "Instagram", href: "https://www.instagram.com/nugraa_21/" },
    { icon: <AiFillLinkedin size={24} />, name: "LinkedIn", href: "https://www.linkedin.com/in/ludang-prasetyo-4773b6361/" },
    { icon: <AiFillYoutube size={24} />, name: "YouTube", href: "https://youtube.com/@nugra21" },
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

      <footer
        id="contact"
        className="bg-gradient-to-b from-orange-50 to-white mt-12 sm:mt-16 px-4 sm:px-6 md:px-8 py-10 sm:py-12 rounded-t-[1.5rem] shadow-xl"
      >
        <style jsx>{`
          @keyframes slideIn {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 rgba(251, 146, 60, 0.3); }
            50% { box-shadow: 0 0 15px rgba(251, 146, 60, 0.4); }
            100% { box-shadow: 0 0 0 rgba(251, 146, 60, 0.3); }
          }
          .animate-slide-in {
            animation: slideIn 0.6s ease-out forwards;
          }
          .animate-pulse-glow {
            animation: pulseGlow 2s ease-in-out infinite;
          }
          .custom-scroll::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: rgba(251, 146, 60, 0.1);
            border-radius: 8px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #F97316;
            border-radius: 8px;
          }
          .input-container {
            position: relative;
            width: 100%;
          }
          .input-field {
            width: 100%;
            padding: 0.75rem 1rem;
            padding-top: 1.5rem;
            border: 1.5px solid #F3E8D6;
            border-radius: 0.5rem;
            background: rgba(255, 255, 255, 0.95);
            color: #1F2937;
            font-size: 0.9rem;
            transition: all 0.2s ease;
          }
          .input-field:focus {
            border-color: #F97316;
            box-shadow: 0 0 0 2px rgba(251, 146, 60, 0.2);
            outline: none;
          }
          .input-label {
            position: absolute;
            left: 1rem;
            top: 1rem;
            color: #F97316;
            font-size: 0.9rem;
            transition: all 0.2s ease;
            pointer-events: none;
          }
          .input-field:focus ~ .input-label,
          .input-field:not(:placeholder-shown) ~ .input-label {
            top: 0.4rem;
            font-size: 0.7rem;
            color: #F97316;
          }
          .error-text {
            color: #EF4444;
            font-size: 0.7rem;
            margin-top: 0.2rem;
            margin-left: 1rem;
          }
          .social-icon {
            transition: all 0.2s ease;
            position: relative;
          }
          .social-icon:hover {
            transform: translateY(-3px);
            color: #F97316;
          }
          .social-icon:hover .tooltip {
            opacity: 1;
            transform: translateY(0);
          }
          .tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translate(-50%, 6px);
            background: #F97316;
            color: white;
            padding: 0.2rem 0.4rem;
            border-radius: 0.2rem;
            font-size: 0.7rem;
            white-space: nowrap;
            opacity: 0;
            transition: all 0.2s ease;
            margin-bottom: 6px;
          }
          .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 3px solid transparent;
            border-top-color: #F97316;
          }
          .comment-card {
            transition: all 0.2s ease;
            max-width: 90%;
          }
          .comment-card:hover {
            transform: translateY(-1px);
          }
          .pinned-comment {
            border: 1.5px solid #F97316;
            background: #FFF7ED;
            border-radius: 0.75rem;
            padding: 0.4rem;
            margin-bottom: 0.75rem;
          }
          .emoji-avatar {
            font-size: 1.25rem;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            border: 1.5px solid #F3E8D6;
            background: #FFF7ED;
          }
          .emoji-select {
            border: 1.5px solid #F3E8D6;
            padding: 0.4rem;
            border-radius: 0.4rem;
            background: #FFF7ED;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
            font-size: 0.9rem;
          }
          .emoji-select:hover {
            background: #FFE4C4;
          }
          .pin-button {
            background: #F97316;
            color: white;
            padding: 0.2rem 0.4rem;
            border-radius: 0.2rem;
            font-size: 0.7rem;
            transition: all 0.2s ease;
            cursor: pointer;
          }
          .pin-button:hover {
            background: #E65A00;
          }
          .timestamp {
            font-size: 0.6rem;
            color: #6B7280;
            margin-top: 0.2rem;
          }
          @media (max-width: 1024px) {
            .grid {
              grid-template-columns: 1fr;
            }
            .comment-card {
              max-width: 95%;
            }
          }
          @media (max-width: 768px) {
            .input-field {
              padding: 0.6rem 0.8rem;
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
            .social-icon {
              padding: 0.4rem;
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
            .comment-card {
              max-width: 100%;
            }
          }
          @media (max-width: 480px) {
            .input-field {
              padding: 0.5rem 0.7rem;
              padding-top: 1rem;
              font-size: 0.8rem;
            }
            .input-label {
              font-size: 0.8rem;
              top: 0.8rem;
            }
            .input-field:focus ~ .input-label,
            .input-field:not(:placeholder-shown) ~ .input-label {
              top: 0.25rem;
              font-size: 0.6rem;
            }
            .social-icon {
              padding: 0.3rem;
            }
            .emoji-avatar {
              width: 1.5rem;
              height: 1.5rem;
              font-size: 0.9rem;
            }
            .pin-button {
              font-size: 0.6rem;
              padding: 0.1rem 0.3rem;
            }
            .timestamp {
              font-size: 0.5rem;
            }
            .comment-card {
              max-width: 100%;
            }
            h2, h3 {
              font-size: 1.5rem !important;
            }
            p, a, select, button {
              font-size: 0.8rem !important;
            }
          }
        `}</style>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* ABOUT SECTION */}
          <div data-aos="fade-up" data-aos-delay="100" className="flex flex-col space-y-5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-orange-600 tracking-tight">
              Hubungi Saya
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Halo! Saya <span className="font-bold text-orange-600">Ludang Prasetyo Nugroho</span>, mahasiswa Teknik Komputer di UTDI Yogyakarta. Saya bersemangat tentang pengembangan web, IoT, dan desain UI/UX. Ayo terhubung untuk proyek seru atau sekadar ngobrol!
            </p>
            <div className="space-y-3 text-gray-600 text-sm sm:text-base font-medium">
              <div className="flex items-center gap-2 animate-slide-in">
                <AiOutlineUser className="text-orange-600" size={18} />
                Ludang Prasetyo Nugroho
              </div>
              <div className="flex items-center gap-2 animate-slide-in">
                <AiOutlineMail className="text-orange-600" size={18} />
                <a href="mailto:ludang.prasetyo@students.utdi.ac.id" className="hover:text-orange-600 transition-colors">
                  ludang.prasetyo@students.utdi.ac.id
                </a>
              </div>
              <div className="flex items-center gap-2 animate-slide-in">
                <AiOutlineMessage className="text-orange-600" size={18} />
                Sleman, Yogyakarta
              </div>
            </div>
            <div className="pt-3">
              <h3 className="font-semibold text-orange-600 text-base sm:text-lg mb-3">Ikuti Saya</h3>
              <div className="flex gap-2 flex-wrap">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon bg-white border border-orange-200 rounded-full p-2 shadow-md text-gray-600 hover:bg-orange-50"
                    aria-label={link.name}
                  >
                    {link.icon}
                    <span className="tooltip">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-5 tracking-tight">
              Kirim Pesan
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
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
                <label className="input-label">Nama Lengkap</label>
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
                <label className="input-label">Pesan Anda</label>
                {formErrors.message && <span id="message-error" className="error-text">{formErrors.message}</span>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold text-sm sm:text-base tracking-wide shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300/50 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Mengirim...
                  </span>
                ) : (
                  "Kirim Pesan"
                )}
              </button>
            </form>
          </div>

          {/* COMMENT FORM */}
          <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col mt-8 lg:mt-0">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-5 tracking-tight">
              Tulis Komentar
            </h3>
            <form onSubmit={handleCommentSubmit} className="space-y-3">
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
                <label className="input-label">Nama Anda</label>
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
                <label className="input-label">Komentar Anda</label>
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
                <span className="text-xs text-gray-500 mt-1 ml-2">Pilih emoji untuk profil</span>
              </div>
              <button
                type="submit"
                disabled={isCommentSubmitting}
                className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold text-sm sm:text-base tracking-wide shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300/50 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
              >
                {isCommentSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Mengirim...
                  </span>
                ) : (
                  "Kirim Komentar"
                )}
              </button>
            </form>
          </div>

          {/* COMMENTS SECTION */}
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="flex flex-col max-h-[400px] mt-8 lg:mt-0 bg-white/30 backdrop-blur-lg rounded-lg shadow-lg ring-1 ring-orange-200 overflow-hidden"
          >
            <div className="sticky top-0 z-10 px-4 py-2 bg-orange-50/80 backdrop-blur-sm border-b border-orange-200 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-orange-600 tracking-tight">
                Komentar ({comments.length} orang)
              </h3>
            </div>
            <div className="flex flex-col overflow-y-auto px-4 py-3 space-y-3 custom-scroll">
              {pinnedComment && (
                <div className="pinned-comment">
                  <div className="flex justify-start comment-card">
                    <div className="flex items-start space-x-2 max-w-full">
                      <span className="emoji-avatar">{pinnedComment.profileEmoji || "😊"}</span>
                      <div className="px-3 py-2 rounded-xl shadow-md bg-white text-gray-800 border border-orange-200 rounded-bl-none">
                        <div className="flex items-center gap-1.5 mb-1">
                          <p className="text-xs font-semibold opacity-80">{pinnedComment.name || "Anonim"}</p>
                          <FaThumbtack className="text-orange-600" size={12} />
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {pinnedComment.message || "Tidak ada pesan"}
                        </p>
                        <p className="timestamp">
                          {pinnedComment.createdAt?.toDate().toLocaleString("id-ID", {
                            dateStyle: "short",
                            timeStyle: "short",
                          }) || "Waktu tidak tersedia"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {comments.length === 0 && !pinnedComment ? (
                <p className="text-gray-500 text-sm italic text-center">
                  Belum ada komentar. Jadilah yang pertama!
                </p>
              ) : (
                regularComments.map(({ id, name, message, profileEmoji, isUser }, index) => (
                  <div key={id} className={`flex ${isUser ? "justify-end" : "justify-start"} comment-card`}>
                    <div className="flex items-start space-x-2 max-w-full">
                      {!isUser && (
                        <span className="emoji-avatar">{profileEmoji || "😊"}</span>
                      )}
                      <div
                        className={`px-3 py-2 rounded-xl shadow-md ${
                          isUser
                            ? "bg-orange-500 text-white rounded-br-none"
                            : `text-gray-800 border border-orange-200 rounded-bl-none`
                        }`}
                        style={{ backgroundColor: isUser ? undefined : commentColors[index % commentColors.length] }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <p className="text-xs font-semibold opacity-80">
                            {name || (isUser ? "Saya" : "Anonim")}
                          </p>
                          {!isUser && (
                            <button
                              onClick={() => handlePinComment(id)}
                              className="pin-button"
                              aria-label="Pin Komentar"
                            >
                              Pin
                            </button>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message || "Tidak ada pesan"}
                        </p>
                        <p className="timestamp">
                          {comments.find((c) => c.id === id)?.createdAt?.toDate().toLocaleString("id-ID", {
                            dateStyle: "short",
                            timeStyle: "short",
                          }) || "Waktu tidak tersedia"}
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
      </footer>
    </>
  );
};

export default ContactFooter;