import React from "react";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gray-50">
      {/* Gradasi background abu-abu lembut */}
      <div className="absolute inset-0">
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] bg-gradient-to-br from-gray-300 to-gray-100 rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>
        <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] bg-gradient-to-br from-gray-200 to-gray-400 rounded-full mix-blend-screen filter blur-[100px] opacity-25"></div>
      </div>

      {/* Overlay gradasi oranye putih samar di atas grid */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-orange-100/30 to-transparent" />

      {/* Grid garis pensil yang sangat samar */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            `linear-gradient(to right, rgba(0,0,0,0.01) 1px, transparent 1px),
             linear-gradient(to bottom, rgba(0,0,0,0.01) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Coretan pensil manual dengan garis diagonal */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(0,0,0,0.04),
              rgba(0,0,0,0.04) 2px,
              transparent 2px,
              transparent 6px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(0,0,0,0.03),
              rgba(0,0,0,0.03) 1px,
              transparent 1px,
              transparent 5px
            )`,
          backgroundSize: '40px 40px',
          mixBlendMode: 'multiply',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
