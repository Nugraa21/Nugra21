import React from "react";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-t from-orange-50 via-yellow-50 to-white">
      {/* Blur besar kiri atas */}
      <div className="absolute top-[-120px] left-[-100px] w-[450px] h-[450px] rounded-full bg-orange-300 opacity-30 filter blur-[120px] mix-blend-multiply"></div>

      {/* Blur besar kanan bawah */}
      <div className="absolute bottom-[-150px] right-[-110px] w-[500px] h-[500px] rounded-full bg-yellow-300 opacity-25 filter blur-[130px] mix-blend-multiply"></div>

      {/* Overlay gradasi putih transparan ke atas */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/70 via-white/30 to-transparent"></div>

      {/* Gelombang awan bertumpuk di tengah-tengah */}
      <svg
        className="absolute left-0 top-1/2 w-full max-h-80 opacity-30 -translate-y-1/2"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Layer 1 - paling bawah, warna soft oranye */}
        <path
          fill="#FCD34D"
          fillOpacity="0.2"
          d="M0,224L80,197.3C160,171,320,117,480,96C640,75,800,85,960,96C1120,107,1280,117,1360,122.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        />
        {/* Layer 2 */}
        <path
          fill="#F97316"
          fillOpacity="0.15"
          d="M0,192L80,181.3C160,171,320,149,480,138.7C640,128,800,128,960,128C1120,128,1280,128,1360,128L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        />
        {/* Layer 3 */}
        <path
          fill="#FCD34D"
          fillOpacity="0.15"
          d="M0,160L80,170.7C160,181,320,203,480,213.3C640,224,800,224,960,213.3C1120,203,1280,181,1360,170.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        />
        {/* Layer 4 - putih, tipis */}
        <path
          fill="#FFF"
          fillOpacity="0.25"
          d="M0,128L80,138.7C160,149,320,171,480,186.7C640,203,800,213,960,213.3C1120,213,1280,203,1360,197.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        />
        {/* Layer 5 - putih soft, paling atas */}
        <path
          fill="#FFF"
          fillOpacity="0.35"
          d="M0,96L80,112C160,128,320,160,480,176C640,192,800,192,960,176C1120,160,1280,128,1360,112L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        />
      </svg>
    </div>
  );
};

export default AnimatedBackground;
