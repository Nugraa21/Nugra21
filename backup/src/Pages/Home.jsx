import React, { useState, useEffect, useCallback, memo, Suspense } from "react";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";
import {
  SiReact,
  SiMqtt,
  SiEspressif,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiGit,
  SiNodedotjs,
  SiFlutter,
  SiDart,
  SiFirebase,
  SiLatex,
  SiPhp,
  SiPython,
  SiVuedotjs,
  SiGithub,
  SiVercel,
} from "react-icons/si";
import AOS from "aos";
import "aos/dist/aos.css";
import Lanyard from '../components/Lanyard/Lanyard';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-orange-600 text-center">Error loading Lanyard: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}

// Komponen kecil
const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-4xl xs:text-5xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600">
      NUGRA21
      <br />
      <span className="text-lg xs:text-xl sm:text-2xl text-orange-600 font-light">
        ヌグラ Hi  .  .  .  .
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
    <button className="relative w-40 xs:w-44 sm:w-48 h-10 sm:h-11 rounded-lg border border-orange-300 shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 text-orange-800 font-semibold text-xs sm:text-sm">
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
    className="relative group inline-block p-2 xs:p-3 rounded-xl bg-orange-100 shadow-md hover:scale-110 hover:bg-orange-200 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
  >
    <Icon className="w-5 h-5 xs:w-6 xs:h-6 text-orange-700 group-hover:text-orange-600" />
  </a>
));

// Data
const WORDS = [
  "Creative UI/UX Designer",
  "Tech & Robotics Enthusiast",
  "Full-Stack Web Developer",
  "IoT & Embedded Systems Builder",
  "Visionary Digital Creator",
  "Flutter & MQTT",
  "Automation & AI Explorer",
  "Code with Heart, Build with Purpose",
  "Nugra21 — Crafting Future with Tech",
];
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;

const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/Nugraa21" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/ludang-prasetyo-4773b6361/" },
  { icon: Instagram, link: "https://www.instagram.com/nugraa_21/" },
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
  { icon: SiGithub, name: "GitHub" },
  { icon: SiNodedotjs, name: "NodeJS" },
  { icon: SiFlutter, name: "Flutter" },
  { icon: SiDart, name: "Dart" },
  { icon: SiFirebase, name: "Firebase" },
  { icon: SiLatex, name: "LaTeX" },
  { icon: SiPhp, name: "PHP" },
  { icon: SiPython, name: "Python" },
  { icon: SiVuedotjs, name: "Vue" },
  { icon: SiVercel, name: "Vercel" },
];

// Animasi scrolling ikon teknologi
const ScrollingTechText = () => (
  <div className="scrolling-tech-wrapper px-2 xs:px-4 sm:px-6 mt-8 sm:mt-12 w-full overflow-hidden">
    <div className="scrolling-tech-text inline-flex items-center gap-4 xs:gap-6 sm:gap-8 lg:gap-12 text-orange-600 select-none whitespace-nowrap">
      {TECH_ICONS.map(({ icon: Icon, name }, i) => (
        <div key={i} title={name} className="flex flex-col items-center min-w-[60px] xs:min-w-[80px]">
          <Icon className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10" />
          <span className="text-[10px] xs:text-xs mt-1 font-semibold">{name}</span>
        </div>
      ))}
      {TECH_ICONS.map(({ icon: Icon, name }, i) => (
        <div key={"dup-" + i} title={name} className="flex flex-col items-center min-w-[60px] xs:min-w-[80px]">
          <Icon className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10" />
          <span className="text-[10px] xs:text-xs mt-1 font-semibold">{name}</span>
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
    AOS.init({
      once: true,
      duration: window.innerWidth < 640 ? 600 : 800,
      easing: "ease-in-out",
    });
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
      className="min-h-screen text-orange-800 flex flex-col items-center justify-center px-2 xs:px-4 sm:px-6 md:px-8 lg:px-12 pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-x-hidden"
      id="Home"
    >
      {/* Lanyard Component (Outside the main container) */}
      <div className="lanyard-container">
        <ErrorBoundary>
          <Suspense fallback={<div className="text-orange-600 text-center">Loading Lanyard...</div>}>
            <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl w-full flex flex-col items-center lg:items-start gap-6 xs:gap-8 sm:gap-12 lg:gap-16 mt-[320px] xs:mt-[370px] sm:mt-[420px] md:mt-[470px] lg:mt-0">
        {/* Text Content */}
        <div className="flex flex-col space-y-6 xs:space-y-8 w-full lg:w-1/2">
          <MainTitle />
          <div
            className="h-8 xs:h-9 flex items-center font-semibold text-orange-700 text-lg xs:text-xl sm:text-2xl tracking-wide"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <span>{text}</span>
            <span className="w-[3px] h-6 xs:h-7 bg-orange-600 ml-2 animate-blink rounded"></span>
          </div>
          <p
            className="text-sm xs:text-base sm:text-lg text-orange-600 leading-relaxed font-light max-w-md"
            data-aos="fade-up"
            data-aos-delay="1000"
          >
            "Empowering the future through innovative coding and creative design, turning ideas into impactful solutions."
          </p>
          <div
            className="flex flex-wrap sm:flex-nowrap gap-3 xs:gap-4 mt-2"
            data-aos="fade-up"
            data-aos-delay="1400"
          >
            <CTAButton href="mailto:nugra315@gmail.com" text="Email Me" icon={Mail} />
          </div>
          <div
            className="flex gap-3 xs:gap-4 sm:gap-5 mt-4 xs:mt-6"
            data-aos="fade-up"
            data-aos-delay="1600"
          >
            {SOCIAL_LINKS.map((social, index) => (
              <SocialLink key={index} {...social} />
            ))}
          </div>
        </div>
      </div>

      {/* Tech Icons */}
      <ScrollingTechText />
    </section>
  );
};

export default memo(Home);