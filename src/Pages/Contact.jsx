import React, { useState, useEffect } from "react";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineMessage,
  AiOutlineSend,
  AiFillGithub,
  AiFillInstagram,
  AiFillLinkedin,
  AiOutlineTwitter,
  AiFillFacebook,
  AiFillYoutube,
} from "react-icons/ai";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
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
    AOS.init({ once: false });

    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("ContactFooter comments:", commentList); // Debugging
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
        ...commentData, // { name, message }
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
    { icon: <AiFillGithub size={28} />, name: "GitHub", href: "https://github.com/ludangp" },
    { icon: <AiFillInstagram size={28} />, name: "Instagram", href: "https://instagram.com/ludangprasetyo" },
    { icon: <AiFillLinkedin size={28} />, name: "LinkedIn", href: "https://linkedin.com/in/ludangprasetyo" },
    { icon: <AiOutlineTwitter size={28} />, name: "Twitter", href: "https://twitter.com/ludangprasetyo" },
    { icon: <AiFillFacebook size={28} />, name: "Facebook", href: "https://facebook.com/ludangprasetyo" },
    { icon: <AiFillYoutube size={28} />, name: "YouTube", href: "https://youtube.com/@ludangprasetyo" },
  ];

  return (
    <footer
      id="contact"
      className="bg-gradient-to-r from-orange-200 to-orange-100 mt-20 px-8 py-16 rounded-t-3xl shadow-lg border-t border-orange-300"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* ABOUT */}
        <div data-aos="fade-right" className="flex flex-col">
          <h2 className="text-4xl font-extrabold text-orange-700 mb-6 tracking-wide">
            Tentang Saya
          </h2>
          <p className="text-gray-800 mb-8 text-lg leading-relaxed">
            Halo! Saya <strong>Ludang Prasetyo Nugroho</strong>, mahasiswa Teknik Komputer di
            UTDI Yogyakarta. Tertarik pada pengembangan web, IoT, dan UI/UX modern.
            Terbuka untuk kolaborasi & proyek!
          </p>

          <div className="space-y-4 text-gray-700 text-md font-medium">
            <div className="flex items-center gap-3">
              <AiOutlineUser className="text-orange-600" size={22} />
              Ludang Prasetyo Nugroho
            </div>
            <div className="flex items-center gap-3">
              <AiOutlineMail className="text-orange-600" size={22} />
              ludang@nugra.my.id
            </div>
            <div className="flex items-center gap-3">
              <AiOutlineMessage className="text-orange-600" size={22} />
              Sleman, Yogyakarta
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-orange-700 mb-4 text-lg">Temui Saya di:</h3>
            <div className="flex gap-5 flex-wrap">
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group transform hover:scale-110 transition-transform duration-300"
                  aria-label={link.name}
                >
                  <div className="bg-white border border-orange-400 rounded-3xl p-3 shadow-md text-orange-700 hover:text-orange-800">
                    {link.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* FORM */}
        <div data-aos="fade-left" className="flex flex-col">
          <h3 className="text-3xl font-bold text-orange-700 mb-8 tracking-wide">Kirim Pesan</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-5 py-4 border rounded-3xl border-orange-400 placeholder-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-5 py-4 border rounded-3xl border-orange-400 placeholder-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
            />
            <textarea
              name="message"
              placeholder="Pesan kamu..."
              value={formData.message}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-5 py-4 h-32 border rounded-3xl border-orange-400 placeholder-orange-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                relative
                inline-flex
                items-center
                justify-center
                w-full
                py-4
                rounded-full
                bg-gradient-to-r from-orange-500 to-orange-600
                text-white
                font-extrabold
                tracking-wider
                shadow-lg
                transition
                duration-300
                ease-in-out
                hover:from-orange-600 hover:to-orange-700
                hover:shadow-xl
                active:scale-95
                focus:outline-none focus:ring-4 focus:ring-orange-300
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </form>
        </div>

        {/* FORM KOMENTAR */}
        <div data-aos="fade-up" className="flex flex-col mt-16 md:mt-0">
          <h3 className="text-3xl font-bold text-orange-700 mb-6 tracking-wide">
            Tulis Komentar
          </h3>

          <form onSubmit={handleCommentSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Nama kamu"
              value={commentData.name}
              onChange={handleCommentChange}
              disabled={isCommentSubmitting}
              className="w-full px-5 py-4 border border-orange-400 rounded-2xl placeholder-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
            />
            <textarea
              name="message"
              placeholder="Tulis komentar..."
              value={commentData.message}
              onChange={handleCommentChange}
              disabled={isCommentSubmitting}
              className="w-full px-5 py-4 border border-orange-400 rounded-2xl h-28 placeholder-orange-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
            />
            <button
              type="submit"
              disabled={isCommentSubmitting}
              className="
                relative
                inline-flex
                items-center
                justify-center
                w-full
                py-3
                rounded-full
                bg-gradient-to-r from-orange-500 to-orange-600
                text-white
                font-semibold
                tracking-wider
                shadow-lg
                transition
                duration-300
                ease-in-out
                hover:from-orange-600 hover:to-orange-700
                hover:shadow-xl
                active:scale-95
                focus:outline-none focus:ring-4 focus:ring-orange-300
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isCommentSubmitting ? "Mengirim..." : "Kirim Komentar"}
            </button>
          </form>
        </div>

        {/* OUTPUT KOMENTAR */}
        <div
          data-aos="fade-up"
          className="flex flex-col max-h-[400px] mt-16 md:mt-0 relative backdrop-blur-md bg-white/30 rounded-2xl shadow-xl ring-1 ring-orange-100 overflow-hidden"
        >
          {/* Judul tetap di atas */}
          <div className="sticky top-0 z-10 px-4 py-3 bg-white/40 backdrop-blur-sm border-b border-orange-200 flex items-center">
            <span className="text-orange-600 text-2xl mr-2"></span>
            <h3 className="text-2xl font-bold text-orange-700 tracking-wide">Komentar</h3>
          </div>

          {/* Area Komentar Scroll */}
          <div className="flex flex-col overflow-y-auto px-4 py-4 space-y-4 custom-scroll">
            {comments.length === 0 ? (
              <p className="text-gray-500 italic">Belum ada komentar. Jadilah yang pertama!</p>
            ) : (
              comments.map(({ id, name, message, isUser }) => (
                <div key={id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex items-end space-x-2 max-w-[80%]">
                    {/* Icon User (kiri) */}
                    {!isUser && (
                      <div className="w-8 h-8 bg-orange-200 text-orange-700 flex items-center justify-center rounded-full shadow-inner text-sm font-bold">
                        {name?.[0]?.toUpperCase() || "A"}
                      </div>
                    )}

                    {/* Bubble/Card */}
                    <div
                      className={`px-4 py-3 rounded-2xl transition-all duration-300 ease-in-out shadow-md ${
                        isUser
                          ? 'bg-orange-500/90 text-white rounded-br-none'
                          : 'bg-white/80 text-gray-800 border border-orange-100 backdrop-blur-sm rounded-bl-none'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 opacity-80">
                        {name || (isUser ? "Saya" : "Anonim")}
                      </p>
                      <p className="text-sm leading-snug whitespace-pre-wrap">
                        {message || "Tidak ada pesan"}
                      </p>
                    </div>

                    {/* Icon User (kanan) */}
                    {isUser && (
                      <div className="w-8 h-8 bg-orange-200 text-orange-700 flex items-center justify-center rounded-full shadow-inner text-sm font-bold">
                        {name?.[0]?.toUpperCase() || "S"}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
{/*  */}
      </div>
    </footer>
  );
};

export default ContactFooter;