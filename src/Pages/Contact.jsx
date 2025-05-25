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
import { db, collection, addDoc, serverTimestamp } from "../firebase"; // Sesuaikan path jika perlu

const ContactFooter = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      // Tambah dokumen baru ke koleksi "contacts"
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp(),
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Pesan kamu sudah terkirim!",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 2000,
        timerProgressBar: true,
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
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

  const socialLinks = [
    { icon: <AiFillGithub size={28} />, name: "GitHub", href: "https://github.com/ludangp" },
    { icon: <AiFillInstagram size={28} />, name: "Instagram", href: "https://instagram.com/ludangprasetyo" },
    { icon: <AiFillLinkedin size={28} />, name: "LinkedIn", href: "https://linkedin.com/in/ludangprasetyo" },
    { icon: <AiOutlineTwitter size={28} />, name: "Twitter", href: "https://twitter.com/ludangprasetyo" },
    { icon: <AiFillFacebook size={28} />, name: "Facebook", href: "https://facebook.com/ludangprasetyo" },
    { icon: <AiFillYoutube size={28} />, name: "YouTube", href: "https://youtube.com/@ludangprasetyo" },
  ];

  return (
    <footer id="contact" className="bg-gradient-to-r from-orange-100 to-orange-50 border-t border-orange-300 mt-20 px-6 py-16 rounded-t-3xl shadow-lg"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left Section */}
        <div data-aos="fade-right" className="flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-orange-600 mb-6 tracking-wide">Tentang Saya</h2>
            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              Halo! Saya <strong>Ludang Prasetyo Nugroho</strong>, mahasiswa Teknik Komputer di UTDI Yogyakarta.
              Tertarik pada pengembangan web, IoT, dan UI/UX modern. Terbuka untuk kolaborasi & proyek!
            </p>

            <div className="space-y-4 text-gray-700 text-md font-medium">
              <div className="flex items-center gap-3">
                <AiOutlineUser className="text-orange-500" size={22} />
                Ludang Prasetyo Nugroho
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineMail className="text-orange-500" size={22} />
                ludang@nugra.my.id
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineMessage className="text-orange-500" size={22} />
                Sleman, Yogyakarta
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="font-semibold text-orange-600 mb-4 text-lg">Temui Saya di:</h3>
            <div className="flex gap-6 flex-wrap">
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group transform hover:scale-125 transition-transform duration-300"
                  data-aos="zoom-in"
                  data-aos-delay={idx * 100}
                  aria-label={link.name}
                >
                  <div className="bg-white border border-orange-300 rounded-2xl p-4 shadow-md hover:shadow-xl text-orange-600 hover:text-orange-700 flex items-center justify-center">
                    {link.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div data-aos="fade-left">
          <h3 className="text-3xl font-bold text-orange-600 mb-8 tracking-wide">Kirim Pesan</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <AiOutlineUser className="absolute left-4 top-4 text-orange-300" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full pl-12 pr-4 py-4 bg-white border rounded-2xl border-orange-300 text-md focus:outline-none focus:ring-4 focus:ring-orange-300 placeholder-orange-400"
                required
              />
            </div>

            <div className="relative">
              <AiOutlineMail className="absolute left-4 top-4 text-orange-300" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full pl-12 pr-4 py-4 bg-white border rounded-2xl border-orange-300 text-md focus:outline-none focus:ring-4 focus:ring-orange-300 placeholder-orange-400"
                required
              />
            </div>

            <div className="relative">
              <AiOutlineMessage className="absolute left-4 top-4 text-orange-300" size={20} />
              <textarea
                name="message"
                placeholder="Pesan kamu..."
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full pl-12 pr-4 py-4 bg-white border rounded-2xl border-orange-300 text-md h-36 resize-none focus:outline-none focus:ring-4 focus:ring-orange-300 placeholder-orange-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-2xl font-extrabold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <AiOutlineSend size={24} />
              {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Text */}
      {/* <div className="text-center text-sm text-orange-400 mt-14 font-semibold" data-aos="fade-up">
        © {new Date().getFullYear()} Ludang Prasetyo Nugroho — All rights reserved.
      </div> */}
    </footer>
  );
};

export default ContactFooter;
