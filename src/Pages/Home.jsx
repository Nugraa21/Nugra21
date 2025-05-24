import React, { useState, useEffect, useCallback, memo } from "react";
import { Github, Linkedin, Mail, ExternalLink, Instagram } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600">
      NUGRA21
      <br />
      <span className="text-xl text-orange-600 font-light">Ludang Prasetyo Nugroho</span>
    </h1>
  </div>
));

const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-300 to-yellow-300 text-orange-900 text-sm font-semibold shadow-md">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href} className="relative group inline-block">
    <button className="relative w-[160px] h-11 rounded-lg bg-white border border-orange-300 shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-300 opacity-60 blur-md group-hover:opacity-90 transition-opacity duration-500"></div>
      <span className="relative flex items-center justify-center gap-2 text-orange-800 font-semibold text-sm">
        {text}
        <Icon className="w-4 h-4" />
      </span>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="relative group inline-block p-3 rounded-xl bg-orange-100 shadow-md hover:scale-110 transition-transform duration-300"
  >
    <Icon className="w-5 h-5 text-orange-700 group-hover:text-orange-600" />
  </a>
));

const WORDS = ["Computer Engineering Student", "Tech & Robotics Enthusiast"];
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const TECH_STACK = [ "React", "MQTT", "ESP32", "TailwindCSS"];
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/nugra21" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/ludangprasetyo/" },
  { icon: Instagram, link: "https://instagram.com/nugra.online" },
];

const Home = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    AOS.init({ once: true });
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

  // if (!isLoaded) {
  //   return (
  //     <div className="min-h-screen bg-white flex flex-col items-center justify-center text-orange-500 font-bold text-2xl tracking-widest px-4">
  //       <p className="mb-2 select-none"> - nugra.my.id -  </p>
  //       <p>Menyesuwaikan... {progress}%</p>
  //       <div className="w-full max-w-md h-3 bg-orange-100 rounded-full mt-4 overflow-hidden">
  //         <div
  //           className="h-full bg-gradient-to-r from-orange-400 to-yellow-300 transition-all duration-200"
  //           style={{ width: `${progress}%` }}
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  return (
  <section
    className="min-h-screen bg-white text-orange-800 flex items-center justify-center px-4 sm:px-6 lg:px-12 pt-20"
    id="Home"
  >
      <div className="max-w-screen-lg w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Kiri */}
        <div className="flex-1 space-y-6 max-w-xl">
          <MainTitle />

          <div
            className="h-8 flex items-center font-semibold text-orange-700 text-xl"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <span>{text}</span>
            <span className="w-[3px] h-6 bg-orange-500 ml-1 animate-blink"></span>
          </div>

          <p
            className="text-base md:text-lg text-orange-600 leading-relaxed font-light"
            data-aos="fade-up"
            data-aos-delay="1000"
          >
            Membuat Web Inovatif, Modern, dan Interaktif untuk Dunia Digital.
          </p>

          <div
            className="flex flex-wrap gap-3"
            data-aos="fade-up"
            data-aos-delay="1200"
          >
            {TECH_STACK.map((tech, index) => (
              <TechStack key={index} tech={tech} />
            ))}
          </div>

          <div
            className="flex flex-wrap sm:flex-nowrap gap-3"
            data-aos="fade-up"
            data-aos-delay="1400"
          >
            {/* <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
            <CTAButton href="#Contact" text="Contact" icon={Mail} /> */}
          </div>

          <div
            className="flex gap-4 mt-2"
            data-aos="fade-up"
            data-aos-delay="1600"
          >
            {SOCIAL_LINKS.map((social, index) => (
              <SocialLink key={index} {...social} />
            ))}
          </div>
        </div>

        {/* Kanan - Foto */}
        <div
          className="flex-1 flex justify-center items-center relative max-w-xs sm:max-w-sm lg:max-w-md"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          data-aos="zoom-in"
          data-aos-delay="500"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-orange-200 to-yellow-100 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition duration-700"></div>
            <img
              src="Nugra.png"
              alt="Ludang Prasetyo"
              className={`w-72 h-72 object-cover rounded-full shadow-lg border-4 border-orange-200 transition-transform duration-500 ${
                isHovering ? "scale-105 rotate-3" : "scale-100"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Home);
