import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      e.preventDefault();
      Swal.fire({
        icon: 'info',
        title: 'Live Demo Not Available',
        text: 'Maaf, link live demo untuk proyek ini tidak tersedia.',
        confirmButtonText: 'Mengerti',
        confirmButtonColor: '#F97316',
        background: '#FFFFFF',
        color: '#1F2937',
      });
    }
  };

  const handleDetails = (e) => {
    if (!id) {
      e.preventDefault();
      Swal.fire({
        icon: 'info',
        title: 'Details Not Available',
        text: 'Maaf, detail untuk proyek ini tidak tersedia.',
        confirmButtonText: 'Mengerti',
        confirmButtonColor: '#F97316',
        background: '#FFFFFF',
        color: '#1F2937',
      });
    }
  };

  return (
    <div className="group relative w-full animate-fade-in-up cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-orange-500 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="p-5 sm:p-6 flex flex-col h-full">
          <div className="relative overflow-hidden rounded-xl border border-orange-300 shadow-sm group-hover:shadow-md transition-shadow duration-300">
            <img
              src={Img}
              alt={Title}
              className="w-full h-48 sm:h-56 object-cover rounded-xl transform transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <div className="mt-5 flex flex-col flex-grow">
            <h3 className="text-black font-bold text-xl sm:text-2xl tracking-tight">
              {Title}
            </h3>

            <p className="text-gray-700 mt-2 text-sm sm:text-base line-clamp-3 flex-grow">
              {Description}
            </p>

            <div className="pt-4 flex items-center justify-between mt-auto">
              {ProjectLink ? (
                <a
                  href={ProjectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemo}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border-2 border-orange-500 text-orange-600 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition duration-300 shadow-sm hover:shadow-md"
                  aria-label="Live Demo"
                >
                  <span className="text-sm sm:text-base">Live Demo</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              ) : (
                <span className="text-gray-400 font-medium text-sm sm:text-base">
                  Demo Not Available
                </span>
              )}

              {id ? (
                <Link
                  to={`/project/${id}`}
                  onClick={handleDetails}
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-orange-400 transition duration-300 shadow-sm hover:shadow-md"
                  aria-label="Project Details"
                >
                  <span className="text-sm sm:text-base">Details</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <span className="text-gray-400 font-medium text-sm sm:text-base">
                  Details Not Available
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CardProject;
