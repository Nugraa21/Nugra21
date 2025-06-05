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
import { Helmet } from "react-helmet";
import data from "../data/data.json";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
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
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

const techStacks = {
  Code: [
    { icon: "material-icon-theme--dart.svg", language: "Dart" },
    { icon: "html.svg", language: "HTML" },
    { icon: "css.svg", language: "CSS" },
    { icon: "javascript.svg", language: "JavaScript" },
    { icon: "devicon--latex.svg", language: "LaTeX" },
    { icon: "material-icon-theme--python.svg", language: "Python" },
    { icon: "reactjs.svg", language: "ReactJS" },
    { icon: "logos--vue.svg", language: "Vue" },
    { icon: "devicon--php.svg", language: "PHP" },
  ],
  Programs: [
    { icon: "devicon--flutter.svg", language: "Flutter" },
    { icon: "nodejs.svg", language: "Node JS" },
  ],
  Tools: [
    { icon: "logos--github-icon.svg", language: "GitHub" },
    { icon: "vercel.svg", language: "Vercel" },
    { icon: "devicon--firebase.svg", language: "Firebase" },
  ],
  Software: [
    { icon: "logos--adobe-illustrator.svg", language: "Adobe Illustrator" },
    { icon: "logos--adobe-premiere.svg", language: "Adobe Premiere Pro" },
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
      once: true,
      duration: 600,
      easing: "ease-out-quad",
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
    if (!showAllTechStacks) setTechStackValue(newValue);
  };

  const handleProjectCategoryChange = (event, newValue) => {
    if (!showAllProjects) setProjectCategoryValue(newValue);
  };

  const projectCategories = ["All", "Project", "Materi", "Web", "Game", "Ilustrasi"];
  const DEFAULT_DISPLAY_COUNT = 6;

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
        <meta
          name="description"
          content="Explore Ludang Prasetyo Nugroho's projects, certifications, and tech skills."
        />
        <meta
          name="keywords"
          content="Ludang Prasetyo, Nugra21, Portfolio, Projects, Certifications, Tech Stack"
        />
        <meta property="og:title" content="Portfolio – Nugra.my.id" />
        <meta
          property="og:description"
          content="Explore Ludang Prasetyo Nugroho's projects, certifications, and tech skills."
        />
        <meta property="og:url" content="https://nugra.my.id/portfolio" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nugra.my.id/portfolio" />
      </Helmet>

      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mt-10 rounded-2xl"
        id="Portfolio"
      >
        <style>
          {`
            @keyframes fadeIn {
              0% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .glass-bg {
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(12px);
              border-radius: 16px;
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .tab-transition {
              transition: all 0.3s ease;
            }
            .tab-transition:hover {
              color: #F97316;
              transform: translateY(-2px);
            }
            .show-all-btn {
              background: linear-gradient(45deg, #F97316, #FB923C);
              color: white;
              padding: 8px 16px;
              border-radius: 8px;
              font-weight: 600;
              transition: all 0.3s ease;
            }
            .show-all-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(251, 146, 60, 0.4);
            }
            .main-tabs, .sub-tabs {
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(12px);
              border-radius: 12px;
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .sub-tabs-disabled {
              opacity: 0.6;
              pointer-events: none;
            }
            @media (max-width: 640px) {
              .main-tabs .MuiTab-root {
                font-size: 0.8rem;
                padding: 6px 10px;
              }
              .sub-tabs .MuiTab-root {
                font-size: 0.75rem;
                padding: 5px 8px;
              }
              .show-all-btn {
                padding: 6px 12px;
                font-size: 0.8rem;
              }
            }
          `}
        </style>

        <div className="glass-bg text-center py-6" data-aos="fadeIn">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
            Portfolio
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-md mx-auto">
            Discover my projects, certifications, and technical expertise.
          </p>
        </div>

        <Box sx={{ width: "100%", mt: 4 }}>
          <AppBar
            position="static"
            elevation={0}
            sx={{ bgcolor: "transparent", borderRadius: "12px" }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              className="main-tabs"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#F97316",
                  height: 2,
                  borderRadius: "2px",
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
                      className="w-5 h-5 mb-1 text-gray-600 tab-transition"
                    />
                  }
                  label={tab.label}
                  {...a11yProps(index)}
                  className="tab-transition text-gray-600 font-medium text-sm sm:text-base capitalize"
                  sx={{
                    "&.Mui-selected": {
                      color: "#F97316",
                      "& .lucide": { color: "#F97316" },
                    },
                    padding: { xs: "8px 10px", sm: "10px 12px" },
                  }}
                />
              ))}
            </Tabs>
          </AppBar>

          {/* Projects Tab */}
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="flex justify-center gap-3 mb-6">
              {value === 0 && (
                <>
                  <AppBar
                    position="static"
                    elevation={0}
                    sx={{ bgcolor: "transparent", width: "fit-content" }}
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
                        },
                      }}
                    >
                      {projectCategories.map((category, index) => (
                        <Tab
                          key={index}
                          label={category}
                          className="tab-transition text-gray-600 font-medium text-xs sm:text-sm capitalize"
                          sx={{
                            "&.Mui-selected": { color: "#F97316" },
                            padding: { xs: "6px 8px", sm: "8px 12px" },
                          }}
                          {...a11yProps(index)}
                          disabled={showAllProjects}
                        />
                      ))}
                    </Tabs>
                  </AppBar>
                  <button
                    onClick={() => setShowAllProjects(!showAllProjects)}
                    className="show-all-btn"
                    aria-label={showAllProjects ? "Hide projects" : "Show all projects"}
                  >
                    {showAllProjects ? "Hide" : `All (${filteredProjects.length})`}
                  </button>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, i) => (
                <div key={project.id} data-aos="fade-up" data-aos-delay={i * 100}>
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
                  className="show-all-btn"
                  aria-label={showAllCertificates ? "Hide certificates" : "Show all certificates"}
                >
                  {showAllCertificates ? "Hide" : `All (${certificates.length})`}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showAllCertificates
                ? certificates
                : certificates.slice(0, DEFAULT_DISPLAY_COUNT)
              ).map((certificate, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                  <Certificate
                    ImgSertif={certificate.Img}
                    title={certificate.title}
                    description={certificate.description}
                    issuer={certificate.issuer}
                    date={certificate.date}
                  />
                </div>
              ))}
            </div>
          </TabPanel>

          {/* Tech Stack Tab */}
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="flex justify-center gap-3 mb-6">
              {value === 2 && (
                <>
                  <AppBar
                    position="static"
                    elevation={0}
                    sx={{ bgcolor: "transparent", width: "fit-content" }}
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
                        },
                      }}
                    >
                      {["Code", "Programs", "Tools", "Software"].map((category, index) => (
                        <Tab
                          key={index}
                          label={category}
                          className="tab-transition text-gray-600 font-medium text-xs sm:text-sm capitalize"
                          sx={{
                            "&.Mui-selected": { color: "#F97316" },
                            padding: { xs: "6px 8px", sm: "8px 12px" },
                          }}
                          {...a11yProps(index)}
                          disabled={showAllTechStacks}
                        />
                      ))}
                    </Tabs>
                  </AppBar>
                  <button
                    onClick={() => setShowAllTechStacks(!showAllTechStacks)}
                    className="show-all-btn"
                    aria-label={showAllTechStacks ? "Hide tech stack" : "Show all tech stack"}
                  >
                    {showAllTechStacks ? "Hide" : `All (${Object.values(techStacks).flat().length})`}
                  </button>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {(showAllTechStacks
                ? Object.values(techStacks).flat()
                : techStacks[Object.keys(techStacks)[techStackValue]]
              ).map((stack, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 100}>
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