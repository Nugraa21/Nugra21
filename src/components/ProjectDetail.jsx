import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, ExternalLink, Github, Code2, Star,
    ChevronRight, Layers,
} from "lucide-react";
import Swal from "sweetalert2";
import { db, doc, onSnapshot } from "../firebase"; // Pastikan path ini benar

// --- Konfigurasi Warna & Ikon ---
const primaryColor = "orange"; // Ubah ini untuk warna dominan
const secondaryColor = "gray"; // Ubah ini untuk warna sekunder

const TECH_ICONS = {
    React: Code2, // Anda bisa mengganti ini dengan ikon khusus React jika ada
    Tailwind: Code2, // Anda bisa mengganti ini dengan ikon khusus Tailwind jika ada
    Express: Code2, // Anda bisa mengganti ini dengan ikon khusus Express jika ada
    Python: Code2, // Anda bisa mengganti ini dengan ikon khusus Python jika ada
    Javascript: Code2, // Anda bisa mengganti ini dengan ikon khusus Javascript jika ada
    HTML: Code2, // Anda bisa mengganti ini dengan ikon khusus HTML jika ada
    CSS: Code2, // Anda bisa mengganti ini dengan ikon khusus CSS jika ada
    default: Code2, // Ikon default jika tidak ditemukan
};

// --- Komponen Pembantu ---
const TechBadge = ({ tech }) => {
    const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
    return (
        <div className={`px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 bg-${primaryColor}-100 rounded-full border border-${primaryColor}-200 hover:bg-${primaryColor}-200 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 cursor-default flex items-center gap-1 xs:gap-1.5`}>
            <Icon className={`w-3.5 xs:w-4 h-3.5 xs:h-4 text-${primaryColor}-500`} />
            <span className={`text-[10px] xs:text-xs sm:text-sm font-medium text-${primaryColor}-700`}>{tech}</span>
        </div>
    );
};

const FeatureItem = ({ feature }) => (
    <li className={`flex items-start space-x-1.5 xs:space-x-2 p-1.5 xs:p-2 rounded-md hover:bg-${primaryColor}-50 transition-all duration-300`}>
        <Star className={`w-3.5 xs:w-4 h-3.5 xs:h-4 text-${primaryColor}-400 mt-0.5 xs:mt-1`} />
        <p className={`text-xs xs:text-sm sm:text-base text-${secondaryColor}-800`}>{feature}</p>
    </li>
);

const ProjectStats = ({ project }) => {
    const techStackCount = project?.TechStack?.length || 0;
    const featuresCount = project?.Features?.length || 0;

    return (
        <div className={`flex gap-4 xs:gap-6 p-3 xs:p-4 bg-white rounded-xl border border-${primaryColor}-200 shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-[240px] xs:max-w-xs mx-auto sm:mx-0 bg-gradient-to-br from-${primaryColor}-50 to-yellow-50`}>
            <div className="flex flex-col items-center">
                <Code2 className={`text-${primaryColor}-500 w-5 xs:w-6 h-5 xs:h-6 mb-1`} />
                <span className={`font-semibold text-${primaryColor}-700 text-base xs:text-lg`}>{techStackCount}</span>
                <span className={`text-[10px] xs:text-xs text-${primaryColor}-500`}>Tech</span>
            </div>
            <div className="flex flex-col items-center">
                <Layers className={`text-${primaryColor}-500 w-5 xs:w-6 h-5 xs:h-6 mb-1`} />
                <span className={`font-semibold text-${primaryColor}-700 text-base xs:text-lg`}>{featuresCount}</span>
                <span className={`text-[10px] xs:text-xs text-${primaryColor}-500`}>Features</span>
            </div>
        </div>
    );
};

const handleGithubClick = (githubLink) => {
    if (githubLink === "Private") {
        Swal.fire({
            icon: "info",
            title: "Source Code Private",
            text: "Maaf, source code untuk proyek ini bersifat privat.",
            confirmButtonText: "Mengerti",
            confirmButtonColor: "#F97316", // Warna tombol SweetAlert
            background: "#FFFFFF",
            color: "#1F2937",
            customClass: {
                popup: "rounded-xl shadow-2xl",
                title: "font-bold text-xl",
                content: "text-sm",
                confirmButton: "px-6 py-2 text-sm font-semibold rounded-lg",
            },
        });
        return false;
    }
    return true;
};

