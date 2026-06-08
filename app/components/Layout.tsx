import { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f7f7f7] font-sans text-[#1e1b1c]">
      {/* Mobile Header for Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a5331] z-30 flex items-center justify-between px-4 text-white">
        <div className="font-bold text-lg flex items-center gap-2">
          Gatil ONG
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 md:ml-64 min-h-screen pt-16 md:pt-0 w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
