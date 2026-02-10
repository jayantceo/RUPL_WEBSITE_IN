import React from 'react';
import { User } from '../types';
import { Plus } from 'lucide-react';

interface StoriesProps {
  currentUser: User;
  users: User[];
}

export const Stories: React.FC<StoriesProps> = ({ currentUser, users }) => {
  const otherUsers = users.filter(u => u.id !== currentUser.id);

  // Use a mock list to make the scroll area feel full like a real app
  const displayUsers = [...otherUsers, ...otherUsers, ...otherUsers].slice(0, 10);

  return (
    <div className="bg-white md:border border-gray-200 md:rounded-xl py-4 mb-4 md:mb-6 overflow-x-auto scrollbar-hide">
      <div className="flex space-x-4 px-4 min-w-max">
        {/* Current User Story Add */}
        <div className="flex flex-col items-center space-y-1 cursor-pointer group shrink-0">
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-[3px] border-2 border-gray-100">
              <img 
                src={currentUser.profilePic} 
                alt="Your Story" 
                className="w-full h-full rounded-full object-cover transition-opacity group-hover:opacity-90"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-0.5 border-[3px] border-white shadow-sm">
              <Plus size={14} strokeWidth={4} />
            </div>
          </div>
          <span className="text-xs text-gray-500 font-medium group-hover:text-black transition-colors">Your story</span>
        </div>

        {/* Other Users */}
        {displayUsers.map((user, idx) => (
          <div key={`${user.id}-${idx}`} className="flex flex-col items-center space-y-1 cursor-pointer group shrink-0">
            {/* Instagram Style Gradient Ring */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-hover:scale-105 transition-transform duration-300 ease-out shadow-sm">
              <div className="bg-white p-[2px] rounded-full w-full h-full">
                <img 
                  src={user.profilePic} 
                  alt={user.username} 
                  className="w-full h-full rounded-full object-cover border border-gray-100"
                />
              </div>
            </div>
            <span className="text-xs text-gray-900 font-medium truncate w-16 text-center">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
