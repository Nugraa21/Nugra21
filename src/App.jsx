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
import LoginPage from "./Pages/Login";  // Import halaman Login yang baru kamu buat
import { AnimatePresence } from 'framer-motion';

import Dashboard from "./Pages/Dashboard"; // atau sesuaikan path jika filenya berbeda


const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <Navbar />
          <AnimatedBackground />
          <Home />
          <About />
          <Portofolio />
          <ContactPage />

          {/* Footer Tailwind */}
          <footer className=" border-t-4 border-orange-500 mt-16 px-6 py-10 text-gray-800 text-sm font-medium">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Kolom 1 */}
              <div>
                <h3 className="text-orange-500 text-lg font-bold mb-4">
                  Kata kata hari ini
                </h3>
                <p className="mb-2 font-semibold">Apa yah kata katanya</p>
                <p className="text-gray-600">
                  G ada si aku lagi g kepikiran kata kata hehe
                </p>
              </div>

              {/* Kolom 2 */}
              <div>
                <h3 className="text-orange-500 text-lg font-bold mb-4">
                  Hal yang sedang ku pelajari
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/"
                      className="hover:text-orange-500 transition-colors"
                    >
                      | Node js
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="hover:text-orange-500 transition-colors"
                    >
                      | Iot dengan MQTT
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Python ( ML / Enkripsi )
                    </a>
                  </li>
                </ul>
              </div>

              {/* Kolom 3 */}
              <div>
                <h3 className="text-orange-500 text-lg font-bold mb-4">
                  Mampir juga di sini
                </h3>
                <p className="mb-2">
                  <strong>GitHub:</strong>{" "}
                  <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline"
                  >
                    github.com/yourusername
                  </a>
                </p>
                <p className="mb-2">
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href="https://linkedin.com/in/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline"
                  >
                    linkedin.com/in/yourprofile
                  </a>
                </p>
                <p className="mb-2">
                  <strong>Telegram:</strong>{" "}
                  <a
                    href="https://t.me/yourtelegram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline"
                  >
                    @yourtelegram
                  </a>
                </p>
              </div>
            </div>

            <div className="text-center mt-10 text-gray-500 text-xs">
              © 2025 Ludang Prasetyo Nugroho. All rights reserved.
            </div>
          </footer>
        </>
      )}
    </>
  );
};


const ProjectPageLayout = () => (
  <>
    <ProjectDetails />
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          © 2025{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Nugra21
          </a>
          . All Rights Reserved.
        </span>
      </center>
    </footer>
  </>
);

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const addHoverEvents = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, label');

      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => setHovered(true));
        el.addEventListener('mouseleave', () => setHovered(false));
      });

      return () => {
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', () => setHovered(true));
          el.removeEventListener('mouseleave', () => setHovered(false));
        });
      }
    };

    window.addEventListener("mousemove", moveCursor);
    const cleanupHover = addHoverEvents();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      cleanupHover && cleanupHover();
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${hovered ? 'custom-cursor-hover' : ''}`}
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
    <>
      <CustomCursor />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectPageLayout />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
