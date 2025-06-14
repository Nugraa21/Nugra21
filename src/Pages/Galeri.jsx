import React, { useState, useEffect, useCallback, memo, Suspense } from "react";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";
import {
  SiReact, SiMqtt, SiEspressif, SiTailwindcss, SiHtml5, SiCss3, SiJavascript, SiGit,
  SiNodedotjs, SiFlutter, SiDart, SiFirebase, SiLatex, SiPhp, SiPython, SiVuedotjs,
  SiGithub, SiVercel,
} from "react-icons/si";
import AOS from "aos";
import "aos/dist/aos.css";

const Galeri = () => {

  return (
    <section className="min-h-screen text-orange-800 flex flex-col items-center justify-center px-2 xs:px-4 sm:px-6 md:px-8 lg:px-12 pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-x-hidden relative" id="Home">
        Galeri
    </section>
  );
};

export default memo(Galeri);
