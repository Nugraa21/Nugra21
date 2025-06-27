import { memo, useEffect } from "react";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  useEffect(() => {
    AOS.init({
      once: false,
      duration: window.innerWidth < 640 ? 600 : 800,
      easing: "ease-in-out",
    });
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => AOS.refresh(), 250);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>404 - Halaman Tidak Ditemukan | Nugra.my.id</title>
        <meta name="description" content="Oops! Halaman yang Anda cari tidak ada." />
        <meta name="keywords" content="404, Tidak Ditemukan, Nugra.my.id, Halaman Error" />
        <meta property="og:title" content="404 - Halaman Tidak Ditemukan | Nugra.my.id" />
        <meta property="og:description" content="Oops! Halaman yang Anda cari tidak ada." />
        <meta property="og:url" content="https://nugra.my.id/404" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nugra.my.id/404" />
        <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet" />
      </Helmet>

      <section className="min-h-screen flex items-center justify-center bg-yellow-50 px-4 sm:px-6 md:px-8 font-[Patrick_Hand]">
        <div className="max-w-3xl mx-auto text-center bg-white border-4 border-dashed border-yellow-300 rounded-3xl shadow-[8px_8px_0_0_#facc15] p-8 sm:p-12">
          <div className="flex justify-center mb-6 sm:mb-8" data-aos="zoom-in" data-aos-duration="800">
            <AlertTriangle className="w-20 h-20 sm:w-28 sm:h-28 text-red-500 animate-bounce" />
          </div>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl text-orange-600 mb-4 sm:mb-6 font-bold"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            404 - Halaman Tidak Ditemukan
          </h1>
          <p
            className="text-xl sm:text-2xl text-gray-700 mb-6 sm:mb-8"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            Oops! Sepertinya halaman yang kamu cari tidak ada atau telah dipindahkan.
          </p>
          <p
            className="text-md sm:text-lg text-gray-600 italic mb-10"
            data-aos="fade-up"
            data-aos-duration="1300"
          >
            Jika kamu merasa ini adalah kesalahan, silakan hubungi <span className="font-semibold text-orange-500">Ludang Prasetyo Nugroho</span> melalui halaman kontak di <a href="https://nugra.my.id" className="underline hover:text-orange-600 transition">nugra.my.id</a>.
          </p>
          <div className="flex justify-center" data-aos="fade-up" data-aos-duration="1400">
            <Link to="/">
              <button className="px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl border-2 border-yellow-300">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                Kembali ke Beranda
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
                   
export default memo(NotFound);
