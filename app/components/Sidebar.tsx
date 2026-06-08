import { LayoutDashboard, Wallet, Cat, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import avatarImg from "../assets/avatar.png";

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/financeiro', label: 'Financeiro', icon: Wallet },
  { path: '/gatos', label: 'Gatos', icon: Cat },
  { path: '/voluntarios', label: 'Voluntários', icon: Users },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="w-64 bg-[#1a5331] text-[#f7f7f7] flex flex-col h-screen fixed top-0 left-0 overflow-y-auto">
      <div className="p-6 flex items-center justify-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden">
          <img 
            src={avatarImg} 
            alt="Logo Gatil" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 flex flex-col">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-[#368c5e] text-white font-medium shadow-sm'
                    : 'text-gray-200 hover:bg-[#368c5e]/50 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 mt-auto relative" ref={profileMenuRef}>
        <button 
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="w-full bg-[#1a5331] brightness-90 hover:brightness-110 transition-all rounded-lg p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-[#368c5e] flex items-center justify-center overflow-hidden">
             <img 
              src={avatarImg} 
              alt="Avatar Perfil" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Admin Gatil</span>
            <span className="text-xs text-gray-300">Perfil</span>
          </div>
        </button>

        {isProfileMenuOpen && (
          <div className="absolute bottom-full left-4 mb-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 text-[#1e1b1c]">
            <button 
              onClick={() => {
                navigate('/configuracoes');
                setIsProfileMenuOpen(false);
                if (onClose) onClose();
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              Configurações da Conta
            </button>
            <div className="h-px bg-gray-100 my-1"></div>
            <button 
              onClick={() => {
                navigate('/');
                setIsProfileMenuOpen(false);
                if (onClose) onClose();
              }}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Deslogar
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

import { Settings, LogOut } from 'lucide-react';
