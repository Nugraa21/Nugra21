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
        Tentang Aku
      </h3>
      <p style={{ marginBottom: "12px", fontWeight: "600" }}>Ludang Prasetyo Nugroho</p>
      <p>
        Mahasiswa Teknik Komputer yang bersemangat dalam pengembangan perangkat lunak, desain web, dan inovasi teknologi.  
      </p>
    </div>

    {/* Kolom 2: Navigasi */}
    <div>
      <h3 style={{ color: "#ff6600", marginBottom: "16px", fontSize: "20px", fontWeight: "700" }}>
        Navigasi
      </h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "10px" }}>
          <a href="/" style={{ color: "#222", textDecoration: "none", transition: "color 0.3s" }}
             onMouseEnter={e => e.target.style.color = "#ff6600"}
             onMouseLeave={e => e.target.style.color = "#222"}>
            Home
          </a>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <a href="/about" style={{ color: "#222", textDecoration: "none", transition: "color 0.3s" }}
             onMouseEnter={e => e.target.style.color = "#ff6600"}
             onMouseLeave={e => e.target.style.color = "#222"}>
            About
          </a>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <a href="/contact" style={{ color: "#222", textDecoration: "none", transition: "color 0.3s" }}
             onMouseEnter={e => e.target.style.color = "#ff6600"}
             onMouseLeave={e => e.target.style.color = "#222"}>
            Contact
          </a>
        </li>
      </ul>
    </div>

    {/* Kolom 3: Kontak & Sosial Media */}
    <div>
      <h3 style={{ color: "#ff6600", marginBottom: "16px", fontSize: "20px", fontWeight: "700" }}>
        Kontak & Sosial Media
      </h3>
      <p style={{ marginBottom: "12px" }}>
        <strong>Email:</strong> <a href="mailto:your.email@example.com" style={{ color: "#ff6600", textDecoration: "none" }}>your.email@example.com</a>
      </p>
      <p style={{ marginBottom: "8px" }}>
        <strong>GitHub:</strong> <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" style={{ color: "#ff6600", textDecoration: "none" }}>github.com/yourusername</a>
      </p>
      <p style={{ marginBottom: "8px" }}>
        <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" style={{ color: "#ff6600", textDecoration: "none" }}>linkedin.com/in/yourprofile</a>
      </p>
      <p style={{ marginBottom: "8px" }}>
        <strong>Telegram:</strong> <a href="https://t.me/yourtelegram" target="_blank" rel="noopener noreferrer" style={{ color: "#ff6600", textDecoration: "none" }}>@yourtelegram</a>
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
          © 2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            EkiZR™
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
      // Pilih semua elemen interaktif
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
          <Route path="/project/:id" element={<ProjectPageLayout />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
