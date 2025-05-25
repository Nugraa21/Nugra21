import React, { useState, useEffect, useCallback, memo } from "react";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";
import {
  SiReact, SiMqtt, SiEspressif, SiTailwindcss, SiHtml5, SiCss3,
  SiJavascript, SiGit, SiNodedotjs, SiFlutter, SiDart
} from "react-icons/si";
import AOS from "aos";
import "aos/dist/aos.css";

// Komponen kecil
const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600">
      NUGRA21
      <br />
      <span className="text-xl sm:text-2xl text-orange-600 font-light">
        Ludang Prasetyo Nugroho
      </span>
    </h1>
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a
    href={href}
    className="relative group inline-block focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg"
    target="_blank"
    rel="noopener noreferrer"
  >
    <button className="relative w-[160px] h-11 rounded-lg  border border-orange-300 shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 text-orange-800 font-semibold text-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-300 opacity-60 blur-md group-hover:opacity-90 transition-opacity duration-500 rounded-lg"></div>
      <span className="relative flex items-center justify-center gap-2">
        {text}
        {Icon && <Icon className="w-4 h-4" />}
      </span>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="relative group inline-block p-3 rounded-xl bg-orange-100 shadow-md hover:scale-110 hover:bg-orange-200 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
  >
    <Icon className="w-6 h-6 text-orange-700 group-hover:text-orange-600" />
  </a>
));

// Data
const WORDS = [
  "Creative UI/UX Designer",
  "Tech & Robotics Enthusiast",
  "Full-Stack Web Developer",
  "IoT & Embedded Systems Builder",
  "Passionate Open-Source Contributor",
  "Visionary Digital Creator",
  "Flutter & MQTT Specialist",
  "Automation & AI Explorer",
  "Code with Heart, Build with Purpose",
  "Nugra21 — Crafting Future with Tech"
];
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;

const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/nugra21" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/ludangprasetyo/" },
  { icon: Instagram, link: "https://instagram.com/nugra.online" },
];

const TECH_ICONS = [
  { icon: SiReact, name: "React" },
  { icon: SiMqtt, name: "MQTT" },
  { icon: SiEspressif, name: "ESP32" },
  { icon: SiTailwindcss, name: "TailwindCSS" },
  { icon: SiHtml5, name: "HTML5" },
  { icon: SiCss3, name: "CSS3" },
  { icon: SiJavascript, name: "JavaScript" },
  { icon: SiGit, name: "Git" },
  { icon: SiNodedotjs, name: "NodeJS" },
  { icon: SiFlutter, name: "Flutter" },
  { icon: SiDart, name: "Dart" },
];

// Animasi scrolling ikon teknologi
const ScrollingTechText = () => (
  <div className="scrolling-tech-wrapper px-2 mt-12 w-full overflow-hidden">
    <div className="scrolling-tech-text inline-flex items-center gap-12 text-orange-600 select-none">
      {TECH_ICONS.map(({ icon: Icon, name }, i) => (
        <div key={i} title={name} className="flex flex-col items-center">
          <Icon className="w-10 h-10" />
          <span className="text-xs mt-1 font-semibold">{name}</span>
        </div>
      ))}
      {TECH_ICONS.map(({ icon: Icon, name }, i) => (
        <div key={"dup-" + i} title={name} className="flex flex-col items-center">
          <Icon className="w-10 h-10" />
          <span className="text-xs mt-1 font-semibold">{name}</span>
        </div>
      ))}
    </div>
  </div>
);

// Komponen utama
const Home = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    AOS.init({ once: true, duration: 800, easing: "ease-in-out" });
  }, []);

  useEffect(() => {
    let interval;
    if (progress < 100) {
      interval = setInterval(() => setProgress((prev) => prev + 2), 40);
    } else {
      setTimeout(() => setIsLoaded(true), 500);
    }
    return () => clearInterval(interval);
  }, [progress]);

  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText((prev) => prev + WORDS[wordIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else {
        setWordIndex((prev) => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(handleTyping, isTyping ? TYPING_SPEED : ERASING_SPEED);
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <section
      className="min-h-screen  text-orange-800 flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20 pt-24 pb-16 overflow-x-hidden"
      id="Home"
    >
      <div className="max-w-6xl w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-12 sm:gap-16">
        {/* Kiri */}
        <div className="flex flex-col space-y-8 w-full lg:w-1/2">
          <MainTitle />
          <div
            className="h-9 flex items-center font-semibold text-orange-700 text-xl sm:text-2xl tracking-wide"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <span>{text}</span>
            <span className="w-[3px] h-7 bg-orange-500 ml-2 animate-blink rounded"></span>
          </div>
          <p
            className="text-base md:text-lg text-orange-600 leading-relaxed font-light max-w-lg"
            data-aos="fade-up"
            data-aos-delay="1000"
          >
            Membuat Web Inovatif, Modern, dan Interaktif untuk Dunia Digital.
          </p>
          <div
            className="flex flex-wrap sm:flex-nowrap gap-4 mt-2"
            data-aos="fade-up"
            data-aos-delay="1400"
          >
            <CTAButton href="mailto:nugra315@gmail.com" text="Email Me" icon={Mail} />
          </div>
          <div
            className="flex gap-5 mt-6"
            data-aos="fade-up"
            data-aos-delay="1600"
          >
            {SOCIAL_LINKS.map((social, index) => (
              <SocialLink key={index} {...social} />
            ))}
          </div>
        </div>

        {/* Kanan */}
        <div
          className="flex justify-center items-center w-full lg:w-1/2"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          data-aos="zoom-in"
          data-aos-delay="500"
        >
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-tr from-orange-300 via-yellow-200 to-yellow-100 rounded-full blur-3xl opacity-50 group-hover:opacity-90 transition duration-700"></div>
            <img
              src="Nugra.png"
              alt="Ludang Prasetyo"
              className={`w-64 h-64 sm:w-72 sm:h-72 object-cover rounded-full shadow-2xl border-8 border-orange-200 transition-transform duration-500 ease-in-out ${
                isHovering ? "scale-105 rotate-2" : "scale-100"
              }`}
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Tech Icons */}
      <ScrollingTechText />
    </section>
  );
};

export default memo(Home);
