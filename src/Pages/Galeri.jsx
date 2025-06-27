import React, { useEffect, useState, memo } from "react";
import { SiReact, SiJavascript, SiFlutter } from "react-icons/si";
import AOS from "aos";
import "aos/dist/aos.css";

const CharacterShowcase = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-out-back", once: true });
  }, []);

  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const characters = [
    {
      id: 1,
      name: "Keqing",
      game: "Genshin Impact",
      role: "Electro DPS",
      element: "Electro",
      rarity: "5-Star",
      image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80",
      profileLink: "https://www.hoyolab.com",
      description: "Keqing slices through enemies with electrifying precision, leading Liyue with unwavering resolve.",
      stats: { attack: 323, defense: 799, hp: 13103 },
      quote: "Lightning strikes where I command.",
    },
    {
      id: 2,
      name: "Jianxin",
      game: "Wuthering Waves",
      role: "Support",
      element: "Aero",
      rarity: "5-Star",
      image: "https://images.unsplash.com/photo-1649788929899-3266b5484a73?auto=format&fit=crop&w=800&q=80",
      profileLink: "https://www.wutheringlab.com",
      description: "Jianxin manipulates the winds to protect allies and disrupt foes with serene mastery.",
      stats: { attack: 280, defense: 900, hp: 10500 },
      quote: "The wind carries my will.",
    },
    {
      id: 3,
      name: "Firefly",
      game: "Honkai: Star Rail",
      role: "Fire DPS",
      element: "Fire",
      rarity: "5-Star",
      image: "https://images.unsplash.com/photo-1606811948037-3a95d06f4606?auto=format&fit=crop&w=800&q=80",
      profileLink: "https://www.hoyolab.com",
      description: "Firefly burns brightly, her fiery attacks blazing a path through the stars.",
      stats: { attack: 350, defense: 650, hp: 12500 },
      quote: "My flames defy the void.",
    },
    {
      id: 4,
      name: "Ellen Joe",
      game: "Zenless Zone Zero",
      role: "Melee DPS",
      element: "Ice",
      rarity: "S-Rank",
      image: "https://images.unsplash.com/photo-1606149059529-956c6b86faaa?auto=format&fit=crop&w=800&q=80",
      profileLink: "https://www.hoyolab.com",
      description: "Ellen Joe delivers icy slashes with shark-like ferocity in New Eridu’s battles.",
      stats: { attack: 340, defense: 700, hp: 11500 },
      quote: "Freeze, or get bitten.",
    },
    {
      id: 5,
      name: "Danjin",
      game: "Wuthering Waves",
      role: "Havoc DPS",
      element: "Havoc",
      rarity: "4-Star",
      image: "https://images.unsplash.com/photo-1591479304842-9b78f1b0b1d7?auto=format&fit=crop&w=800&q=80",
      profileLink: "https://www.wutheringlab.com",
      description: "Danjin’s chaotic Havoc attacks leave enemies in disarray with every strike.",
      stats: { attack: 290, defense: 750, hp: 10000 },
      quote: "Chaos is my canvas.",
    },
  ];

  const closeModal = () => setSelectedCharacter(null);

  return (
    <section
      className="min-h-screen bg-fixed bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 pt-24 pb-16 overflow-x-hidden relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1920&q=80')" }}
      id="Characters"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 to-black/65 backdrop-blur-lg"></div>
      <div className="relative max-w-7xl mx-auto w-full z-10">
        <h2
          className="text-5xl md:text-6xl font-extrabold text-center mb-16 text-orange-200 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-800 drop-shadow-[0_3px_6px_rgba(251,146,60,0.9)]"
          data-aos="fade-down"
        >
          Neon Character Nexus
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {characters.map((character) => (
            <div
              key={character.id}
              className="group relative bg-gradient-to-br from-gray-900/85 to-gray-800/85 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_4px_rgba(251,146,60,0.8)] border border-orange-600/60 cursor-pointer"
              data-aos="flip-up"
              data-aos-delay={character.id * 200}
              onClick={() => setSelectedCharacter(character)}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-700/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 bg-orange-800/90 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                  {character.rarity}
                </div>
                <div className="absolute bottom-4 left-4 bg-gray-900/90 text-orange-300 text-xs font-semibold px-3 py-1 rounded-full">
                  {character.element}
                </div>
              </div>
              <div className="p-6 relative">
                <h3 className="text-2xl font-bold text-orange-200 mb-1 tracking-wide">{character.name}</h3>
                <p className="text-gray-300 text-sm mb-2">{character.game}</p>
                <p className="text-gray-200 text-sm font-medium">{character.role}</p>
                <div className="flex space-x-4 mt-4">
                  <SiReact className="text-3xl text-orange-400 group-hover:text-orange-200 transition-colors duration-300" />
                  <SiJavascript className="text-3xl text-orange-400 group-hover:text-orange-200 transition-colors duration-300" />
                  <SiFlutter className="text-3xl text-orange-400 group-hover:text-orange-200 transition-colors duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCharacter && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4" data-aos="zoom-in" data-aos-duration="400">
          <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl max-w-3xl w-full p-8 shadow-[0_0_40px_rgba(251,146,60,0.9)] border border-orange-600/70 overflow-hidden">
            <div className="absolute inset-0 bg-orange-600/10 animate-pulse"></div>
            <button
              className="absolute top-4 right-4 text-orange-200 hover:text-orange-400 text-3xl font-bold z-10"
              onClick={closeModal}
            >
              ×
            </button>
            <div className="flex flex-col md:flex-row gap-8 relative">
              <div className="flex-shrink-0 relative">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-full md:w-64 h-64 object-cover rounded-xl shadow-[0_0_20px_rgba(251,146,60,0.6)]"
                />
                <div className="absolute inset-0 bg-orange-600/20 rounded-xl"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-4xl font-extrabold text-orange-200 mb-3 tracking-tight">{selectedCharacter.name}</h3>
                <p className="text-gray-300 text-base mb-3 font-medium">{selectedCharacter.game}</p>
                <div className="grid grid-cols-2 gap-2 text-gray-200 text-sm mb-4">
                  <p><span className="font-semibold text-orange-300">Role:</span> {selectedCharacter.role}</p>
                  <p><span className="font-semibold text-orange-300">Element:</span> {selectedCharacter.element}</p>
                  <p><span className="font-semibold text-orange-300">Rarity:</span> {selectedCharacter.rarity}</p>
                  <p><span className="font-semibold text-orange-300">Attack:</span> {selectedCharacter.stats.attack}</p>
                  <p><span className="font-semibold text-orange-300">Defense:</span> {selectedCharacter.stats.defense}</p>
                  <p><span className="font-semibold text-orange-300">HP:</span> {selectedCharacter.stats.hp}</p>
                </div>
                <p className="text-gray-200 text-base mb-4 italic font-medium">"{selectedCharacter.quote}"</p>
                <p className="text-gray-200 text-base mb-6">{selectedCharacter.description}</p>
                <div className="flex space-x-4 mb-6">
                  <SiReact className="text-3xl text-orange-400 hover:text-orange-200 transition-colors duration-300" />
                  <SiJavascript className="text-3xl text-orange-400 hover:text-orange-200 transition-colors duration-300" />
                  <SiFlutter className="text-3xl text-orange-400 hover:text-orange-200 transition-colors duration-300" />
                </div>
                <a
                  href={selectedCharacter.profileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-orange-500 transition-colors duration-300 shadow-[0_0_15px_rgba(251,146,60,0.7)]"
                >
                  Explore Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default memo(CharacterShowcase);