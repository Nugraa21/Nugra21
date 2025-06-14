import React, { useEffect, useState, memo } from "react";
import Slider from "react-slick";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const imageList = [
  "/galeri/1.jpg",
  "/galeri/2.jpg",
  "/galeri/3.jpg",
  "/galeri/4.jpg",
  "/galeri/5.jpg",
  "/galeri/6.jpg",
];

const Galeri = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="min-h-screen bg-white text-gray-800 pt-20 pb-16 px-4 sm:px-8" id="Home">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-orange-500 drop-shadow-md">Galeri Proyek Teknologi</h2>
        <p className="text-gray-600 mt-2">
          Eksplorasi visual interaktif dari dokumentasi proyek, robotika, dan riset teknologi.
        </p>
      </div>

      <div data-aos="fade-up">
        <Slider {...settings}>
          {imageList.map((img, i) => (
            <div
              key={i}
              className="px-3 cursor-pointer"
              onClick={() => setSelectedImg(img)}
            >
              <div className="relative group overflow-hidden rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition duration-300">
                <img
                  src={img}
                  alt={`Galeri ${i + 1}`}
                  className="w-full h-64 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-orange-600 font-semibold backdrop-blur-sm transition duration-300">
                  Klik untuk perbesar
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Modal View */}
      {selectedImg && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
          onClick={() => setSelectedImg(null)}
        >
          <img
            src={selectedImg}
            alt="Preview"
            className="max-w-3xl max-h-[85vh] rounded-xl shadow-2xl border-4 border-white"
          />
        </div>
      )}
    </section>
  );
};

export default memo(Galeri);
