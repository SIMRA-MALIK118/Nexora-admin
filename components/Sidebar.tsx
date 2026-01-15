
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Settings,
  FileText,
  FolderKanban,
  LogOut,
  X
} from 'lucide-react';
import { AppRoute } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: AppRoute.DASHBOARD },
    { name: 'Projects', icon: FolderKanban, path: AppRoute.PROJECTS },
    { name: 'Services', icon: Settings, path: AppRoute.SERVICES },
    { name: 'Blogs', icon: FileText, path: AppRoute.BLOGS },
    { name: 'Careers', icon: Briefcase, path: AppRoute.CAREERS },
  ];

  const handleLogout = () => {
    localStorage.removeItem('ca_admin_token');
    navigate(AppRoute.LOGIN);
  };

  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d0d] text-white flex flex-col transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="../assets/Logo.png"
            alt="Code Axis Logo"
            className="w-30 h-20 object-contain"
          />
        </div>

        <button
          onClick={onClose}
          className="p-2 lg:hidden text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>


      <nav className="flex-1 px-4 mt-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => onClose()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                      ? 'bg-white text-black font-semibold shadow-lg shadow-white/10'
                      : 'hover:bg-white/10 text-gray-400 hover:text-white'
                    }`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
