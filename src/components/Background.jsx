import React, { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const blobRefs = useRef([]);

  useEffect(() => {
    let requestId;

    const handleScroll = () => {
      const newScroll = window.pageYOffset;

      // Blob animasi mengikuti scroll dengan gerakan sederhana
      blobRefs.current.forEach((blob, index) => {
        const xOffset = Math.sin(newScroll / 200 + index) * 100;
        const yOffset = Math.cos(newScroll / 200 + index) * 50;
        blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        blob.style.transition = "transform 0.8s ease-out";
      });

      requestId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Blob Gradasi sederhana */}
      <div className="absolute inset-0">
        <div
          ref={(ref) => (blobRefs.current[0] = ref)}
          className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-screen filter blur-[80px] opacity-50"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[1] = ref)}
          className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-screen filter blur-[80px] opacity-50"
        ></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;