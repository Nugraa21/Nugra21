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
import data from "../data.json";

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
        <Box sx={{ p: { xs: 2, sm: 3, md: 5 } }}>
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
      duration: 1000,
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

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 mt-12 rounded-3xl bg-transparent"
      id="Portofolio"
    >
      <style>
        {`
          @keyframes slideIn {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes glowPulse {
            0% { box-shadow: 0 0 5px rgba(251, 146, 60, 0.3); }
            50% { box-shadow: 0 0 15px rgba(251, 146, 60, 0.6); }
            100% { box-shadow: 0 0 5px rgba(251, 146, 60, 0.3); }
          }
          @keyframes iconBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          .animate-slide-in {
            animation: slideIn 1s ease-out-cubic forwards;
          }
          .animate-glow-pulse {
            animation: glowPulse 2s ease-in-out infinite;
          }
          .tab-transition {
            transition: all 0.3s ease;
          }
          .icon-hover {
            transition: transform 0.2s ease;
          }
          .icon-hover:hover {
            animation: iconBounce 0.4s ease;
          }
          .main-tabs, .sub-tabs {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(251, 146, 60, 0.3);
            border-radius: 16px;
          }
          .sub-tabs-disabled {
            opacity: 0.5;
            pointer-events: none;
          }
          .show-all-button {
            background: linear-gradient(45deg, #F97316, #FB9235);
            box-shadow: 0 4px 15px rgba(251, 146, 60, 0.4);
            transition: all 0.3s ease;
          }
          .show-all-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(251, 146, 60, 0.5);
          }
          @media (max-width: 640px) {
            .main-tabs {
              flex-direction: column;
              align-items: stretch;
            }
            .main-tabs .MuiTab-root {
              padding: 10px;
              font-size: 0.875rem;
            }
            .sub-tabs .MuiTab-root {
              padding: 8px 10px;
              font-size: 0.75rem;
              min-width: 70px;
            }
            .show-all-button {
              padding: 6px 12px;
              font-size: 0.75rem;
            }
          }
        `}
      </style>
      <div
        className="text-center pb-8"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <h2 className="inline-block text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 tracking-tight">
          Portfolio Showcase
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg md:text-xl mt-3 font-medium">
          Discover my projects, certifications, and technical expertise.
        </p>
      </div>

      <Box sx={{ width: "100%", bgcolor: "transparent" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            borderRadius: "16px",
            px: { xs: 2, sm: 3, md: 4 },
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
                height: 4,
                borderRadius: "4px 4px 0 0",
              },
              "& .MuiTabs-flexContainer": {
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1,
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
                    className="w-5 h-5 sm:w-6 sm:h-6 mb-1.5 text-gray-800 icon-hover"
                  />
                }
                label={tab.label}
                {...a11yProps(index)}
                className="tab-transition text-gray-900 font-bold text-sm sm:text-base md:text-lg capitalize group hover:text-orange-600 hover:bg-orange-200/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-xl animate-slide-in"
                sx={{
                  "&.Mui-selected": {
                    color: "#F97316",
                    backgroundColor: "rgba(251, 146, 60, 0.2)",
                    "& .lucide": { color: "#F97316" },
                  },
                  minWidth: { xs: "90px", sm: "120px" },
                  padding: { xs: "8px", sm: "10px 16px" },
                  borderRadius: "12px",
                }}
              />
            ))}
          </Tabs>
        </AppBar>

        {/* Projects Tab */}
        <TabPanel value={value} index={0} dir={theme.direction}>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-6">
            {value === 0 && (
              <>
                <AppBar
                  position="static"
                  elevation={0}
                  sx={{
                    bgcolor: "transparent",
                    borderRadius: "12px",
                    px: { xs: 1, sm: 2 },
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
                    {projectCategories.map((category, index) => (
                      <Tab
                        key={index}
                        label={category}
                        className="tab-transition text-gray-900 font-semibold text-sm sm:text-base capitalize hover:text-orange-600 hover:bg-orange-200/20 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg animate-slide-in animate-glow-pulse"
                        sx={{
                          "&.Mui-selected": {
                            color: "#F97316",
                            backgroundColor: "rgba(251, 146, 60, 0.2)",
                          },
                          minWidth: { xs: "70px", sm: "90px" },
                          padding: { xs: "6px 8px", sm: "8px 12px" },
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
                  className="show-all-button px-4 py-2 sm:px-5 sm:py-2.5 text-white font-semibold text-sm sm:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-transform duration-300 animate-glow-pulse"
                  aria-label={showAllProjects ? "Sembunyikan proyek" : "Tampilkan semua proyek"}
                >
                  {showAllProjects ? "Sembunyikan" : `Semua (${projects.length})`}
                </button>
              </>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {(showAllProjects
              ? projects
              : projects
                  .filter(
                    (p) =>
                      projectCategoryValue === 0 ||
                      p.category === projectCategories[projectCategoryValue]
                  )
                  .slice(0, DEFAULT_DISPLAY_COUNT)
            ).map((project, i) => (
              <div
                key={project.id}
                data-aos="zoom-in-up"
                data-aos-duration="800"
                data-aos-delay={i * 150}
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
          <div className="flex justify-center mb-6">
            {value === 1 && (
              <button
                onClick={() => setShowAllCertificates(!showAllCertificates)}
                className="show-all-button px-4 py-2 sm:px-5 sm:py-2.5 text-white font-semibold text-sm sm:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-transform duration-300 animate-glow-pulse"
                aria-label={showAllCertificates ? "Sembunyikan sertifikat" : "Tampilkan semua sertifikat"}
              >
                {showAllCertificates ? "Sembunyikan" : `Semua (${certificates.length})`}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {(showAllCertificates
              ? certificates
              : certificates.slice(0, DEFAULT_DISPLAY_COUNT)
            ).map((certificate, i) => (
              <div
                key={i}
                data-aos="zoom-in-up"
                data-aos-duration="800"
                data-aos-delay={i * 150}
              >
                <Certificate ImgSertif={certificate.Img} />
              </div>
            ))}
          </div>
        </TabPanel>

        {/* Tech Stack Tab */}
        <TabPanel value={value} index={2} dir={theme.direction}>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-6">
            {value === 2 && (
              <>
                <AppBar
                  position="static"
                  elevation={0}
                  sx={{
                    bgcolor: "transparent",
                    borderRadius: "12px",
                    px: { xs: 1, sm: 2 },
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
                    {["Code", "Programs", "Tools", "Software"].map((category, index) => (
                      <Tab
                        key={index}
                        label={category}
                        className="tab-transition text-gray-900 font-semibold text-sm sm:text-base capitalize hover:text-orange-600 hover:bg-orange-200/20 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg animate-slide-in animate-glow-pulse"
                        sx={{
                          "&.Mui-selected": {
                            color: "#F97316",
                            backgroundColor: "rgba(251, 146, 60, 0.2)",
                          },
                          minWidth: { xs: "70px", sm: "90px" },
                          padding: { xs: "6px 8px", sm: "8px 12px" },
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
                  className="show-all-button px-4 py-2 sm:px-5 sm:py-2.5 text-white font-semibold text-sm sm:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-transform duration-300 animate-glow-pulse"
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
                data-aos-delay={i * 150}
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
  );
}