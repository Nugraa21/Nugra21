import React, { useEffect } from "react";
import { Briefcase, School, Activity } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const experienceData = [
  {
    icon: Briefcase,
    title: "----------------",
    place: "PT ------------------",
    time: "Jan --- - Mar ---",
    description:
      "--------- ------- ------------- ----------- --------",
    delay: 100,
  },
  {
    icon: School,
    title: "Teknik Komputer",
    place: "Universitas Teknologi Digital Indonesia (UTDI)",
    time: "2022 - Sekarang",
    description:
      "Mempelajari pemrograman, sistem digital, robotika, jaringan, dan Internet of Things (IoT).",
    delay: 300,
  },
  {
    icon: Activity,
    title: "Freelance Designer",
    place: "Remote",
    time: "2016 - Sekarang",
    description:
      "Mengerjakan berbagai proyek desain grafis, video editing, dan UI/UX untuk klien lokal dan luar negeri.",
    delay: 500,
  },
  {
    icon: Briefcase,
    title: "Frontend Developer",
    place: "Startup Teknologi XYZ",
    time: "Apr 2024 - Dec 2024",
    description:
      "Merancang antarmuka pengguna interaktif menggunakan Next.js dan Tailwind CSS untuk aplikasi e-commerce.",
    delay: 700,
  },
];

const ExperienceCard = ({ icon: Icon, title, place, time, description, delay, isLeft }) => (
  <div
    className={`relative p-5 rounded-xl bg-white bg-opacity-90 backdrop-blur-md border border-orange-100 shadow-lg transition-all duration-300 hover:scale-102 hover:shadow-xl w-full max-w-[280px] sm:max-w-[340px] ${
      isLeft
        ? "sm:mr-auto sm:pr-10 md:pr-12"
        : "sm:ml-auto sm:pl-10 md:pl-12"
    } mx-auto sm:mx-0`}
    data-aos={isLeft ? "fade-right" : "fade-left"}
    data-aos-delay={delay}
    tabIndex={0}
    role="group"
    aria-label={`Pengalaman: ${title} di ${place}`}
  >
    <div className="flex items-center mb-3">
      <div className="bg-gradient-to-br from-orange-600 to-yellow-500 text-white p-2.5 rounded-full shadow-sm mr-3">
        <Icon className="w-4 h-4" aria-hidden="true" />
      </div>
      <div>
        <h4 className="text-base font-bold text-orange-800">{title}</h4>
        <p className="text-xs font-semibold text-gray-600">{place}</p>
        <p className="text-xs text-gray-500 italic">{time}</p>
      </div>
    </div>
    <p className="text-xs text-gray-700 leading-relaxed">{description}</p>
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-orange-600 rounded-full border-2 border-white shadow-sm sm:block hidden ${
        isLeft ? "right-0 -mr-8 md:-mr-10" : "left-0 -ml-8 md:-ml-10"
      }`}
    ></div>
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 h-0.5 bg-orange-500 sm:block hidden ${
        isLeft
          ? "right-4 sm:right-4 md:right-4 w-4 sm:w-6 md:w-8"
          : "left-4 sm:left-4 md:left-4 w-4 sm:w-6 md:w-8"
      }`}
    ></div>
  </div>
);

const Pengalaman = () => {
  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  return (
    <section
      className="px-[5%] sm:px-[8%] lg:px-[10%] py-16 bg-transparent scroll-mt-24 relative"
      id="Experience"
    >
      <div className="text-center mb-10">
        <h2
          className="text-4xl sm:text-5xl font-extrabold text-orange-600"
          data-aos="zoom-in-up"
          data-aos-duration="600"
        >
          Experience
        </h2>
        <p
          className="mt-2 text-orange-400 max-w-3xl mx-auto text-lg flex items-center justify-center gap-2 font-semibold"
          data-aos="zoom-in-up"
          data-aos-duration="800"
          aria-hidden="true"
        >
          - - - - - - - -
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full border-r-2 border-orange-400 border-dashed sm:block hidden"></div>
        <div className="space-y-8">
          {experienceData.map((item, index) => (
            <div key={index} className="relative">
              <ExperienceCard {...item} isLeft={index % 2 === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pengalaman;