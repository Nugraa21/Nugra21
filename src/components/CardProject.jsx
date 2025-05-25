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
    <div className="group relative w-full animate-fade-in-up">
      <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:rotate-0.5">
        <div className="relative p-4 sm:p-6 z-10">
          <div className="relative overflow-hidden rounded-lg border border-orange-200 shadow-sm group-hover:shadow-md">
            <img
              src={Img}
              alt={Title}
              className="w-full h-40 sm:h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 border-2 border-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          </div>

          <div className="mt-4 space-y-3">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-orange-500">
              {Title}
            </h3>

            <p className="text-black text-xs sm:text-sm leading-relaxed line-clamp-2">
              {Description}
            </p>

            <div className="pt-2 flex items-center justify-between">
              {ProjectLink ? (
                <a
                  href={ProjectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemo}
                  className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 bg-transparent border border-orange-300 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 hover:animate-pulse-micro focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  <span className="text-xs sm:text-sm font-medium">Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-gray-400 text-xs sm:text-sm">Demo Not Available</span>
              )}

              {id ? (
                <Link
                  to={`/project/${id}`}
                  onClick={handleDetails}
                  className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 bg-transparent border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 hover:animate-pulse-micro focus:outline-none focus:ring-2 focus:ring-gray-800/50"
                >
                  <span className="text-xs sm:text-sm font-medium">Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="text-gray-400 text-xs sm:text-sm">Details Not Available</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-pulse-micro {
          animation: pulseMicro 0.3s ease-in-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseMicro {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CardProject;