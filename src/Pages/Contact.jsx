import React, { useState, useEffect } from "react";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineMessage,
  AiOutlineSend,
  AiFillGithub,
  AiFillInstagram,
  AiFillLinkedin,
  AiFillYoutube,
} from "react-icons/ai";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet"; // Impor react-helmet
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

  useEffect(() => {
    AOS.init({
      once: false,
      duration: 800,
      easing: "ease-out-cubic",
      mirror: true,
    });

    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentList);
    }, (error) => {
      console.error("Error fetching comments:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal memuat komentar: " + error.message,
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setCommentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    if (!commentData.name.trim() || !commentData.message.trim()) {
      Swal.fire({
        title: "Oops!",
        text: "Nama dan pesan tidak boleh kosong.",
        icon: "warning",
        confirmButtonColor: "#f97316",
      });
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
    { icon: <AiFillGithub size={28} />, name: "GitHub", href: "https://github.com/Nugraa21" },
    { icon: <AiFillInstagram size={28} />, name: "Instagram", href: "https://www.instagram.com/nugraa_21/" },
    { icon: <AiFillLinkedin size={28} />, name: "LinkedIn", href: "https://www.linkedin.com/in/ludang-prasetyo-4773b6361/" },
    { icon: <AiFillYoutube size={28} />, name: "YouTube", href: "https://youtube.com/@nugra21" },
  ];

  return (
    <>
      <Helmet>
        <title>Contact – Nugra.my.id</title>
        <meta name="description" content="Hubungi Ludang Prasetyo Nugroho untuk kolaborasi, pertanyaan, atau sekadar berbagi ide!" />
        <meta name="keywords" content="Ludang Prasetyo, Nugra21, Contact, Kontak, Web Developer, IoT, UI/UX" />
        <meta property="og:title" content="Contact – Nugra.my.id" />
        <meta property="og:description" content="Hubungi Ludang Prasetyo Nugroho untuk kolaborasi, pertanyaan, atau sekadar berbagi ide!" />
        <meta property="og:url" content="https://nugra.my.id/contact" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nugra.my.id/contact" />
      </Helmet>

      <footer
        id="contact"
        className="bg-gradient-to-b from-orange-50 to-orange-100 mt-16 sm:mt-20 px-4 sm:px-6 md:px-8 py-12 sm:py-16 rounded-t-3xl shadow-xl border-t border-orange-200"
      >
        <style>
          {`
            @keyframes slideIn {
              0% { transform: translateY(20px); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
            @keyframes glowPulse {
              0% { box-shadow: 0 0 5px rgba(251, 146, 60, 0.2); }
              50% { box-shadow: 0 0 10px rgba(251, 146, 60, 0.4); }
              100% { box-shadow: 0 0 5px rgba(251, 146, 60, 0.2); }
            }
            .animate-slide-in {
              animation: slideIn 0.8s ease-out forwards;
            }
            .animate-glow-pulse {
              animation: glowPulse 2s ease-in-out infinite;
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
            .input-field {
              transition: all 0.3s ease;
              background: rgba(255, 255, 255, 0.9);
              backdrop-filter: blur(4px);
            }
            .input-field:focus {
              transform: scale(1.02);
              box-shadow: 0 0 10px rgba(251, 146, 60, 0.3);
            }
            .social-icon {
              transition: all 0.3s ease;
            }
            .social-icon:hover {
              transform: translateY(-4px);
              box-shadow: 0 4px 12px rgba(251, 146, 60, 0.4);
              color: #F97316;
            }
            .comment-card {
              transition: all 0.3s ease;
            }
            .comment-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
            }
            @media (max-width: 768px) {
              .footer-container {
                padding: 1rem;
              }
              .section-title {
                font-size: 1.75rem;
              }
              .input-field {
                padding: 0.75rem 1rem;
                font-size: 0.9rem;
              }
              .submit-button {
                padding: 0.75rem;
                font-size: 0.9rem;
              }
              .social-icon {
                padding: 0.5rem;
              }
              .comment-card {
                max-width: 90%;
              }
            }
            @media (max-width: 480px) {
              .section-title {
                font-size: 1.5rem;
              }
              .input-field {
                padding: 0.6rem 0.8rem;
                font-size: 0.85rem;
              }
              .submit-button {
                padding: 0.6rem;
                font-size: 0.85rem;
              }
              .social-icon {
                padding: 0.4rem;
              }
              .comment-card {
                max-width: 95%;
              }
            }
          `}
        </style>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 footer-container">
          {/* ABOUT SECTION */}
          <div data-aos="fade-right" data-aos-duration="800" className="flex flex-col">
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl font-extrabold text-orange-700 mb-4 sm:mb-6 tracking-tight">
              Hubungi Nugra
            </h2>
            <p className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg leading-relaxed">
              Halo! Saya <strong>Ludang Prasetyo Nugroho</strong>, mahasiswa Teknik Komputer di UTDI Yogyakarta.  
              Saya antusias dengan pengembangan web, IoT, dan desain UI/UX.  
              Mari terhubung untuk proyek keren atau sekadar ngobrol santai!
            </p>
            <div className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base font-medium">
              <div className="flex items-center gap-3 animate-slide-in">
                <AiOutlineUser className="text-orange-600" size={20} />
                Ludang Prasetyo Nugroho
              </div>
              <div className="flex items-center gap-3 animate-slide-in">
                <AiOutlineMail className="text-orange-600" size={20} />
                ludang.prasetyo@students.utdi.ac.id
              </div>
              <div className="flex items-center gap-3 animate-slide-in">
                <AiOutlineMessage className="text-orange-600" size={20} />
                Sleman, Yogyakarta
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              <h3 className="font-semibold text-orange-700 mb-3 sm:mb-4 text-base sm:text-lg">Ikuti Saya:</h3>
              <div className="flex gap-3 sm:gap-4 flex-wrap">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon bg-white border border-orange-300 rounded-full p-2 sm:p-3 shadow-md text-orange-600 animate-glow-pulse"
                    aria-label={link.name}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div data-aos="fade-left" data-aos-duration="800" className="flex flex-col">
            <h3 className="section-title text-2xl sm:text-3xl font-bold text-orange-700 mb-4 sm:mb-6 tracking-tight">
              Kirim Pesan
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="input-field w-full px-4 sm:px-5 py-3 sm:py-4 border border-orange-300 rounded-xl placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="input-field w-full px-4 sm:px-5 py-3 sm:py-4 border border-orange-300 rounded-xl placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <textarea
                name="message"
                placeholder="Pesan kamu..."
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className="input-field w-full px-4 sm:px-5 py-3 sm:py-4 h-28 sm:h-32 border border-orange-300 rounded-xl placeholder-orange-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold tracking-wide shadow-lg hover:from-orange-600 hover:to-orange-700 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed animate-glow-pulse"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
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
          <div data-aos="fade-up" data-aos-duration="800" className="flex flex-col mt-8 md:mt-0">
            <h3 className="section-title text-2xl sm:text-3xl font-bold text-orange-700 mb-4 sm:mb-6 tracking-tight">
              Tulis Komentar
            </h3>
            <form onSubmit={handleCommentSubmit} className="space-y-4 sm:space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Nama kamu"
                value={commentData.name}
                onChange={handleCommentChange}
                disabled={isCommentSubmitting}
                className="input-field w-full px-4 sm:px-5 py-3 sm:py-4 border border-orange-300 rounded-xl placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <textarea
                name="message"
                placeholder="Tulis komentar..."
                value={commentData.message}
                onChange={handleCommentChange}
                disabled={isCommentSubmitting}
                className="input-field w-full px-4 sm:px-5 py-3 sm:py-4 h-24 sm:h-28 border border-orange-300 rounded-xl placeholder-orange-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <button
                type="submit"
                disabled={isCommentSubmitting}
                className="submit-button w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold tracking-wide shadow-lg hover:from-orange-600 hover:to-orange-700 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed animate-glow-pulse"
              >
                {isCommentSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
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
            data-aosроверка:duration="800"
            className="flex flex-col max-h-[400px] mt-8 md:mt-0 relative bg-white/20 backdrop-blur-lg rounded-xl shadow-lg ring-1 ring-orange-100 overflow-hidden"
          >
            <div className="sticky top-0 z-10 px-4 sm:px-5 py-3 bg-white/30 backdrop-blur-sm border-b border-orange-200 flex items-center">
              <h3 className="text-xl sm:text-2xl font-bold text-orange-700 tracking-tight">Komentar</h3>
            </div>
            <div className="flex flex-col overflow-y-auto px-4 sm:px-5 py-4 space-y-4 custom-scroll">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base italic">Belum ada komentar. Yuk, tambahkan komentarmu!</p>
              ) : (
                comments.map(({ id, name, message, isUser }) => (
                  <div key={id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} comment-card`}>
                    <div className="flex items-end space-x-2 sm:space-x-3 max-w-[80%] sm:max-w-[85%]">
                      {!isUser && (
                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full shadow-inner text-sm sm:text-base font-bold">
                          {name?.[0]?.toUpperCase() || "A"}
                        </div>
                      )}
                      <div
                        className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-md ${
                          isUser
                            ? 'bg-orange-500 text-white rounded-br-none'
                            : 'bg-white/80 text-gray-800 border border-orange-200 backdrop-blur-sm rounded-bl-none'
                        }`}
                      >
                        <p className="text-xs sm:text-sm font-semibold mb-1 opacity-80">
                          {name || (isUser ? "Saya" : "Anonim")}
                        </p>
                        <p className="text-sm sm:text-base leading-snug whitespace-pre-wrap">
                          {message || "Tidak ada pesan"}
                        </p>
                      </div>
                      {isUser && (
                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full shadow-inner text-sm sm:text-base font-bold">
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