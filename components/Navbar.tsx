import React from 'react';
import { Home, Search, PlusSquare, User, Compass, LayoutGrid } from 'lucide-react';
import { PageView } from '../types';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onCreatePost: () => void;
  userProfilePic?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onCreatePost, userProfilePic }) => {
  const isActive = (page: PageView) => currentPage === page;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 h-full w-20 xl:w-64 border-r border-gray-200 bg-white z-40 transition-all duration-300">
        <div className="p-6 mb-2 xl:mb-6">
          <h1 className="text-2xl font-black tracking-tight hidden xl:block">RUPL.</h1>
          <h1 className="text-2xl font-black tracking-tight xl:hidden text-center">R.</h1>
        </div>
        
        <nav className="space-y-2 px-2 flex-1">
          <NavItem 
             icon={<Home size={28} strokeWidth={isActive('HOME') ? 3 : 2} />} 
             label="Home" 
             isActive={isActive('HOME')} 
             onClick={() => onNavigate('HOME')} 
          />
          <NavItem 
             icon={<Search size={28} strokeWidth={2} />} 
             label="Search" 
             isActive={false} // Assuming search is handled in home or modal
             onClick={() => {}} 
          />
          <NavItem 
             icon={<Compass size={28} strokeWidth={isActive('RUPL') ? 3 : 2} />} 
             label="Explore" 
             isActive={isActive('RUPL')} 
             onClick={() => onNavigate('RUPL')} 
          />
          <NavItem 
             icon={<PlusSquare size={28} strokeWidth={2} />} 
             label="Create" 
             isActive={false} 
             onClick={onCreatePost} 
          />
          <NavItem 
             icon={
               userProfilePic ? 
               <img src={userProfilePic} className={`w-7 h-7 rounded-full object-cover border-2 ${isActive('PROFILE') ? 'border-black' : 'border-transparent'}`} alt="Profile" /> 
               : <User size={28} strokeWidth={isActive('PROFILE') ? 3 : 2} />
             } 
             label="Profile" 
             isActive={isActive('PROFILE')} 
             onClick={() => onNavigate('PROFILE')} 
          />
        </nav>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 px-6 py-3 flex justify-between items-center pb-safe">
        <button onClick={() => onNavigate('HOME')} className={`transition-transform ${isActive('HOME') ? 'scale-110 text-black' : 'text-gray-400'}`}>
          <Home size={28} strokeWidth={isActive('HOME') ? 2.5 : 2} />
        </button>
        
        <button onClick={() => onNavigate('RUPL')} className={`transition-transform ${isActive('RUPL') ? 'scale-110 text-black' : 'text-gray-400'}`}>
          <Compass size={28} strokeWidth={isActive('RUPL') ? 2.5 : 2} />
        </button>
        
        <button onClick={onCreatePost} className="text-black hover:scale-105 transition-transform active:scale-95">
          <PlusSquare size={28} strokeWidth={2} />
        </button>
        
        <button onClick={() => onNavigate('PROFILE')} className={`transition-transform ${isActive('PROFILE') ? 'scale-110 text-black' : 'text-gray-400'}`}>
          {userProfilePic ? (
             <img src={userProfilePic} className={`w-7 h-7 rounded-full object-cover border-2 ${isActive('PROFILE') ? 'border-black' : 'border-transparent'}`} alt="Profile" />
          ) : (
             <User size={28} strokeWidth={isActive('PROFILE') ? 2.5 : 2} />
          )}
        </button>
      </div>
      
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-40 px-4 py-3 flex justify-between items-center pt-safe">
         <h1 className="text-xl font-black tracking-tighter italic">RUPL.</h1>
         <div className="flex space-x-4">
             {/* Add notifications icon here later if needed */}
         </div>
      </div>
    </>
  );
};

const NavItem = ({ icon, label, isActive, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`flex items-center space-x-0 xl:space-x-4 w-full p-3 rounded-xl transition-all group hover:bg-gray-100 justify-center xl:justify-start ${isActive ? 'font-bold' : 'font-medium'}`}
  >
    <div className={`transition-transform group-hover:scale-110 ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>
      {icon}
    </div>
    <span className={`text-lg hidden xl:block ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>{label}</span>
  </button>
);