import React, { useEffect, memo, useMemo, useState } from "react";
import { FileText, Code2, BadgeCheck, Clock, MonitorSmartphone, Edit3, Layout, Cpu } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const Header = memo(() => (
  <div className="text-center lg:mb-8 mb-6 px-[5%]">
    <div className="inline-block relative group">
      <h2
        className="text-5xl font-extrabold text-orange-600 tracking-wide"
        data-aos="zoom-in-up"
        data-aos-duration="600"
      >
        About Me
      </h2>
    </div>
    <p
      className="mt-3 text-orange-400 max-w-3xl mx-auto text-lg flex items-center justify-center gap-3 font-semibold"
      data-aos="zoom-in-up"
      data-aos-duration="800"
      aria-hidden="true"
    >
      - - - - - - - -
    </p>
  </div>
));

const LoadingSkeleton = () => (
  <div className="animate-pulse bg-orange-200 rounded-xl w-full max-w-xs h-[320px] mx-auto">
    <div className="flex flex-col items-center py-8 px-6 space-y-6">
      <div className="rounded-full bg-orange-300 w-28 h-28 border-4 border-orange-100" />
      <div className="h-6 bg-orange-300 rounded w-3/4"></div>
      <div className="h-4 bg-orange-300 rounded w-1/2"></div>
      <div className="h-4 bg-orange-300 rounded w-5/6"></div>
    </div>
    <div className="bg-orange-300 h-12 rounded-b-xl mt-4 px-6 py-3" />
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
      className="relative w-full max-w-xs bg-white border border-orange-400 rounded-xl shadow-xl overflow-hidden
                 transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer mx-auto"
      data-aos="fade-up"
      data-aos-duration="1000"
      aria-label="Profile Card of Ludang Prasetyo Nugroho"
    >
      <div className="flex flex-col items-center bg-gradient-to-br from-orange-200 to-yellow-100 py-8 px-6">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src="/Nugra.png"
            alt="Ludang Prasetyo Nugroho"
            className="object-cover w-full h-full"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/fallback.png")}
          />
        </div>
        <h3 className="mt-4 text-xl font-extrabold text-orange-700 text-center">
          Ludang Prasetyo Nugroho
        </h3>
        <p className="text-md text-orange-600 font-semibold mt-1 text-center">
          Teknik Komputer - UTDI
        </p>
        <p className="text-sm italic text-orange-500 mt-2 text-center max-w-[220px]">
          "Innovating with code & creativity."
        </p>
      </div>
      <div className="flex flex-col items-center justify-center text-orange-700 bg-orange-50 px-6 py-3 border-t border-orange-300 space-y-1">
        <span className="font-bold text-sm text-center">NIM: 225510017</span>
        <span className="font-semibold text-xs text-center">--</span>
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
    <div className="mb-4">
      <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
        <span>{name}</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full bg-orange-100 h-3 rounded-full overflow-hidden shadow-inner">
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
    className="flex items-center p-5 rounded-xl bg-white bg-opacity-20 backdrop-blur-md border border-orange-300 shadow-md transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
    data-aos="fade-up"
    data-aos-delay={delay}
    role="group"
    tabIndex={0}
    aria-label={`${label}: ${value}`}
  >
    <div className="bg-gradient-to-tr from-orange-400 to-yellow-300 text-white p-4 rounded-full shadow-md flex-shrink-0 mr-5">
      <Icon className="w-7 h-7" aria-hidden="true" />
    </div>
    <div className="flex flex-col flex-grow">
      <div className="text-md text-gray-800 font-semibold">{label}</div>
      {description && (
        <div className="text-sm text-gray-600 mt-1">{description}</div>
      )}
    </div>
    <div className="text-orange-700 font-extrabold text-2xl ml-6 self-end">{value}</div>
  </div>
);

