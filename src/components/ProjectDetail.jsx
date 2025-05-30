import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Github, Code2, Star,
  ChevronRight, Layers,
} from "lucide-react";
import Swal from "sweetalert2";
import data from "../data/data.json";

const TECH_ICONS = {
  React: Code2,
  Tailwind: Code2,
  Express: Code2,
  Python: Code2,
  Javascript: Code2,
  HTML: Code2,
  CSS: Code2,
  default: Code2,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
  return (
    <div className="px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 bg-orange-100 rounded-lg border border-orange-200 hover:bg-orange-200 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 cursor-default flex items-center gap-1 xs:gap-1.5">
      <Icon className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-orange-500" />
      <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-orange-700">{tech}</span>
    </div>
  );
};

const FeatureItem = ({ feature }) => (
  <li className="flex items-start space-x-1.5 xs:space-x-2 p-1.5 xs:p-2 rounded-md hover:bg-orange-50 transition-all duration-300">
    <Star className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-orange-400 mt-0.5 xs:mt-1" />
    <p className="text-xs xs:text-sm sm:text-base text-gray-800">{feature}</p>
  </li>
);

const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="flex gap-4 xs:gap-6 p-3 xs:p-4 bg-white rounded-xl border border-orange-200 shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-[240px] xs:max-w-xs mx-auto sm:mx-0 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="flex flex-col items-center">
        <Code2 className="text-orange-500 w-5 xs:w-6 h-5 xs:h-6 mb-1" />
        <span className="font-semibold text-orange-700 text-base xs:text-lg">{techStackCount}</span>
        <span className="text-[10px] xs:text-xs text-orange-500">Tech</span>
      </div>
      <div className="flex flex-col items-center">
        <Layers className="text-orange-500 w-5 xs:w-6 h-5 xs:h-6 mb-1" />
        <span className="font-semibold text-orange-700 text-base xs:text-lg">{featuresCount}</span>
        <span className="text-[10px] xs:text-xs text-orange-500">Features</span>
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
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const selectedProject = data.projects.find((p) => String(p.id) === id);

    if (selectedProject) {
      const enhancedProject = {
        ...selectedProject,
        Features: selectedProject.Features || [],
        TechStack: selectedProject.TechStack || [],
        Github: selectedProject.Github || "https://github.com/nugraa21",
      };
      setProject(enhancedProject);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 mx-auto border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin" />
          <h2 className="text-base xs:text-lg font-semibold text-orange-600">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen px-2 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-16 xs:py-20 sm:py-24 bg-orange-50 overflow-x-hidden">
      <div className="max-w-7xl w-full mx-auto rounded-2xl p-6 xs:p-8 sm:p-10 md:p-12 animate-slide-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 xs:mb-8 sm:mb-10 gap-4 sm:gap-0">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 rounded-lg border-2 border-orange-300 text-orange-600 font-semibold text-xs xs:text-sm hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
            aria-label="Back to Portfolio"
          >
            <ArrowLeft className="w-4 xs:w-5 h-4 xs:h-5" />
            <span>Back</span>
          </button>
          <div className="text-xs xs:text-sm text-orange-400 flex items-center gap-1 sm:gap-1.5 truncate max-w-[160px] xs:max-w-[180px] sm:max-w-[240px]">
            <span>Projects</span>
            <ChevronRight className="w-3 xs:w-4 h-3 xs:h-4" />
            <span className="font-semibold truncate">{project.Title}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 md:gap-12">
          {/* Left Content */}
          <div className="flex flex-col gap-4 xs:gap-6 sm:gap-8">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-orange-600 tracking-tight">
              {project.Title}
            </h1>
            <p className="text-sm xs:text-base sm:text-lg text-gray-700 leading-relaxed">
              {project.Description}
            </p>

            <ProjectStats project={project} />

            <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4">
              <a
                href={project.Link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-semibold text-xs xs:text-sm hover:from-orange-600 hover:to-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                aria-label="Live Demo"
              >
                <ExternalLink className="w-4 xs:w-4.5 sm:w-5 h-4 xs:h-4.5 sm:h-5" />
                Live Demo
              </a>
              <a
                href={project.Github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 bg-white border-2 border-orange-500 text-orange-600 rounded-lg font-semibold text-xs xs:text-sm hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                onClick={(e) => !handleGithubClick(project.Github) && e.preventDefault()}
                aria-label="Github Repository"
              >
                <Github className="w-4 xs:w-4.5 sm:w-5 h-4 xs:h-4.5 sm:h-5" />
                Github
              </a>
            </div>

            <div>
              <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-orange-600 mt-6 xs:mt-8 mb-3 xs:mb-4 flex items-center gap-1.5 xs:gap-2">
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
                <p className="text-gray-500 italic text-xs xs:text-sm">No technologies added.</p>
              )}
            </div>
          </div>

          {/* Right Content */}
          <div className="flex flex-col gap-6 xs:gap-8 sm:gap-10">
            <div className="relative rounded-xl overflow-hidden border border-orange-200 shadow-lg group">
              <img
                src={project.Img}
                alt={project.Title}
                className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => (e.currentTarget.src = "/fallback.png")}
              />
              <div className="absolute inset-0 bg-orange-600/10 group-hover:bg-orange-600/20 transition-all duration-500 pointer-events-none" />
            </div>

            <div>
              <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-orange-600 mb-3 xs:mb-4 flex items-center gap-1.5 xs:gap-2">
                <Star className="w-5 xs:w-6 h-5 xs:h-6" />
                Key Features
              </h3>
              {project.Features.length > 0 ? (
                <ul className="space-y-2 xs:space-y-3">
                  {project.Features.map((feature, i) => (
                    <FeatureItem key={i} feature={feature} />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic text-xs xs:text-sm">No features added.</p>
              )}
            </div>
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
      `}</style>
    </section>
  );
};

export default ProjectDetails;