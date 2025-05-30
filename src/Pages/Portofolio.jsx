import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet"; // Impor react-helmet
import data from "../data/data.json";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const techStacks = {
  Code: [
    { icon: "html.svg", language: "HTML" },
    { icon: "css.svg", language: "CSS" },
    { icon: "javascript.svg", language: "JavaScript" },
    { icon: "reactjs.svg", language: "ReactJS" },
    { icon: "logos--vue.svg", language: "Vue" },
    { icon: "material-icon-theme--python.svg", language: "Python" },
    { icon: "material-icon-theme--dart.svg", language: "Dart" },
    { icon: "devicon--php.svg", language: "PHP" },
  ],
  Programs: [
    { icon: "nodejs.svg", language: "Node JS" },
    { icon: "devicon--flutter.svg", language: "Flutter" },
  ],
  Tools: [
    { icon: "logos--github-icon.svg", language: "GitHub" },
    { icon: "vercel.svg", language: "Vercel" },
    { icon: "material-icon-theme--docker.svg", language: "Docker" },
  ],
  Software: [
    { icon: "devicon--firebase.svg", language: "Firebase" },
    { icon: "devicon--latex.svg", language: "LaTeX" },
    { icon: "logos--adobe-illustrator.svg", language: "Adobe Illustrator" },
    { icon: "logos--adobe-premiere.svg", language: "Adobe Premier Pro" },
  ],
};

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [techStackValue, setTechStackValue] = useState(0);
  const [projectCategoryValue, setProjectCategoryValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [showAllTechStacks, setShowAllTechStacks] = useState(false);

  useEffect(() => {
    AOS.init({
      once: false,
      duration: 800,
      easing: "ease-out-cubic",
      mirror: true,
    });

    setProjects(data.projects || []);
    setCertificates(data.certificates || []);

    localStorage.setItem("projects", JSON.stringify(data.projects || []));
    localStorage.setItem("certificates", JSON.stringify(data.certificates || []));
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue !== 2) setTechStackValue(0);
    if (newValue !== 0) setProjectCategoryValue(0);
  };

  const handleTechStackChange = (event, newValue) => {
    if (!showAllTechStacks) {
      setTechStackValue(newValue);
    }
  };

  const handleProjectCategoryChange = (event, newValue) => {
    if (!showAllProjects) {
      setProjectCategoryValue(newValue);
    }
  };

  const projectCategories = ["All", "Project", "Materi", "Web", "Game", "Ilustrasi"];
  const DEFAULT_DISPLAY_COUNT = 6;

  // Filter projects based on the selected category
  const filteredProjects = showAllProjects
    ? projectCategoryValue === 0
      ? projects
      : projects.filter((p) => p.category === projectCategories[projectCategoryValue])
    : projects
        .filter(
          (p) =>
            projectCategoryValue === 0 ||
            p.category === projectCategories[projectCategoryValue]
        )
        .slice(0, DEFAULT_DISPLAY_COUNT);

  return (
    <>
      <Helmet>
        <title>Portfolio – Nugra.my.id</title>
        <meta name="description" content="Jelajahi proyek, sertifikasi, dan keahlian teknis Ludang Prasetyo Nugroho." />
        <meta name="keywords" content="Ludang Prasetyo, Nugra21, Portfolio, Proyek, Sertifikasi, Tech Stack, Web Developer" />
        <meta property="og:title" content="Portfolio – Nugra.my.id" />
        <meta property="og:description" content="Jelajahi proyek, sertifikasi, dan keahlian teknis Ludang Prasetyo Nugroho." />
        <meta property="og:url" content="https://nugra.my.id/portfolio" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nugra.my.id/portfolio" />
      </Helmet>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 mt-12 rounded-3xl bg-transparent"
        id="Portofolio"
      >
        <style>
          {`
            @keyframes slideIn {
              0% { transform: translateY(20px); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
            @keyframes glowPulse {
              0% { box-shadow: 0 0 5px rgba(251, 146, 60, 0.2); }
              50% { box-shadow: 0 0 10px rgba(251, 146, 60, 0.4); }
              100% { box-shadow: 0 0 5px rgba(251, 146, 60, 0.2); }
            }
            @keyframes iconBounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
            .animate-slide-in {
              animation: slideIn 0.8s	sigmasoft ease-out forwards;
            }
            .animate-glow-pulse {
              animation: glowPulse 2s ease-in-out infinite;
            }
            .tab-transition {
              transition: color 0.3s ease, transform 0.2s ease;
            }
            .icon-hover {
              transition: transform 0.2s ease;
            }
            .icon-hover:hover {
              animation: iconBounce 0.4s ease;
            }
            .main-tabs, .sub-tabs {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(10px);
              border: none;
              border-radius: 12px;
              padding: 4px;
            }
            .sub-tabs-disabled {
              opacity: 0.5;
              pointer-events: none;
            }
            .show-all-button {
              background: linear-gradient(45deg, #F97316, #FB9235);
              box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
              transition: all 0.3s ease;
              border-radius: 10px;
              padding: 8px 16px;
              font-size: 0.9rem;
              font-weight: 600;
            }
            .show-all-button:hover {
              transform: translateY(-1px);
              box-shadow: 0 6px 16px rgba(251, 146, 60, 0.5);
            }
            .portfolio-container {
              background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
              backdrop-filter: blur(8px);
              border-radius: 20px;
              padding: 1rem 1.5rem;
            }
            @media (max-width: 768px) {
              .main-tabs {
                flex-direction: column;
                align-items: stretch;
                gap: 8px;
              }
              .main-tabs .MuiTab-root {
                padding: 8px 12px;
                font-size: 0.85rem;
              }
              .sub-tabs .MuiTab-root {
                padding: 6px 10px;
                font-size: 0.8rem;
                min-width: 60px;
              }
              .show-all-button {
                padding: 6px 12px;
                font-size: 0.8rem;
              }
              .portfolio-container {
                padding: 0.75rem;
              }
            }
            @media (max-width: 480px) {
              .main-tabs .MuiTab-root {
                font-size: 0.75rem;
                padding: 6px 10px;
              }
              .sub-tabs .MuiTab-root {
                font-size: 0.7rem;
                padding: 5px 8px;
                min-width: 50px;
              }
              .show-all-button {
                padding: 5px 10px;
                font-size: 0.7rem;
              }
              .portfolio-container {
                padding: 0.5rem;
              }
            }
          `}
        </style>
        <div
          className="portfolio-container text-center py-6 sm:py-8"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <h2 className="inline-block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 tracking-tight">
            Portfolio Showcase
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base md:text-lg mt-2 sm:mt-3 font-medium">
            Explore my projects, certifications, and technical skills.
          </p>
        </div>

        <Box sx={{ width: "100%", bgcolor: "transparent", mt: 3 }}>
          <AppBar
            position="static"
            elevation={0}
            sx={{
              bgcolor: "transparent",
              borderRadius: "12px",
              px: { xs: 1, sm: 2, md: 3 },
              mb: 3,
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              className="main-tabs"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#F97316",
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
                "& .MuiTabs-flexContainer": {
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 0.5,
                },
              }}
            >
              {[
                { label: "Projects", icon: Code },
                { label: "Certificates", icon: Award },
                { label: "Tech Stack", icon: Boxes },
              ].map((tab, index) => (
                <Tab
                  key={tab.label}
                  icon={
                    <tab.icon
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mb-1 text-gray-700 icon-hover"
                    />
                  }
                  label={tab.label}
                  {...a11yProps(index)}
                  className="tab-transition text-gray-700 font-semibold text-xs sm:text-sm md:text-base capitalize hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg animate-slide-in"
                  sx={{
                    "&.Mui-selected": {
                      color: "#F97316",
                      "& .lucide": { color: "#F97316" },
                    },
                    minWidth: { xs: "80px", sm: "100px", md: "120px" },
                    padding: { xs: "6px 8px", sm: "8px 12px", md: "10px 16px" },
                    borderRadius: "10px",
                  }}
                />
              ))}
            </Tabs>
          </AppBar>

          {/* Projects Tab */}
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 md:gap-4 mb-5 sm:mb-6">
              {value === 0 && (
                <>
                  <AppBar
                    position="static"
                    elevation={0}
                    sx={{
                      bgcolor: "transparent",
                      borderRadius: "10px",
                      px: { xs: 0.5, sm: 1, md: 2 },
                      width: "fit-content",
                    }}
                  >
                    <Tabs
                      value={projectCategoryValue}
                      onChange={handleProjectCategoryChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                      className={`sub-tabs ${showAllProjects ? "sub-tabs-disabled" : ""}`}
                      sx={{
                        "& .MuiTabs-indicator": {
                          backgroundColor: "#F97316",
                          height: 2,
                          borderRadius: "2px 2px 0 0",
                        },
                        "& .MuiTabs-flexContainer": {
                          flexWrap: "wrap",
                          justifyContent: "center",
                          gap: 0.5,
                        },
                      }}
                    >
                      {projectCategories.map((category, index) => (
                        <Tab
                          key={index}
                          label={category}
                          className="tab-transition text-gray-700 font-medium text-xs sm:text-sm capitalize hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg animate-slide-in"
                          sx={{
                            "&.Mui-selected": {
                              color: "#F97316",
                            },
                            minWidth: { xs: "60px", sm: "80px", md: "90px" },
                            padding: { xs: "5px 6px", sm: "6px 8px", md: "8px 12px" },
                            borderRadius: "8px",
                          }}
                          {...a11yProps(index)}
                          disabled={showAllProjects}
                        />
                      ))}
                    </Tabs>
                  </AppBar>
                  <button
                    onClick={() => setShowAllProjects(!showAllProjects)}
                    className="show-all-button text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform duration-300 animate-glow-pulse"
                    aria-label={showAllProjects ? "Sembunyikan proyek" : "Tampilkan semua proyek"}
                  >
                    {showAllProjects ? "Sembunyikan" : `Semua (${filteredProjects.length})`}
                  </button>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {filteredProjects.map((project, i) => (
                <div
                  key={project.id}
                  data-aos="zoom-in-up"
                  data-aos-duration="800"
                  data-aos-delay={i * 100}
                >
                  <CardProject
                    Img={project.Img}
                    Title={project.Title}
                    Description={project.Description}
                    Link={project.Link}
                    id={project.id}
                  />
                </div>
              ))}
            </div>
          </TabPanel>

          {/* Certificates Tab */}
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="flex justify-center mb-5 sm:mb-6">
              {value === 1 && (
                <button
                  onClick={() => setShowAllCertificates(!showAllCertificates)}
                  className="show-all-button text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform duration-300 animate-glow-pulse"
                  aria-label={showAllCertificates ? "Sembunyikan sertifikat" : "Tampilkan semua sertifikat"}
                >
                  {showAllCertificates ? "Sembunyikan" : `Semua (${certificates.length})`}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {(showAllCertificates
                ? certificates
                : certificates.slice(0, DEFAULT_DISPLAY_COUNT)
              ).map((certificate, i) => (
                <div
                  key={i}
                  data-aos="zoom-in-up"
                  data-aos-duration="800"
                  data-aos-delay={i * 100}
                >
                  <Certificate ImgSertif={certificate.Img} />
                </div>
              ))}
            </div>
          </TabPanel>

          {/* Tech Stack Tab */}
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 md:gap-4 mb-5 sm:mb-6">
              {value === 2 && (
                <>
                  <AppBar
                    position="static"
                    elevation={0}
                    sx={{
                      bgcolor: "transparent",
                      borderRadius: "10px",
                      px: { xs: 0.5, sm: 1, md: 2 },
                      width: "fit-content",
                    }}
                  >
                    <Tabs
                      value={techStackValue}
                      onChange={handleTechStackChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                      className={`sub-tabs ${showAllTechStacks ? "sub-tabs-disabled" : ""}`}
                      sx={{
                        "& .MuiTabs-indicator": {
                          backgroundColor: "#F97316",
                          height: 2,
                          borderRadius: "2px 2px 0 0",
                        },
                        "& .MuiTabs-flexContainer": {
                          flexWrap: "wrap",
                          justifyContent: "center",
                          gap: 0.5,
                        },
                      }}
                    >
                      {["Code", "Programs", "Tools", "Software"].map((category, index) => (
                        <Tab
                          key={index}
                          label={category}
                          className="tab-transition text-gray-700 font-medium text-xs sm:text-sm capitalize hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg animate-slide-in"
                          sx={{
                            "&.Mui-selected": {
                              color: "#F97316",
                            },
                            minWidth: { xs: "60px", sm: "80px", md: "90px" },
                            padding: { xs: "5px 6px", sm: "6px 8px", md: "8px 12px" },
                            borderRadius: "8px",
                          }}
                          {...a11yProps(index)}
                          disabled={showAllTechStacks}
                        />
                      ))}
                    </Tabs>
                  </AppBar>
                  <button
                    onClick={() => setShowAllTechStacks(!showAllTechStacks)}
                    className="show-all-button text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform duration-300 animate-glow-pulse"
                    aria-label={showAllTechStacks ? "Sembunyikan tech stack" : "Tampilkan semua tech stack"}
                  >
                    {showAllTechStacks ? "Sembunyikan" : `Semua (${Object.values(techStacks).flat().length})`}
                  </button>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
              {(showAllTechStacks
                ? Object.values(techStacks).flat()
                : techStacks[Object.keys(techStacks)[techStackValue]]
              ).map((stack, i) => (
                <div
                  key={i}
                  data-aos="zoom-in"
                  data-aos-duration="800"
                  data-aos-delay={i * 100}
                >
                  <TechStackIcon
                    TechStackIcon={stack.icon}
                    Language={stack.language}
                  />
                </div>
              ))}
            </div>
          </TabPanel>
        </Box>
      </div>
    </>
  );
}