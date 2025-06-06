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
} from "../firebase";

const ContactFooter = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [commentData, setCommentData] = useState({ name: "", message: "" });
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    AOS.init({
      once: false,
      duration: 1000,
      easing: "ease-out-cubic",
      mirror: true,
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
        console.error("Error fetching comments:", error);
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
      console.error("Error submitting contact:", error);
      Swal.fire({
        title: "Gagal!",
        text: error.message,
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
    try {
      await addDoc(collection(db, "comments"), {
        ...commentData,
        createdAt: serverTimestamp(),
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Komentar kamu sudah terkirim!",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 2000,
      });

      setCommentData({ name: "", message: "" });
    } catch (error) {
      console.error("Error submitting comment:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal mengirim komentar: " + error.message,
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: <AiFillGithub size={24} />, name: "GitHub", href: "https://github.com/Nugraa21" },
    { icon: <AiFillInstagram size={24} />, name: "Instagram", href: "https://www.instagram.com/nugraa_21/" },
    { icon: <AiFillLinkedin size={24} />, name: "LinkedIn", href: "https://www.linkedin.com/in/ludang-prasetyo-4773b6361/" },
    { icon: <AiFillYoutube size={24} />, name: "YouTube", href: "https://youtube.com/@nugra21" },
  ];

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
        className="bg-gradient-to-b from-orange-50 to-white mt-16 sm:mt-20 px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 rounded-t-[2rem] shadow-2xl"
      >
        <style jsx>{`
          @keyframes slideIn {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 rgba(251, 146, 60, 0.3); }
            50% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.5); }
            100% { box-shadow: 0 0 0 rgba(251, 146, 60, 0.3); }
          }
          .animate-slide-in {
            animation: slideIn 0.8s ease-out forwards;
          }
          .animate-pulse-glow {
            animation: pulseGlow 2s ease-in-out infinite;
          }
          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: rgba(251, 146, 60, 0.1);
            border-radius: 10px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #F97316;
            border-radius: 10px;
          }
          .input-container {
            position: relative;
            width: 100%;
          }
          .input-field {
            width: 100%;
            padding: 1rem 1.25rem;
            padding-top: 1.75rem;
            border: 2px solid #F3E8D6;
            border-radius: 0.75rem;
            background: rgba(255, 255, 255, 0.95);
            color: #1F2937;
            font-size: 0.95rem;
            transition: all 0.3s ease;
          }
          .input-field:focus {
            border-color: #F97316;
            box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.2);
            outline: none;
          }
          .input-label {
            position: absolute;
            left: 1.25rem;
            top: 1.25rem;
            color: #F97316;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            pointer-events: none;
          }
          .input-field:focus ~ .input-label,
          .input-field:not(:placeholder-shown) ~ .input-label {
            top: 0.5rem;
            font-size: 0.75rem;
            color: #F97316;
          }
          .error-text {
            color: #EF4444;
            font-size: 0.75rem;
            margin-top: 0.25rem;
            margin-left: 1.25rem;
          }
          .social-icon {
            transition: all 0.3s ease;
            position: relative;
          }
          .social-icon:hover {
            transform: translateY(-4px);
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
            transform: translate(-50%, 8px);
            background: #F97316;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            white-space: nowrap;
            opacity: 0;
            transition: all 0.3s ease;
            margin-bottom: 8px;
          }
          .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-top-color: #F97316;
          }
          .comment-card {
            transition: all 0.3s ease;
            max-width: 85%;
          }
          .comment-card:hover {
            transform: translateY(-2px);
          }
          @media (max-width: 768px) {
            .input-field {
              padding: 0.75rem 1rem;
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
            .social-icon {
              padding: 0.5rem;
            }
            .comment-card {
              max-width: 90%;
            }
          }
          @media (max-width: 480px) {
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
            .comment-card {
              max-width: 95%;
            }
          }
        `}</style>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* ABOUT SECTION */}
          <div data-aos="fade-up" data-aos-delay="100" className="flex flex-col space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-orange-600 tracking-tight">
              Hubungi Saya
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
              Halo! Saya <span className="font-bold text-orange-600">Ludang Prasetyo Nugroho</span>, mahasiswa Teknik Komputer di UTDI Yogyakarta. Saya bersemangat tentang pengembangan web, IoT, dan desain UI/UX. Ayo terhubung untuk proyek seru atau sekadar ngobrol!
            </p>
            <div className="space-y-4 text-gray-600 text-sm sm:text-base font-medium">
              <div className="flex items-center gap-3 animate-slide-in">
                <AiOutlineUser className="text-orange-600" size={20} />
                Ludang Prasetyo Nugroho
              </div>
              <div className="flex items-center gap-3 animate-slide-in">
                <AiOutlineMail className="text-orange-600" size={20} />
                <a href="mailto:ludang.prasetyo@students.utdi.ac.id" className="hover:text-orange-600 transition-colors">
                  ludang.prasetyo@students.utdi.ac.id
                </a>
              </div>
              <div className="flex items-center gap-3 animate-slide-in">
                <AiOutlineMessage className="text-orange-600" size={20} />
                Sleman, Yogyakarta
              </div>
            </div>
            <div className="pt-4">
              <h3 className="font-semibold text-orange-600 text-lg sm:text-xl mb-4">Ikuti Saya</h3>
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon bg-white border border-orange-200 rounded-full p-2.5 shadow-md text-gray-600 hover:bg-orange-50"
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
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600 mb-6 tracking-tight">
              Kirim Pesan
            </h3>
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
                  className="input-field h-32"
                  rows="5"
                  required
                  aria-describedby="message-error"
                />
                <label className="input-label">Pesan Anda</label>
                {formErrors.message && <span id="message-error" className="error-text">{formErrors.message}</span>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-lg bg-orange-500 text-white font-semibold text-base tracking-wide shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300/50 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
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
          <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col mt-10 lg:mt-0">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600 mb-6 tracking-tight">
              Tulis Komentar
            </h3>
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
                  className="input-field h-28"
                  rows="4"
                  required
                  aria-describedby="comment-message-error"
                />
                <label className="input-label">Komentar Anda</label>
                {formErrors.message && <span id="comment-message-error" className="error-text">{formErrors.message}</span>}
              </div>
              <button
                type="submit"
                disabled={isCommentSubmitting}
                className="w-full py-3.5 rounded-lg bg-orange-500 text-white font-semibold text-base tracking-wide shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300/50 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
              >
                {isCommentSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
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
            className="flex flex-col max-h-[450px] mt-10 lg:mt-0 bg-white/30 backdrop-blur-lg rounded-xl shadow-xl ring-1 ring-orange-200 overflow-hidden"
          >
            <div className="sticky top-0 z-10 px-5 py-3 bg-orange-50/80 backdrop-blur-sm border-b border-orange-200">
              <h3 className="text-xl sm:text-2xl font-bold text-orange-600 tracking-tight">Komentar</h3>
            </div>
            <div className="flex flex-col overflow-y-auto px-5 py-4 space-y-4 custom-scroll">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base italic text-center">
                  Belum ada komentar. Jadilah yang pertama!
                </p>
              ) : (
                comments.map(({ id, name, message, isUser }) => (
                  <div key={id} className={`flex ${isUser ? "justify-end" : "justify-start"} comment-card`}>
                    <div className="flex items-start space-x-3 max-w-[85%]">
                      {!isUser && (
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full shadow-md text-base font-bold">
                          {name?.[0]?.toUpperCase() || "A"}
                        </div>
                      )}
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-md ${
                          isUser
                            ? "bg-orange-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 border border-orange-200 rounded-bl-none"
                        }`}
                      >
                        <p className="text-xs font-semibold mb-1 opacity-80">
                          {name || (isUser ? "Saya" : "Anonim")}
                        </p>
                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                          {message || "Tidak ada pesan"}
                        </p>
                      </div>
                      {isUser && (
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full shadow-md text-base font-bold">
                          {name?.[0]?.toUpperCase() || "S"}
                        </div>
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