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
        <title>404 - Page Not Found | Nugra.my.id</title>
        <meta name="description" content="Oops! The page you're looking for doesn't exist." />
        <meta name="keywords" content="404, Not Found, Nugra.my.id, Error Page" />
        <meta property="og:title" content="404 - Page Not Found | Nugra.my.id" />
        <meta property="og:description" content="Oops! The page you're looking for doesn't exist." />
        <meta property="og:url" content="https://nugra.my.id/404" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nugra.my.id/404" />
      </Helmet>

      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100 text-gray-900 px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="flex justify-center mb-6 sm:mb-8"
            data-aos="zoom-in"
            data-aos-duration="800"
          >
            <AlertTriangle className="w-24 h-24 sm:w-32 sm:h-32 text-orange-600" />
          </div>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-orange-600 mb-4 sm:mb-6"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            404 - Page Not Found
          </h1>
          <p
            className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 sm:mb-10"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            Oops! Sepertinya halaman yang kamu cari tidak ada atau telah dipindahkan.
          </p>
          <div
            className="flex justify-center"
            data-aos="fade-up"
            data-aos-duration="1400"
          >
            <Link to="/">
              <button className="px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
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