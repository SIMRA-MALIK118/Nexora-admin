
import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 lg:hidden hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden sm:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-full max-w-[300px] lg:max-w-md focus-within:ring-2 focus-within:ring-black/5 transition-all">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-2 md:gap-3 md:border-l md:pl-6 border-gray-200">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-900 leading-tight">Admin User</p>
            <p className="text-xs text-gray-500 font-medium">Super Admin</p>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 bg-[#0d0d0d] rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-gray-100">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
