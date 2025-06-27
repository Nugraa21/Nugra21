import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Pindahkan navItems ke luar component supaya tidak berubah setiap render
const navItems = [
  { href: "#Home", label: "Home" },
  { href: "#About", label: "About" },
  // { href: "#Skils", label: "Skils" },
  { href: "#Experience", label: "Experience" },
  { href: "#Portofolio", label: "Portofolio" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navItems
        .map((item) => {
          const section = document.querySelector(item.href);
          if (section) {
            return {
              id: item.href.replace("#", ""),
              offset: section.offsetTop - 150, // sesuaikan offset header navbar
              height: section.offsetHeight,
            };
          }
          return null;
        })
        .filter(Boolean);

      const currentPosition = window.scrollY;

      // Cari section yang aktif
      const active = sections.find(
        (section) =>
          currentPosition >= section.offset &&
          currentPosition < section.offset + section.height
      );

      if (active) {
        setActiveSection(active.id);
      } else {
        setActiveSection("Home"); // fallback ke Home kalau gak ada active
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Jalankan sekali supaya langsung update activeSection
    handleScroll();

    // Cleanup event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Disable scroll body kalau menu mobile dibuka
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  // Fungsi scroll ke section dan navigate ke /login
  const scrollToSection = (e, href) => {
    if (href === "/login") {
      e.preventDefault();
      setIsOpen(false);
      navigate("/login");
      return;
    }

    e.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      const top = section.offsetTop - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled || isOpen
          ? "bg-white shadow-md"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-[10%]">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="#Home"
              onClick={(e) => scrollToSection(e, "#Home")}
              className="text-2xl font-extrabold text-orange-500 tracking-wide"
            >
              Nugra21
            </a>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`group relative px-1 py-2 text-sm font-medium ${
                  activeSection === item.href.substring(1)
                    ? "text-orange-500 font-semibold"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transform origin-left transition-transform duration-300 ${
                    activeSection === item.href.substring(1)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            ))}

            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-white bg-orange-500 rounded hover:bg-orange-600 transition"
            >
              Login
            </Link>
          </div>

          {/* Hamburger Mobile */}
          <div className="md:hidden">
            <button
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsOpen(!isOpen)}
              className="text-orange-500 hover:text-orange-600 transition-transform duration-300 transform"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-white transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
        style={{ top: "64px" }}
      >
        <div className="flex flex-col h-full pt-8">
          {navItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className={`px-6 py-4 text-lg font-medium transition-all duration-300 ${
                activeSection === item.href.substring(1)
                  ? "text-orange-500 font-semibold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
                transform: isOpen ? "translateX(0)" : "translateX(50px)",
                opacity: isOpen ? 1 : 0,
              }}
            >
              {item.label}
            </a>
          ))}

          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="mt-auto px-6 py-4 text-lg font-semibold text-white bg-orange-500 rounded mx-6 mb-8 hover:bg-orange-600 transition"
            style={{
              transitionDelay: `${navItems.length * 100}ms`,
              transform: isOpen ? "translateX(0)" : "translateX(50px)",
              opacity: isOpen ? 1 : 0,
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
