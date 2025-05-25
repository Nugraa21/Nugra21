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
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";
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
        <Box sx={{ p: { xs: 2, md: 4 } }}>
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
  // State untuk tombol tampilkan semua/sembunyikan
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);

  useEffect(() => {
    AOS.init({
      once: false,
      duration: 800,
      easing: "ease-in-out",
    });

    setProjects(data.projects || []);
    setCertificates(data.certificates || []);

    localStorage.setItem("projects", JSON.stringify(data.projects || []));
    localStorage.setItem("certificates", JSON.stringify(data.certificates || []));
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Batas default item yang tampil sebelum tombol tampilkan semua
  const DEFAULT_DISPLAY_COUNT = 6;

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-10 bg-white rounded-xl  overflow-visible"
      id="Portofolio"
    >
      <div
        className="text-center pb-10"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <h2 className="inline-block text-3xl md:text-5xl font-extrabold text-orange-500 tracking-wide">
          Portfolio Showcase
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto text-base md:text-lg mt-3 font-medium">
          Discover my projects, certifications, and tech skills, showcasing my
          growth and expertise.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
<AppBar
  position="static"
  elevation={0} // hilangkan shadow supaya transparan clean
  sx={{
    bgcolor: "transparent",
    borderRadius: "12px",
    px: { xs: 2, md: 6 },
  }}
>
  <Tabs
    value={value}
    onChange={handleChange}
    textColor="inherit"
    indicatorColor="primary"
    variant="fullWidth"
    sx={{
      minHeight: "64px",
      "& .MuiTab-root": {
        fontSize: { xs: "1rem", md: "1.1rem" },
        fontWeight: 600,
        color: "#000000", // teks utama hitam
        textTransform: "none",
        paddingY: "18px",
        marginX: 1,
        borderRadius: "12px",
        transition: "all 0.3s ease",
        "&:hover": {
          color: "#FB923C", // oranye cerah saat hover
          backgroundColor: "rgba(251, 146, 60, 0.1)", // oranye semi transparan background hover
          "& .lucide": {
            color: "#FB923C",
            transform: "scale(1.1)",
          },
        },
        "&.Mui-selected": {
          color: "#FB923C", // oranye untuk tab aktif
          backgroundColor: "rgba(251, 146, 60, 0.15)", // bg tab aktif oranye transparent
          borderRadius: "12px",
          "& .lucide": {
            color: "#FB923C",
            transform: "scale(1.15)",
          },
          fontWeight: 700,
        },
        "&.Mui-focusVisible": {
          backgroundColor: "rgba(251, 146, 60, 0.08)",
          outline: "2px solid #FB923C",
          outlineOffset: "2px",
        },
      },
      "& .MuiTabs-indicator": {
        backgroundColor: "#FB923C",
        height: 4,
        borderRadius: "4px 4px 0 0",
        boxShadow: "0 0 8px rgba(251, 146, 60, 0.5)",
      },
    }}
  >
    <Tab
      icon={
        <Code className="mb-1 w-5 h-5 transition-transform duration-300" />
      }
      label="Projects"
      {...a11yProps(0)}
    />
    <Tab
      icon={
        <Award className="mb-1 w-5 h-5 transition-transform duration-300" />
      }
      label="Certificates"
      {...a11yProps(1)}
    />
    <Tab
      icon={
        <Boxes className="mb-1 w-5 h-5 transition-transform duration-300" />
      }
      label="Tech Stack"
      {...a11yProps(2)}
    />
  </Tabs>
</AppBar>


        {/* Projects Tab */}
        <TabPanel value={value} index={0} dir={theme.direction}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(showAllProjects ? projects : projects.slice(0, DEFAULT_DISPLAY_COUNT)).map(
              (project, i) => (
                <div
                  key={project.id || i}
                  data-aos="fade-up"
                  data-aos-duration="800"
                  className="transform hover:-translate-y-1  transition duration-300 rounded-lg"
                >
                  <CardProject
                    Img={project.Img}
                    Title={project.Title}
                    Description={project.Description}
                    Link={project.Link}
                    id={project.id}
                  />
                </div>
              )
            )}
          </div>

          {/* Tombol tampilkan semua / sembunyikan */}
          {projects.length > DEFAULT_DISPLAY_COUNT && (
            <div
              className="flex justify-center mt-6"
              style={{ position: "relative", zIndex: 10  }} // border buat debugging
            >
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg  transition duration-300"
                aria-label={
                  showAllProjects ? "Sembunyikan proyek" : "Tampilkan semua proyek"
                }
              >
                {showAllProjects
                  ? "Sembunyikan"
                  : `Tampilkan Semua (${projects.length})`}
              </button>
            </div>
          )}
        </TabPanel>

        {/* Certificates Tab */}
        <TabPanel value={value} index={1} dir={theme.direction}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(showAllCertificates
              ? certificates
              : certificates.slice(0, DEFAULT_DISPLAY_COUNT)
            ).map((certificate, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-duration="800"
                className="rounded-lg  transition-transform transform hover:-translate-y-1"
              >
                <Certificate ImgSertif={certificate.Img} />
              </div>
            ))}
          </div>

          {/* Tombol tampilkan semua / sembunyikan */}
          {certificates.length > DEFAULT_DISPLAY_COUNT && (
            <div
              className="flex justify-center mt-6"
              style={{ position: "relative", zIndex: 10, border: "1px solid red" }} // border buat debugging
            >
              <button
                onClick={() => setShowAllCertificates(!showAllCertificates)}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg  transition duration-300"
                aria-label={
                  showAllCertificates ? "Sembunyikan sertifikat" : "Tampilkan semua sertifikat"
                }
              >
                {showAllCertificates
                  ? "Sembunyikan"
                  : `Tampilkan Semua (${certificates.length})`}
              </button>
            </div>
          )}
        </TabPanel>

        {/* Tech Stack Tab (tidak ada tombol karena biasanya fixed) */}
        <TabPanel value={value} index={2} dir={theme.direction}>
          <div className="pb-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {techStacks.map((stack, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-duration="800"
                className="hover:scale-110 transition-transform duration-300 cursor-pointer"
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
