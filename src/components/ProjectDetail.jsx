import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Github, Code2, Star,
  ChevronRight, Layers,
} from "lucide-react";
import Swal from "sweetalert2";
import data from "../data.json";

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
    <div className="px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-300 hover:bg-orange-100 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 cursor-default flex items-center gap-1.5">
      <Icon className="w-4 h-4 text-orange-500" />
      <span className="text-xs sm:text-sm font-medium text-orange-700">{tech}</span>
    </div>
  );
};

const FeatureItem = ({ feature }) => (
  <li className="flex items-start space-x-2 p-2 rounded-md hover:bg-orange-100 transition-all duration-300">
    <Star className="w-4 h-4 text-orange-400 mt-1" />
    <p className="text-sm sm:text-base text-gray-800">{feature}</p>
  </li>
);

const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="flex gap-6 p-4 bg-orange-50 rounded-lg border border-orange-200 shadow-md w-full max-w-xs justify-around mx-auto sm:mx-0">
      <div className="flex flex-col items-center">
        <Code2 className="text-orange-500 w-6 h-6 mb-1" />
        <span className="font-semibold text-orange-700 text-lg">{techStackCount}</span>
        <span className="text-xs text-orange-500">Tech</span>
      </div>
      <div className="flex flex-col items-center">
        <Layers className="text-orange-500 w-6 h-6 mb-1" />
        <span className="font-semibold text-orange-700 text-lg">{featuresCount}</span>
        <span className="text-xs text-orange-500">Features</span>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 mx-auto border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin" />
          <h2 className="text-lg font-semibold text-orange-600">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full rounded-2xl p-8 sm:p-12 animate-fade-scale">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-orange-300 text-orange-600 hover:bg-orange-500 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="text-sm text-orange-400 flex items-center space-x-1 truncate max-w-[180px]">
            <span>Projects</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold">{project.Title}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left content */}
          <div className="flex flex-col justify-center gap-6">
            <h1 className="text-4xl font-extrabold text-orange-600">{project.Title}</h1>
            <p className="text-lg text-gray-700 leading-relaxed">{project.Description}</p>

            <ProjectStats project={project} />

            <div className="flex flex-wrap gap-3 mt-4">
              <a
                href={project.Link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-orange-100 text-orange-700 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition"
              >
                <ExternalLink className="w-5 h-5" />
                Live Demo
              </a>
              <a
                href={project.Github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition"
                onClick={(e) => !handleGithubClick(project.Github) && e.preventDefault()}
              >
                <Github className="w-5 h-5" />
                Github
              </a>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-orange-600 mt-8 mb-4 flex items-center gap-2">
                <Code2 className="w-6 h-6" />
                Technologies Used
              </h3>
              {project.TechStack.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.TechStack.map((tech, i) => (
                    <TechBadge key={i} tech={tech} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No technologies added.</p>
              )}
            </div>
          </div>

          {/* Right content */}
          <div className="flex flex-col gap-8">
            <div className="relative rounded-xl overflow-hidden border border-orange-300 shadow-lg">
              <img
                src={project.Img}
                alt={project.Title}
                className="w-full aspect-[16/9] object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6" />
                Key Features
              </h3>
              {project.Features.length > 0 ? (
                <ul className="space-y-3 list-disc list-inside text-gray-800">
                  {project.Features.map((feature, i) => (
                    <FeatureItem key={i} feature={feature} />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No features added.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-scale {
          animation: fadeScale 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
