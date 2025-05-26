import React, { useEffect, memo, useMemo, useState } from "react";
import { FileText, Code2, BadgeCheck, Clock, MonitorSmartphone, Edit3, Layout, Cpu } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const Header = memo(() => (
  <div className="text-center mb-6 sm:mb-8 lg:mb-10 px-4 sm:px-6 lg:px-8">
    <div className="inline-block relative">
      <h2
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-500 tracking-tight"
        data-aos="zoom-in-up"
        data-aos-duration="600"
      >
        About Me
      </h2>
      <div className="absolute w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full mt-2 opacity-80" />
    </div>
    <p
      className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-medium"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      Get to know my journey, skills, and passion for technology.
    </p>
  </div>
));

const LoadingSkeleton = () => (
  <div className="animate-pulse bg-white/20 backdrop-blur-md rounded-xl w-full max-w-xs h-[340px] mx-auto border border-orange-200">
    <div className="flex flex-col items-center py-8 px-6 space-y-6">
      <div className="rounded-full bg-orange-200 w-28 h-28 border-4 border-orange-100" />
      <div className="h-6 bg-orange-200 rounded w-3/4" />
      <div className="h-4 bg-orange-200 rounded w-1/2" />
      <div className="h-4 bg-orange-200 rounded w-5/6" />
    </div>
    <div className="bg-orange-200 h-12 rounded-b-xl mt-4 px-6 py-3" />
  </div>
);

const ProfileImage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div
      className="relative w-full max-w-xs bg-white/30 backdrop-blur-lg border border-orange-200 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer mx-auto"
      data-aos="fade-up"
      data-aos-duration="1000"
      aria-label="Profile Card of Ludang Prasetyo Nugroho"
    >
      <div className="flex flex-col items-center bg-gradient-to-br from-orange-100 to-yellow-50 py-8 px-6">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src="/Nugra.png"
            alt="Ludang Prasetyo Nugroho"
            className="object-cover w-full h-full"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/fallback.png")}
          />
        </div>
        <h3 className="mt-4 text-xl font-bold text-orange-700 text-center">
          Ludang Prasetyo Nugroho
        </h3>
        <p className="text-sm text-orange-600 font-semibold mt-1 text-center">
          Teknik Komputer - UTDI
        </p>
        <p className="text-xs italic text-orange-500 mt-2 text-center max-w-[220px]">
          "Innovating with code & creativity."
        </p>
      </div>
      <div className="flex flex-col items-center justify-center text-orange-700 bg-orange-50/50 px-6 py-3 border-t border-orange-200 space-y-1">
        <span className="font-semibold text-sm text-center">NIM: 225510017</span>
        <span className="font-medium text-xs text-center">Yogyakarta, Indonesia</span>
      </div>
    </div>
  );
};

const SkillBar = ({ name, percent }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setWidth(percent), 400);
    return () => clearTimeout(timeout);
  }, [percent]);

  return (
    <div className="mb-4" data-aos="fade-up" data-aos-duration="800">
      <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
        <span>{name}</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full bg-orange-100/50 h-3 rounded-full overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-orange-500 to-yellow-400 h-3 rounded-full transition-all duration-1000 ease-in-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, value, label, description, delay }) => (
  <div
    className="flex items-center p-4 sm:p-5 rounded-xl bg-white/20 backdrop-blur-md border border-orange-200 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
    data-aos="fade-up"
    data-aos-delay={delay}
    role="group"
    tabIndex={0}
    aria-label={`${label}: ${value}`}
  >
    <div className="bg-gradient-to-tr from-orange-400 to-yellow-300 text-white p-3 sm:p-4 rounded-full shadow-md flex-shrink-0 mr-4 sm:mr-5">
      <Icon className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
    </div>
    <div className="flex flex-col flex-grow">
      <div className="text-sm sm:text-md text-gray-800 font-semibold">{label}</div>
      {description && (
        <div className="text-xs sm:text-sm text-gray-600 mt-1">{description}</div>
      )}
    </div>
    <div className="text-orange-700 font-bold text-xl sm:text-2xl ml-4 sm:ml-6 self-end">{value}</div>
  </div>
);

const Chip = ({ text }) => (
  <span className="inline-block bg-orange-100/80 text-orange-800 text-xs font-semibold px-2.5 py-1 rounded-full mr-2 mb-2 shadow-sm select-none transition-all duration-300 hover:bg-orange-200 hover:shadow-md">
    {text}
  </span>
);

const SkillCard = ({ icon: Icon, title, description, tools = [], delay }) => (
  <div
    className="bg-white/30 backdrop-blur-md border border-orange-200 rounded-xl p-5 sm:p-6 flex flex-col items-center text-center cursor-pointer shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
    data-aos="fade-up"
    data-aos-delay={delay}
    role="group"
    tabIndex={0}
    aria-label={`${title} skill`}
  >
    <div className="bg-gradient-to-tr from-orange-500 to-yellow-400 text-white p-4 sm:p-5 rounded-full shadow-lg mb-3 sm:mb-4">
      <Icon className="w-10 h-10 sm:w-12 sm:h-12" aria-hidden="true" />
    </div>
    <h3 className="text-xl sm:text-2xl font-bold text-orange-700 mb-2 sm:mb-3">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">{description}</p>
    <div className="flex flex-wrap justify-center max-w-full">
      {tools.map((tool) => (
        <Chip key={tool} text={tool} />
      ))}
    </div>
  </div>
);