// --- Error Boundary Component ---
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={`min-h-screen flex items-center justify-center bg-${primaryColor}-50`}>
                    <div className="text-center space-y-4">
                        <h2 className={`text-lg font-semibold text-${primaryColor}-600`}>Something went wrong!</h2>
                        <p className={`text-sm text-${secondaryColor}-500`}>{this.state.error?.message || "Unknown error"}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className={`px-4 py-2 bg-${primaryColor}-500 text-white rounded-lg hover:bg-${primaryColor}-600 transition-colors duration-300`}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// --- Komponen Utama ProjectDetails ---
const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0); // Gulir ke atas saat komponen dimuat
        const unsubscribe = onSnapshot(
            doc(db, "projects", id),
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("Fetched project data:", data); // Debugging
                    const enhancedProject = {
                        ...data,
                        Features: data.Features || [],
                        TechStack: data.TechStack || [],
                        Github: data.Github || "https://github.com/nugraa21", // Default jika tidak ada
                        Link: data.Link || null, // Pastikan Link adalah null jika undefined
                    };
                    setProject(enhancedProject);
                } else {
                    console.warn("Project not found for ID:", id);
                    setError("Project not found");
                    setProject(null);
                }
            },
            (error) => {
                console.error("Error fetching project:", error.message);
                setError(error.message);
                setProject(null);
            }
        );

        return () => unsubscribe(); // Cleanup subscription
    }, [id]);

    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center bg-${primaryColor}-50`}>
                <div className="text-center space-y-4">
                    <h2 className={`text-lg font-semibold text-${primaryColor}-600`}>Error</h2>
                    <p className={`text-sm text-${secondaryColor}-500`}>{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className={`px-4 py-2 bg-${primaryColor}-500 text-white rounded-lg hover:bg-${primaryColor}-600 transition-colors duration-300`}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className={`min-h-screen flex items-center justify-center bg-${primaryColor}-50`}>
                <div className="text-center space-y-4 animate-pulse">
                    <div className={`w-12 h-12 mx-auto border-4 border-${primaryColor}-300 border-t-${primaryColor}-500 rounded-full animate-spin`} />
                    <h2 className={`text-base xs:text-lg font-semibold text-${primaryColor}-600`}>Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <section className={`min-h-screen px-2 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-16 xs:py-20 sm:py-24 bg-${primaryColor}-50 overflow-x-hidden`}>
                <div className="max-w-7xl w-full mx-auto rounded-2xl bg-white shadow-xl p-6 xs:p-8 sm:p-10 md:p-12 animate-slide-in-up">
                    {/* Header Bagian Atas: Tombol Kembali & Breadcrumb */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 xs:mb-8 sm:mb-10 gap-4 sm:gap-0">
                        <button
                            onClick={() => navigate(-1)}
                            className={`inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 rounded-lg border-2 border-${primaryColor}-300 text-${primaryColor}-600 font-semibold text-xs xs:text-sm hover:bg-${primaryColor}-500 hover:text-white hover:border-${primaryColor}-500 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95`}
                            aria-label="Back to Portfolio"
                        >
                            <ArrowLeft className="w-4 xs:w-5 h-4 xs:h-5" />
                            <span>Back</span>
                        </button>
                        <div className={`text-xs xs:text-sm text-${primaryColor}-400 flex items-center gap-1 sm:gap-1.5 truncate max-w-[160px] xs:max-w-[180px] sm:max-w-[240px]`}>
                            <span>Projects</span>
                            <ChevronRight className="w-3 xs:w-4 h-3 xs:h-4" />
                            <span className="font-semibold truncate">{project.Title || "Untitled"}</span>
                        </div>
                    </div>

                    {/* Konten Utama: Grid 2 Kolom */}
                    <div className="grid lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 md:gap-12">
                        {/* Kolom Kiri: Detail Proyek, Deskripsi, Stats, Tombol, Teknologi */}
                        <div className="flex flex-col gap-4 xs:gap-6 sm:gap-8">
                            <h1 className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-${primaryColor}-700 tracking-tight`}>
                                {project.Title || "Untitled Project"}
                            </h1>
                            <p className={`text-sm xs:text-base sm:text-lg text-${secondaryColor}-700 leading-relaxed`}>
                                {project.Description || "No description available."}
                            </p>

                            <ProjectStats project={project} />

                            {/* Bagian Tombol Aksi */}
                            <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4">
                                {project.Link && (
                                    <a
                                        href={project.Link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 bg-gradient-to-r from-${primaryColor}-500 to-yellow-400 text-white rounded-lg font-semibold text-xs xs:text-sm hover:from-${primaryColor}-600 hover:to-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95`}
                                        aria-label="Live Demo"
                                    >
                                        <ExternalLink className="w-4 xs:w-4.5 sm:w-5 h-4 xs:h-4.5 sm:h-5" />
                                        Kunjungi
                                    </a>
                                )}
                                <a
                                    href={project.Github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 bg-white border-2 border-${primaryColor}-500 text-${primaryColor}-600 rounded-lg font-semibold text-xs xs:text-sm hover:bg-${primaryColor}-500 hover:text-white hover:border-${primaryColor}-500 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95`}
                                    onClick={(e) => !handleGithubClick(project.Github) && e.preventDefault()}
                                    aria-label="Github Repository"
                                >
                                    <Github className="w-4 xs:w-4.5 sm:w-5 h-4 xs:h-4.5 sm:h-5" />
                                    Github
                                </a>
                            </div>

                            {/* Bagian Teknologi yang Digunakan */}
                            <div>
                                <h3 className={`text-lg xs:text-xl sm:text-2xl font-semibold text-${primaryColor}-700 mt-6 xs:mt-8 mb-3 xs:mb-4 flex items-center gap-1.5 xs:gap-2`}>
                                    <Code2 className="w-5 xs:w-6 h-5 xs:h-6" />
                                    Technologies Used
                                </h3>
                                {project.TechStack.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5 xs:gap-2 sm:gap-3">
                                        {project.TechStack.map((tech, i) => (
                                            <TechBadge key={i} tech={tech} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className={`text-${secondaryColor}-500 italic text-xs xs:text-sm`}>No technologies added.</p>
                                )}
                            </div>
                        </div>

                        {/* Kolom Kanan: Gambar Proyek & Fitur Utama */}
                        <div className="flex flex-col gap-6 xs:gap-8 sm:gap-10">
                            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-md group">
                                <img
                                    src={project.Img || "/fallback.png"}
                                    alt={project.Title || "Project Image"}
                                    className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                    onError={(e) => (e.currentTarget.src = "/fallback.png")}
                                />
                                <div className={`absolute inset-0 bg-${primaryColor}-600/10 group-hover:bg-${primaryColor}-600/20 transition-all duration-500 pointer-events-none`} />
                            </div>

                            {/* Bagian Fitur Utama */}
                            <div>
                                <h3 className={`text-lg xs:text-xl sm:text-2xl font-semibold text-${primaryColor}-700 mb-3 xs:mb-4 flex items-center gap-1.5 xs:gap-2`}>
                                    <Star className="w-5 xs:w-6 h-5 xs:h-6 text-orange-500" /> {/* Ikon bintang untuk fitur */}
                                    Key Features
                                </h3>
                                {project.Features.length > 0 ? (
                                    <ul className="space-y-2 xs:space-y-3">
                                        {project.Features.map((feature, i) => (
                                            <FeatureItem key={i} feature={feature} />
                                        ))}
                                    </ul>
                                ) : (
                                    <p className={`text-${secondaryColor}-500 italic text-xs xs:text-sm`}>No features added.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gaya CSS untuk Animasi */}
                <style jsx>{`
                    .animate-slide-in-up {
                        animation: slideInUp 0.6s ease-out;
                    }
                    @keyframes slideInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </section>
        </ErrorBoundary>
    );
};

export default ProjectDetails;