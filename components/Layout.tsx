
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Desktop and Mobile Overlay */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="p-4 md:p-8 flex-1 w-full max-w-full overflow-hidden">
          {children}
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
