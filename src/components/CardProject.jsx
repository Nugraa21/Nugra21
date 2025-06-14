import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Handler untuk tombol Live Demo
    const handleLiveDemo = (e) => {
        e.stopPropagation(); // Mencegah event click menyebar ke parent Link/div
        if (!ProjectLink) {
            e.preventDefault(); // Mencegah navigasi default jika link tidak ada
            Swal.fire({
                icon: "info",
                title: "Live Demo Not Available",
                text: "Maaf, link live demo untuk proyek ini tidak tersedia.",
                confirmButtonText: "Mengerti",
                confirmButtonColor: "#F97316", // Warna oranye untuk tombol SweetAlert
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

    // Handler untuk tombol Details
    const handleDetails = (e) => {
        e.stopPropagation(); // Mencegah event click menyebar ke parent Link/div
        if (!id) {
            e.preventDefault(); // Mencegah navigasi default jika ID tidak ada
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
        <div className="group relative w-full max-w-sm mx-auto h-full flex flex-col animate-slide-in-up">
            <div className="relative flex flex-col flex-grow overflow-hidden rounded-2xl bg-white border border-orange-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out bg-gradient-to-br from-orange-50 to-yellow-50">
                {/* Image Section with Loading Shimmer and Hover Overlay */}
                <div className="relative overflow-hidden h-40 xs:h-44 sm:h-48 flex-shrink-0">
                    {!isImageLoaded && (
                        <div className="absolute inset-0 shimmer" /> // Efek shimmer saat gambar belum dimuat
                    )}
                    <img
                        src={Img || "/fallback.png"} // Fallback image jika Img kosong/gagal
                        alt={Title || "Project Image"}
                        className={`w-full h-full object-cover transform transition-all duration-700 ease-out 
                                    ${isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
                        loading="lazy"
                        onLoad={() => setIsImageLoaded(true)}
                        onError={(e) => {
                            console.error("Image failed to load, using fallback:", Img);
                            e.currentTarget.src = "/fallback.png"; // Ganti dengan gambar fallback
                            setIsImageLoaded(true); // Tetap set ke true agar shimmer hilang
                        }}
                    />
                    {/* Overlay yang muncul saat hover */}
                    <div className="absolute inset-0 bg-orange-600/10 group-hover:bg-orange-600/20 transition-all duration-500 pointer-events-none" />
                </div>

                {/* Content Section */}
                <div className="p-4 xs:p-5 sm:p-6 flex flex-col flex-grow">
                    <h3 className="text-gray-900 font-bold text-base xs:text-lg sm:text-xl tracking-tight line-clamp-1 mb-2">
                        {Title || "Untitled Project"}
                    </h3>
                    <p className="text-gray-700 text-xs xs:text-sm sm:text-base line-clamp-3 flex-grow mb-4">
                        {Description || "No description provided for this project."}
                    </p>

                    {/* Buttons Section */}
                    <div className="pt-3 xs:pt-4 flex flex-col xs:flex-row items-center justify-between gap-2 xs:gap-3 sm:gap-4 mt-auto">
                        {ProjectLink ? (
                            <a
                                href={ProjectLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleLiveDemo}
                                className="relative inline-flex items-center justify-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-semibold text-xs xs:text-sm hover:from-orange-600 hover:to-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 w-full xs:w-auto z-10"
                                aria-label="Live Demo"
                            >
                                <span>Kunjungi</span>
                                <ExternalLink className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />
                            </a>
                        ) : (
                            <span className="text-gray-500 font-medium text-xs xs:text-sm bg-gray-100 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 rounded-lg w-full xs:w-auto text-center cursor-not-allowed opacity-70 z-10">
                                Demo Not Available
                            </span>
                        )}

                        {id ? (
                            <Link
                                to={`/project/${id}`}
                                onClick={handleDetails}
                                className="relative inline-flex items-center justify-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 bg-white border-2 border-orange-500 text-orange-600 rounded-lg font-semibold text-xs xs:text-sm hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 w-full xs:w-auto z-10"
                                aria-label="Project Details"
                            >
                                <span>Details</span>
                                <ArrowRight className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />
                            </Link>
                        ) : (
                            <span className="text-gray-500 font-medium text-xs xs:text-sm bg-gray-100 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 rounded-lg w-full xs:w-auto text-center cursor-not-allowed opacity-70 z-10">
                                Details Not Available
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Global Styles for Animations and Custom Effects */}
            <style jsx>{`
                .animate-slide-in-up {
                    animation: slideInUp 0.6s ease-out;
                }
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                /* Efek bayangan yang lebih kuat saat hover pada grup */
                .group:hover .shadow-xl {
                    box-shadow: 0 10px 20px rgba(251, 146, 60, 0.25); /* Oranye dengan transparansi */
                }

                /* Efek shimmer loading gambar */
                .shimmer {
                    background: linear-gradient(
                        90deg,
                        #f0f0f0 25%,
                        #e0e0e0 50%,
                        #f0f0f0 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};

export default CardProject;