// ** Tambahan: Skills Cards Section **
const Chip = ({ text }) => (
  <span className="inline-block bg-orange-200 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full mr-2 mb-2 shadow-sm select-none">
    {text}
  </span>
);
const SkillCard = ({ icon: Icon, title, description, tools = [], delay }) => (
  <div
    className="bg-white bg-opacity-30 backdrop-blur-md border border-orange-300 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer shadow-md
               hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out"
    data-aos="fade-up"
    data-aos-delay={delay}
    role="group"
    tabIndex={0}
    aria-label={`${title} skill`}
  >
    <div className="bg-gradient-to-tr from-orange-500 to-yellow-400 text-white p-5 rounded-full shadow-lg mb-4 flex items-center justify-center">
      <Icon className="w-12 h-12" aria-hidden="true" />
    </div>
    <h3 className="text-2xl font-bold text-orange-700 mb-3">{title}</h3>
    <p className="text-sm text-gray-800 mb-4">{description}</p>

    {/* Tools chips */}
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
    AOS.init({ once: false });
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
      className="min-h-screen  text-gray-900 overflow-hidden px-[5%] sm:px-[8%] lg:px-[12%] mt-[80px] sm:mt-[100px] scroll-smooth pb-20"
      id="About"
    >
      <Header />

      <div className="w-full mx-auto pt-10 sm:pt-14 relative">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Nama dan deskripsi */}
          <div className="space-y-8 text-center lg:text-left">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-orange-600">Hello, I'm</span>
              <span className="block mt-2 text-gray-900" data-aos="fade-right" data-aos-duration="1300">
                Ludang Prasetyo Nugroho
              </span>
            </h2>

            <p
              className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed text-justify"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
              Mahasiswa Teknik Komputer di Universitas Teknologi Digital Indonesia (UTDI), dengan minat kuat dalam
              pemrograman, desain web, editing video & foto, serta robotika.
              <br />
              Saya bersemangat menciptakan solusi teknologi inovatif yang memberikan manfaat nyata untuk masyarakat.
            </p>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-6 mt-4 w-full max-w-md mx-auto lg:mx-0">
              <a
                href="#" // CV 
                className="w-full lg:w-auto"
                target="_blank"
                rel="noreferrer noopener"
              >
                <button
                  data-aos="fade-up"
                  data-aos-duration="800"
                  className="w-full lg:w-auto sm:px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  Download CV
                </button>
              </a>
              <a href="#Portofolio" className="w-full lg:w-auto">
                <button
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="w-full lg:w-auto sm:px-8 py-3 rounded-xl border-2 border-orange-400 text-orange-600 font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 hover:bg-orange-100"
                >
                  <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  View Projects
                </button>
              </a>
            </div>
          </div>

          {/* ProfileImage dengan loading skeleton */}
          <ProfileImage />
        </div>

        {/* Skill bars */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-20"
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

        {/* Stats cards with blur background */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          <StatsCard
            icon={Code2}
            value={totalProjects}
            label="Total Projects"
            description="Projects I have completed"
            delay={100}
          />
          <StatsCard
            icon={BadgeCheck}
            value={totalCertificates}
            label="Certificates"
            description="Verified skill certificates"
            delay={300}
          />
          <StatsCard
            icon={Clock}
            value={`${YearExperience}+`}
            label="Years of Experience"
            description="In software development"
            delay={500}
          />
        </div>
      {/* New Skills Cards Section */}
      <div className="mt-20">
        <h3
          className="text-5xl font-extrabold text-orange-600 mb-12 text-center"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          My Skills
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4 sm:px-8">
          <SkillCard
            icon={Code2}
            title="Programming"
            description="Expertise in multiple programming languages and algorithms."
            tools={["JavaScript", "Python", "C++", "Dart", "Java"]}
            delay={100}
          />
          <SkillCard
            icon={Edit3}
            title="Video & Photo Editing"
            description="Skilled in video and photo editing tools to create compelling visuals."
            tools={["Adobe Premiere", "Photoshop", "DaVinci Resolve", "Lightroom"]}
            delay={300}
          />
          <SkillCard
            icon={Layout}
            title="UI/UX Design"
            description="Designing intuitive and modern user interfaces and experiences."
            tools={["Figma", "Adobe XD", "Sketch", "TailwindCSS"]}
            delay={500}
          />
          <SkillCard
            icon={Cpu}
            title="IoT & Robotics"
            description="Experience building and programming IoT devices and robots."
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
