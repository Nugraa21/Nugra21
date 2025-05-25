import React from 'react';

const TechStackIcon = ({ TechStackIcon, Language }) => {
  return (
    <div className="group p-6 rounded-2xl cursor-pointer flex flex-col items-center justify-center gap-4
                    transition-transform duration-300 ease-in-out">
      <img 
        src={TechStackIcon} 
        alt={`${Language} icon`} 
        className="h-16 w-16 md:h-20 md:w-20 object-contain transition-transform duration-300 group-hover:scale-110"
      />
      <span className="text-orange-500 font-semibold text-base md:text-lg tracking-wide">
        {Language}
      </span>
    </div>
  );
};

export default TechStackIcon;
