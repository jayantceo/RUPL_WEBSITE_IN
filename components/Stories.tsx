import React from 'react';
import { User } from '../types';
import { Plus } from 'lucide-react';

interface StoriesProps {
  currentUser: User;
  users: User[];
}

export const Stories: React.FC<StoriesProps> = ({ currentUser, users }) => {
  const otherUsers = users.filter(u => u.id !== currentUser.id);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 overflow-x-auto scrollbar-hide">
      <div className="flex space-x-4 min-w-max">
        {/* Current User Story Add */}
        <div className="flex flex-col items-center space-y-1 cursor-pointer group">
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-[2px] border-2 border-gray-100">
              <img 
                src={currentUser.profilePic} 
                alt="Your Story" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
              <Plus size={14} />
            </div>
          </div>
          <span className="text-xs text-gray-500">Your story</span>
        </div>

        {/* Other Users */}
        {otherUsers.map((user) => (
          <div key={user.id} className="flex flex-col items-center space-y-1 cursor-pointer group">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600 group-hover:scale-105 transition-transform">
              <div className="bg-white p-[2px] rounded-full w-full h-full">
                <img 
                  src={user.profilePic} 
                  alt={user.username} 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs text-black font-medium">{user.username}</span>
          </div>
        ))}
        
        {/* Mock extra stories for visual filler */}
        {[...Array(5)].map((_, i) => (
          <div key={`mock-${i}`} className="flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-gray-200 to-gray-300">
               <div className="bg-white p-[2px] rounded-full w-full h-full">
                 <div className="w-full h-full rounded-full bg-gray-100" />
               </div>
            </div>
            <span className="text-xs text-gray-300 w-12 h-3 bg-gray-100 rounded mt-1"></span>
          </div>
        ))}
      </div>
    </div>
  );
};