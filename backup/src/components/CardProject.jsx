import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const handleLiveDemo = (e) => {
    e.stopPropagation(); // Mencegah propagasi klik ke kartu
    if (!ProjectLink) {
      e.preventDefault();
      Swal.fire({
        icon: "info",
        title: "Live Demo Not Available",
        text: "Maaf, link live demo untuk proyek ini tidak tersedia.",
        confirmButtonText: "Mengerti",
        confirmButtonColor: "#F97316",
        background: "#FFFFFF",
        color: "#1F2937",
        customClass: {
          popup: "rounded-xl shadow-2xl",
          title: "font-bold text-xl",
          content: "text-sm",
          confirmButton: "px-6 py-2 text-sm font-semibold rounded-lg",
        },
      });
    }
  };

  const handleDetails = (e) => {
    e.stopPropagation(); // Mencegah propagasi klik ke kartu
    if (!id) {
      e.preventDefault();
      Swal.fire({
        icon: "info",
        title: "Details Not Available",
        text: "Maaf, detail untuk proyek ini tidak tersedia.",
        confirmButtonText: "Mengerti",
        confirmButtonColor: "#F97316",
        background: "#FFFFFF",
        color: "#1F2937",
        customClass: {
          popup: "rounded-xl shadow-2xl",
          title: "font-bold text-xl",
          content: "text-sm",
          confirmButton: "px-6 py-2 text-sm font-semibold rounded-lg",
        },
      });
    }
  };

  return (
    <div className="group relative w-full max-w-sm mx-auto animate-slide-in-up">
      <div className="relative overflow-hidden rounded-2xl bg-white border border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-yellow-50">
        {/* Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img
            src={Img}
            alt={Title}
            className="w-full h-40 xs:h-44 sm:h-48 object-cover transform transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/fallback.png")}
          />
          <div className="absolute inset-0 bg-orange-600/10 group-hover:bg-orange-600/20 transition-all duration-500 pointer-events-none" />
        </div>

        {/* Content Section */}
        <div className="p-4 xs:p-5 sm:p-6 flex flex-col h-full">
          <h3 className="text-gray-900 font-bold text-base xs:text-lg sm:text-xl tracking-tight line-clamp-1">
            {Title}
          </h3>
          <p className="text-gray-700 mt-2 text-xs xs:text-sm sm:text-base line-clamp-3 flex-grow">
            {Description}
          </p>

          {/* Buttons */}
          <div className="pt-3 xs:pt-4 flex flex-col xs:flex-row items-center justify-between gap-2 xs:gap-3 sm:gap-4 mt-auto">
            {ProjectLink ? (
              <a
                href={ProjectLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLiveDemo}
                className="relative inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-semibold text-xs xs:text-sm hover:from-orange-600 hover:to-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 w-full xs:w-auto z-10"
                aria-label="Live Demo"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />
              </a>
            ) : (
              <span className="text-gray-500 font-medium text-xs xs:text-sm bg-gray-100 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 rounded-lg w-full xs:w-auto text-center z-10">
                Demo Not Available
              </span>
            )}

            {id ? (
              <Link
                to={`/project/${id}`}
                onClick={handleDetails}
                className="relative inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 bg-white border-2 border-orange-500 text-orange-600 rounded-lg font-semibold text-xs xs:text-sm hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 w-full xs:w-auto z-10"
                aria-label="Project Details"
              >
                <span>Details</span>
                <ArrowRight className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />
              </Link>
            ) : (
              <span className="text-gray-500 font-medium text-xs xs:text-sm bg-gray-100 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 rounded-lg w-full xs:w-auto text-center z-10">
                Details Not Available
              </span>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out;
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .group:hover .shadow-xl {
          box-shadow: 0 8px 16px rgba(251, 146, 60, 0.2);
        }
      `}</style>
    </div>
  );
};

export default CardProject;