const AboutPage = () => {
  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");

    const startDate = new Date("2021-11-06");
    const today = new Date();
    const experience =
      today.getFullYear() -
      startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

    return {
      totalProjects: storedProjects.length || 12,
      totalCertificates: storedCertificates.length || 5,
      YearExperience: experience || 3,
    };
  }, []);

  useEffect(() => {
    AOS.init({ once: false, duration: 800, easing: "ease-out-cubic" });
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => AOS.refresh(), 250);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <section
      className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white/30 backdrop-blur-md text-gray-900 overflow-hidden px-4 sm:px-6 lg:px-12 mt-16 sm:mt-20 scroll-smooth pb-16 sm:pb-20"
      id="About"
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
          .animate-slide-in {
            animation: slideIn 0.8s ease-out forwards;
          }
          .animate-glow-pulse {
            animation: glowPulse 2s ease-in-out infinite;
          }
          .button-hover {
            transition: all 0.3s ease;
          }
          .button-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(251, 146, 60, 0.4);
          }
          @media (max-width: 768px) {
            .section-container {
              padding: 1rem;
            }
            .section-title {
              font-size: 1.75rem;
            }
            .profile-card {
              max-width: 280px;
            }
            .skill-bar, .stats-card, .skill-card {
              padding: 0.75rem;
            }
            .skill-card .icon {
              width: 2.5rem;
              height: 2.5rem;
            }
          }
          @media (max-width: 480px) {
            .section-title {
              font-size: 1.5rem;
            }
            .profile-card {
              max-width: 260px;
            }
            .skill-bar, .stats-card, .skill-card {
              padding: 0.5rem;
            }
            .skill-card .icon {
              width: 2rem;
              height: 2rem;
            }
            .button {
              padding: 0.6rem 1rem;
              font-size: 0.85rem;
            }
          }
        `}
      </style>
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 lg:pt-14 section-container">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Nama dan deskripsi */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-500">Hello, I'm</span>
              <span className="block mt-2 text-gray-900" data-aos="fade-right" data-aos-duration="1200">
                Ludang Prasetyo Nugroho
              </span>
            </h2>
            <p
              className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed text-justify"
              data-aos="fade-right"
              data-aos-duration="1400"
            >
              Saya adalah mahasiswa Teknik Komputer di Universitas Teknologi Digital Indonesia (UTDI). Dengan passion di
              pengembangan web, IoT, dan desain UI/UX, saya berdedikasi untuk menciptakan solusi teknologi yang inovatif dan
              berdampak positif.
            </p>
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 sm:gap-6 mt-4 w-full max-w-md mx-auto lg:mx-0">
              <a
                href="#" // CV link placeholder
                className="w-full sm:w-auto"
                target="_blank"
                rel="noreferrer noopener"
              >
                <button
                  data-aos="fade-up"
                  data-aos-duration="800"
                  className="button w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold button-hover animate-glow-pulse flex items-center justify-center gap-2 sm:gap-3"
                >
                  <FileText className="w-5 h-5" />
                  Download CV
                </button>
              </a>
              <a href="#Portofolio" className="w-full sm:w-auto">
                <button
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="button w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl border-2 border-orange-400 text-orange-600 font-semibold button-hover hover:bg-orange-100/50 flex items-center justify-center gap-2 sm:gap-3"
                >
                  <Code2 className="w-5 h-5" />
                  View Projects
                </button>
              </a>
            </div>
          </div>

          {/* ProfileImage */}
          <ProfileImage className="profile-card" />
        </div>

        {/* Skill bars */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <SkillBar name="Programming" percent={85} />
          <SkillBar name="Web Design" percent={80} />
          <SkillBar name="Video Editing" percent={75} />
          <SkillBar name="Robotics" percent={70} />
          <SkillBar name="UI/UX Design" percent={75} />
          <SkillBar name="Photography" percent={65} />
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20">
          <StatsCard
            icon={Code2}
            value={totalProjects}
            label="Total Projects"
            description="Projects completed across various domains"
            delay={100}
          />
          <StatsCard
            icon={BadgeCheck}
            value={totalCertificates}
            label="Certificates"
            description="Earned through skill development"
            delay={300}
          />
          <StatsCard
            icon={Clock}
            value={`${YearExperience}+`}
            label="Years of Experience"
            description="In software and technology"
            delay={500}
          />
        </div>

        {/* Skills Cards Section */}
        <div className="mt-16 sm:mt-20">
          <h3
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-500 mb-10 sm:mb-12 text-center section-title"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            My Skills
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-0 sm:px-4">
            <SkillCard
              icon={Code2}
              title="Programming"
              description="Proficient in multiple programming languages and problem-solving."
              tools={["JavaScript", "Python", "C++", "Dart", "Java"]}
              delay={100}
            />
            <SkillCard
              icon={Edit3}
              title="Video & Photo Editing"
              description="Creating engaging visuals with professional editing tools."
              tools={["Adobe Premiere", "Photoshop", "DaVinci Resolve", "Lightroom"]}
              delay={300}
            />
            <SkillCard
              icon={Layout}
              title="UI/UX Design"
              description="Crafting intuitive and modern user interfaces."
              tools={["Figma", "Adobe XD", "Sketch", "TailwindCSS"]}
              delay={500}
            />
            <SkillCard
              icon={Cpu}
              title="IoT & Robotics"
              description="Building smart devices and robotic systems."
              tools={["ESP32", "Arduino", "MQTT", "ROS"]}
              delay={700}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(AboutPage);