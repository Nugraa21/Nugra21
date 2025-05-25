import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";
import data from "../data.json";

// Komponen ToggleButton
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-4 py-2
      text-black 
      hover:text-orange-500 
      text-sm 
      font-medium 
      transition-all 
      duration-200 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-orange-100 
      hover:bg-orange-200
      rounded-lg
      border 
      border-orange-300
      hover:border-orange-400
      shadow-sm
      hover:shadow-md
    "
  >
    {isShowingMore ? "See Less" : "See More"}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${isShowingMore ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </button>
);

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
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography>{children}</Typography>
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

const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({
      once: false,
      duration: 800,
    });

    setProjects(data.projects || []);
    setCertificates(data.certificates || []);

    localStorage.setItem("projects", JSON.stringify(data.projects || []));
    localStorage.setItem("certificates", JSON.stringify(data.certificates || []));
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === "projects") {
      setShowAllProjects((prev) => !prev);
    } else {
      setShowAllCertificates((prev) => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  return (
    <div className="md:px-[8%] px-[4%] w-full sm:mt-0 mt-8 bg-white overflow-hidden" id="Portofolio">
      <div className="text-center pb-8" data-aos="fade-up" data-aos-duration="800">
        <h2 className="inline-block text-2xl md:text-4xl font-bold text-orange-500">
          Portfolio Showcase
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base mt-2">
          Discover my projects, certifications, and tech skills, showcasing my growth and expertise.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={1}
          sx={{
            bgcolor: "#F5F5F5",
            borderRadius: "12px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          className="md:px-3"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{
              minHeight: "60px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.85rem", md: "1rem" },
                fontWeight: "500",
                color: "#1F2937",
                textTransform: "none",
                transition: "all 0.3s ease",
                padding: "16px 0",
                "&:hover": {
                  color: "#F97316",
                  backgroundColor: "#FFFFFF",
                  "& .lucide": {
                    color: "#F97316",
                    transform: "scale(1.05)",
                  },
                },
                "&.Mui-selected": {
                  color: "#F97316",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  "& .lucide": {
                    color: "#F97316",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#F97316",
                height: "3px",
                borderRadius: "2px 2px 0 0",
              },
            }}
          >
            <Tab icon={<Code className="mb-1 w-4 h-4 transition-all duration-300" />} label="Projects" {...a11yProps(0)} />
            <Tab icon={<Award className="mb-1 w-4 h-4 transition-all duration-300" />} label="Certificates" {...a11yProps(1)} />
            <Tab icon={<Boxes className="mb-1 w-4 h-4 transition-all duration-300" />} label="Tech Stack" {...a11yProps(2)} />
          </Tabs>
        </AppBar>

        {[0, 1, 2].map((index) => (
          <TabPanel key={index} value={value} index={index} dir={theme.direction}>
            {index === 0 && (
              <>
                <div className="container mx-auto flex justify-center items-center overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedProjects.map((project, i) => (
                      <div key={project.id || i} data-aos="fade-up" data-aos-duration="800">
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
                </div>
                {projects.length > initialItems && (
                  <div className="mt-4 w-full flex justify-center">
                    <ToggleButton
                      onClick={() => toggleShowMore("projects")}
                      isShowingMore={showAllProjects}
                    />
                  </div>
                )}
              </>
            )}
            {index === 1 && (
              <>
                <div className="container mx-auto flex justify-center items-center overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {displayedCertificates.map((certificate, i) => (
                      <div key={i} data-aos="fade-up" data-aos-duration="800">
                        <Certificate ImgSertif={certificate.Img} />
                      </div>
                    ))}
                  </div>
                </div>
                {certificates.length > initialItems && (
                  <div className="mt-4 w-full flex justify-center">
                    <ToggleButton
                      onClick={() => toggleShowMore("certificates")}
                      isShowingMore={showAllCertificates}
                    />
                  </div>
                )}
              </>
            )}
            {index === 2 && (
              <div className="container mx-auto flex justify-center items-center overflow-hidden pb-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {techStacks.map((stack, i) => (
                    <div key={i} data-aos="fade-up" data-aos-duration="800">
                      <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabPanel>
        ))}
      </Box>
    </div>
  );
}
