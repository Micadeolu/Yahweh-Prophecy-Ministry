import React from 'react';
import type { Prophet } from '../types';

interface ProphetCardProps {
  prophet: Prophet;
  onSelect: (prophet: Prophet) => void;
  logoUrl?: string;
}

export const ProphetCard: React.FC<ProphetCardProps> = ({ prophet, onSelect, logoUrl }) => {
  const isAdmin = prophet.username === 'Admin';
const imageSrc = isAdmin && logoUrl ? logoUrl : prophet.profilePicture;
return (
    <div
      onClick={() => onSelect(prophet)}
      className="group relative cursor-pointer text-center p-6 bg-gray-800/60 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(252,211,77,0.2)] border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
    >
      <div className="flex-grow">
        <img
          src={imageSrc}
          alt={prophet.username}
          className={`w-28 h-28 rounded-full mx-auto border-4 border-gray-700 group-hover:border-yellow-400 transition-colors duration-300 ${isAdmin && logoUrl ? 'object-contain 
bg-gray-900 p-1' : 'object-cover'}`}
        />
        <h3 className="mt-4 text-xl font-bold text-gray-100 group-hover:text-yellow-300 transition-colors duration-300">
          {prophet.username}
        </h3>
        <p className="text-sm text-gray-400 group-hover:text-yellow-400 transition-colors duration-300">{prophet.title}</p>
      </div>

       <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div
          className="w-full bg-yellow-500 group-hover:bg-yellow-400 text-gray-900 font-bold py-2.5 px-4 rounded-lg 
text-md transition-colors duration-300"
        >
          {isAdmin ?
'Access Panel' : 'Prophecy Enquiry'}
        </div>
      </div>
    </div>
  );
};