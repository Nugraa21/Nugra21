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
          
          {/* Footer manual keren */}
          <footer style={{
            backgroundColor: "#fff",
            borderTop: "3px solid #ff6600",
            padding: "40px 20px",
            color: "#222",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontSize: "15px",
            lineHeight: "1.6",
            marginTop: "60px"
          }}>
            <div style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "40px"
            }}>
              {/* Kolom 1: Tentang Aku */}
              <div>
                <h3 style={{ color: "#ff6600", marginBottom: "16px", fontSize: "20px", fontWeight: "700" }}>
                  Kata kata hari ini
                </h3>
                <p style={{ marginBottom: "12px", fontWeight: "600" }}>Apa yah kata katanya</p>
                <p>
                  G ada si aku lagi g kepikiran kata kata hehe
                </p>
              </div>

              {/* Kolom 2: Navigasi */}
              <div>
                <h3 style={{ color: "#ff6600", marginBottom: "16px", fontSize: "20px", fontWeight: "700" }}>
                  Hal yang sedang ku pelajari
                </h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="/" style={{ color: "#222", textDecoration: "none", transition: "color 0.3s" }}
                       onMouseEnter={e => e.target.style.color = "#ff6600"}
                       onMouseLeave={e => e.target.style.color = "#222"}>
                      | Node js
                    </a>
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="/about" style={{ color: "#222", textDecoration: "none", transition: "color 0.3s" }}
                       onMouseEnter={e => e.target.style.color = "#ff6600"}
                       onMouseLeave={e => e.target.style.color = "#222"}>
                      | Iot dengan mqtt
                    </a>
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="/contact" style={{ color: "#222", textDecoration: "none", transition: "color 0.3s" }}
                       onMouseEnter={e => e.target.style.color = "#ff6600"}
                       onMouseLeave={e => e.target.style.color = "#222"}>
                      Pythone ( ML \ Encription )
                    </a>
                  </li>
                </ul>
              </div>

              {/* Kolom 3: Kontak & Sosial Media */}
              <div>
                <h3 style={{ color: "#ff6600", marginBottom: "16px", fontSize: "20px", fontWeight: "700" }}>
                  Mampir juga di sini
                </h3>
                <p style={{ marginBottom: "8px" }}>
                  <strong>GitHub:</strong> <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" style={{ color: "#ff6600", textDecoration: "none" }}>github.com/yourusername</a>
                </p>
                <p style={{ marginBottom: "8px" }}>
                  <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" style={{ color: "#ff6600", textDecoration: "none" }}>linkedin.com/in/yourprofile</a>
                </p>
                <p style={{ marginBottom: "8px" }}>
                  <strong>Youtube:</strong> <a href="https://t.me/yourtelegram" target="_blank" rel="noopener noreferrer" style={{ color: "#ff6600", textDecoration: "none" }}>@yourtelegram</a>
                </p>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "40px", color: "#555", fontSize: "14px" }}>
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
