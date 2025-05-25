import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Github, Code2, Star,
  ChevronRight, Layers, Layout, Globe, Package, Cpu, Code,
} from "lucide-react";
import Swal from "sweetalert2";
import data from "../data.json";

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
  
  return (
    <div className="px-3 py-1.5 bg-white rounded-lg border border-orange-200 hover:bg-orange-100 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 hover:-translate-y-0.5">
      <div className="flex items-center gap-1.5">
        <Icon className="w-4 h-4 text-orange-500" />
        <span className="text-xs sm:text-sm font-medium text-gray-800">{tech}</span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => {
  return (
    <li className="flex items-start space-x-2 p-2 rounded-md hover:bg-orange-50 transition-all duration-300 hover:scale-102">
      <Star className="w-4 h-4 text-orange-500 mt-0.5" />
      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
    </li>
  );
};

const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
      <div className="flex items-center gap-2 bg-orange-50 p-2 rounded-md">
        <div className="bg-orange-100 p-1.5 rounded-full">
          <Code2 className="text-orange-500 w-4 sm:w-5 h-4 sm:h-5" strokeWidth={1.5} />
        </div>
        <div>
          <div className="text-base sm:text-lg font-semibold text-gray-800">{techStackCount}</div>
          <div className="text-xs text-gray-500">Tech</div>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-orange-50 p-2 rounded-md">
        <div className="bg-orange-100 p-1.5 rounded-full">
          <Layers className="text-orange-500 w-4 sm:w-5 h-4 sm:h-5" strokeWidth={1.5} />
        </div>
        <div>
          <div className="text-base sm:text-lg font-semibold text-gray-800">{featuresCount}</div>
          <div className="text-xs text-gray-500">Fitur</div>
        </div>
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
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 mx-auto border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <h2 className="text-lg font-semibold text-gray-800">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8 sm:py-12 relative overflow-hidden">
      {/* Background Grid and Blur Circles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute top-10 left-10 w-48 sm:w-64 h-48 sm:h-64 bg-orange-300 rounded-full filter blur-[80px] opacity-30 animate-pulse-slow" />
        <div className="absolute top-1/2 right-10 w-48 sm:w-64 h-48 sm:h-64 bg-gray-300 rounded-full filter blur-[80px] opacity-30 animate-pulse-slow animation-delay-2000" />
        <div className="absolute bottom-10 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-orange-200 rounded-full filter blur-[80px] opacity-30 animate-pulse-slow animation-delay-4000" />
      </div>

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8 animate-slide-in-left">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-transparent border border-orange-300 text-gray-800 rounded-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 hover:animate-pulse-micro"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>Projects</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 truncate max-w-[150px] sm:max-w-none">{project.Title}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-xl transform hover:-translate-y-1 hover:scale-105 hover:rotate-0.5 transition-all duration-300 animate-slide-in-left" style={{ animationDelay: "0.4s" }}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 text-center lg:text-left">{project.Title}</h1>
              <div className="h-1 w-20 bg-orange-500 rounded-full mx-auto lg:mx-0 mt-2" />
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-4 text-center lg:text-left">{project.Description}</p>
            </div>

            <ProjectStats project={project} />

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <a
                href={project.Link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 sm:px-6 py-2 bg-transparent border border-orange-300 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 hover:animate-pulse-micro"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
              <a
                href={project.Github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 sm:px-6 py-2 bg-transparent border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 hover:animate-pulse-micro"
                onClick={(e) => !handleGithubClick(project.Github) && e.preventDefault()}
              >
                <Github className="w-4 h-4" />
                <span>Github</span>
              </a>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-xl transform hover:-translate-y-1 hover:scale-105 hover:rotate-0.5 transition-all duration-300 animate-slide-in-left" style={{ animationDelay: "0.6s" }}>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <Code2 className="w-4 h-4 text-orange-500" />
                Technologies Used
              </h3>
              {project.TechStack.length > 0 ? (
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {project.TechStack.map((tech, index) => (
                    <TechBadge key={index} tech={tech} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center lg:text-left">No technologies added.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden border border-orange-200 shadow-xl group animate-slide-in-right" style={{ animationDelay: "0.4s" }}>
              <img
                src={project.Img}
                alt={project.Title}
                className="w-full object-cover h-48 sm:h-64 transform transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2"
                onLoad={() => setIsImageLoaded(true)}
              />
              <div className="absolute inset-0 border-2 border-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-xl transform hover:-translate-y-1 hover:scale-105 hover:rotate-0.5 transition-all duration-300 animate-slide-in-right" style={{ animationDelay: "0.6s" }}>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-orange-500" />
                Key Features
              </h3>
              {project.Features.length > 0 ? (
                <ul className="list-none space-y-2">
                  {project.Features.map((feature, index) => (
                    <FeatureItem key={index} feature={feature} />
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center lg:text-left">No features added.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.7s ease-out;
        }
        .animate-pulse-slow {
          animation: pulseSlow 8s ease-in-out infinite;
        }
        .animate-pulse-micro {
          animation: pulseMicro 0.3s ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseSlow {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.3; }
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

export default ProjectDetails;