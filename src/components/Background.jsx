import React from "react";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Latar belakang gradasi blur */}
      <div className="absolute inset-0">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-screen filter blur-[150px] opacity-50"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-screen filter blur-[150px] opacity-50"></div>
      </div>

      {/* Overlay grid garis kotak-kotak */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    </div>
  );
};

export default AnimatedBackground;
