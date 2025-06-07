import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { href: "#Home", label: "Home" },
  { href: "#About", label: "About" },
  { href: "#Experience", label: "Experience" },
  { href: "#Portofolio", label: "Portofolio" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Hanya aktifkan logika section tracking jika di halaman utama (/)
      if (location.pathname === "/") {
        const sections = navItems
          .map((item) => {
            const section = document.querySelector(item.href);
            if (section) {
              return {
                id: item.href.replace("#", ""),
                offset: section.offsetTop - 150,
                height: section.offsetHeight,
              };
            }
            return null;
          })
          .filter(Boolean);

        const currentPosition = window.scrollY;

        const active = sections.find(
          (section) =>
            currentPosition >= section.offset &&
            currentPosition < section.offset + section.height
        );

        setActiveSection(active ? active.id : "Home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Disable scroll body saat menu mobile dibuka
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  // Fungsi untuk navigasi dan scroll ke section
  const navigateAndScroll = (e, href) => {
    e.preventDefault();

    if (href === "/login") {
      setIsOpen(false);
      navigate("/login");
      return;
    }

    const sectionId = href.replace("#", "");
    if (location.pathname !== "/") {
      // Jika tidak di halaman utama, navigasi ke / dan scroll ke section
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      // Jika sudah di /, langsung scroll
      const section = document.querySelector(href);
      if (section) {
        const top = section.offsetTop - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
      setIsOpen(false);
    }
  };

  // Handle scroll setelah navigasi (untuk kasus lintas rute)
  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const section = document.querySelector(`#${location.state.scrollTo}`);
      if (section) {
        const top = section.offsetTop - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
      // Bersihkan state setelah scroll
      navigate("/", { state: null, replace: true });
    }
  }, [location, navigate]);

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
            <Link
              to="/"
              onClick={(e) => navigateAndScroll(e, "#Home")}
              className="text-2xl font-extrabold text-orange-500 tracking-wide"
            >
              Nugra21
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={location.pathname === "/" ? item.href : "/"}
                onClick={(e) => navigateAndScroll(e, item.href)}
                className={`group relative px-1 py-2 text-sm font-medium ${
                  activeSection === item.href.substring(1) && location.pathname === "/"
                    ? "text-orange-500 font-semibold"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transform origin-left transition-transform duration-300 ${
                    activeSection === item.href.substring(1) && location.pathname === "/"
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
            {/* kalau mau matikan */}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition"
            >
              Login
            </Link>
          </div>

          {/* Hamburger Mobile */}
          <div className="md:hidden">
            <button
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsOpen(!isOpen)}
              className="text-orange-500 hover:text-orange-600 transition-colors duration-300"
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
            <Link
              key={item.label}
              to={location.pathname === "/" ? item.href : "/"}
              onClick={(e) => navigateAndScroll(e, item.href)}
              className={`px-6 py-4 text-lg font-medium transition-all duration-300 ${
                activeSection === item.href.substring(1) && location.pathname === "/"
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
            </Link>
          ))}
          {/* Kalau mau matikan */}
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