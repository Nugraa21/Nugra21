import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio"; 
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import WelcomeScreen from "./Pages/WelcomeScreen";
import LoginPage from "./Pages/Login";
import Pengalaman from "./components/Pengalaman";
import Dashboard from "./Pages/Dashboard";
import { AnimatePresence } from 'framer-motion';

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <div className="relative w-full min-h-screen overflow-x-hidden">
          <Navbar />
          <AnimatedBackground />
          <main className="flex flex-col">
            <Home />
            <About />
            <Pengalaman />
            <Portofolio />
            <ContactPage />
          </main>

          {/* Footer */}
          <footer className="border-t-4 border-orange-500 mt-12 xs:mt-16 px-2 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-8 xs:py-10 bg-orange-50 text-gray-800 text-[10px] xs:text-xs sm:text-sm font-medium">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8">
              {/* Kolom 1 */}
              <div>
                <h3 className="text-orange-500 text-base xs:text-lg sm:text-xl font-bold mb-3 xs:mb-4">
                  Kata-kata Hari Ini
                </h3>
                <p className="mb-1 xs:mb-2 font-semibold">Apa yah kata-katanya</p>
                <p className="text-gray-600 leading-relaxed">
                  G ada sih, aku lagi g kepikiran kata-kata hehe
                </p>
              </div>

              {/* Kolom 2 */}
              <div>
                <h3 className="text-orange-500 text-base xs:text-lg sm:text-xl font-bold mb-3 xs:mb-4">
                  Hal yang Sedang Kupelajari
                </h3>
                <ul className="space-y-1 xs:space-y-2">
                  <li>
                    <a
                      href="/"
                      className="hover:text-orange-500 transition-colors truncate block"
                    >
                      | Node.js
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="hover:text-orange-500 transition-colors truncate block"
                    >
                      | IoT dengan MQTT
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="hover:text-orange-500 transition-colors truncate block"
                    >
                      | Python (ML / Enkripsi)
                    </a>
                  </li>
                </ul>
              </div>

              {/* Kolom 3 */}
              <div>
                <h3 className="text-orange-500 text-base xs:text-lg sm:text-xl font-bold mb-3 xs:mb-4">
                  Mampir Juga di Sini
                </h3>
                <p className="mb-1 xs:mb-2 truncate">
                  <strong>GitHub:</strong>{" "}
                  <a
                    href="https://github.com/Nugraa21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline"
                  >
                    github.com/Nugraa21
                  </a>
                </p>
                <p className="mb-1 xs:mb-2 truncate">
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href="https://www.linkedin.com/in/ludang-prasetyo-4773b6361/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline"
                  >
                    linkedin.com/in/ludang-prasetyo
                  </a>
                </p>
              </div>
            </div>

            <div className="text-center mt-6 xs:mt-8 sm:mt-10 text-gray-500 text-[10px] xs:text-xs">
              © 2025 Ludang Prasetyo Nugroho. All rights reserved.
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <div className="relative w-full min-h-screen overflow-x-hidden">
    <Navbar />
    <main className="flex flex-col">
      <ProjectDetails />
    </main>
    <footer className="border-t-4 border-orange-500 mt-12 xs:mt-16 px-2 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-6 xs:py-8 bg-orange-50 text-gray-800 text-[10px] xs:text-xs sm:text-sm font-medium">
      <div className="max-w-7xl mx-auto w-full text-center">
        <p className="text-gray-500">
          © 2025{" "}
          <a
            href="https://github.com/Nugraa21"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:underline"
          >
            Nugra21
          </a>
          . All Rights Reserved.
        </p>
      </div>
    </footer>
  </div>
);

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const addHoverEvents = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, label, [role="button"]');

      const handleMouseEnter = () => setHovered(true);
      const handleMouseLeave = () => setHovered(false);

      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });

      return () => {
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    };

    window.addEventListener("mousemove", moveCursor);
    const cleanupHover = addHoverEvents();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      cleanupHover();
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${hovered ? 'custom-cursor-hover' : ''} hidden sm:block`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
}

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="w-full min-h-screen overflow-x-hidden ">
      <CustomCursor />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectPageLayout />} />
          <Route path="/pengalaman" element={<Pengalaman />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;