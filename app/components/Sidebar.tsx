import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Settings, LogOut } from "lucide-react";
import avatarImg from "../assets/avatar.png";
import { sidebarGroups } from "./sidebarItems";
import { useAuth } from "../context/AuthContext";
import Loader from "~/components/Loader";
import { ImageWithFallback } from "./ImageWithFallback";

type SidebarProps = {
  onClose?: () => void;
};

const Sidebar : React.FC<SidebarProps> = ({ onClose }) => {

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
        auth.logout();
        navigate("/", { replace: true });
    };


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="w-64 h-full bg-[#1a5331] text-[#f7f7f7] flex flex-col overflow-y-auto">
      <div className="p-6 flex items-center justify-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden">
          <img src={avatarImg} alt="Logo Gatil" className="w-full h-full object-cover" />
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 flex flex-col">
        {sidebarGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-[#368c5e] text-white font-medium shadow-sm"
                        : "text-gray-200 hover:bg-[#368c5e]/50 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto relative" ref={profileMenuRef}>
        <button
          type="button"
          onClick={() => setIsProfileMenuOpen((value) => !value)}
          className="w-full bg-[#1a5331] brightness-90 hover:brightness-110 transition-all rounded-lg p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-[#368c5e] flex items-center justify-center overflow-hidden">
            <ImageWithFallback src={avatarImg} alt="Avatar Perfil" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{auth.user?.name ?? "Minha conta"}</span>            <span className="text-xs text-gray-300">Perfil</span>
          </div>
        </button>

        {isProfileMenuOpen && (
          <div className="absolute bottom-full left-4 mb-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 text-[#1e1b1c]">
            <button
              type="button"
              onClick={() => {
                navigate("/configuracoes");
                setIsProfileMenuOpen(false);
                onClose?.();
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              Configurações da Conta
            </button>

            <div className="h-px bg-gray-100 my-1" />

            <button
              type="button"
              onClick={() => {

                setIsProfileMenuOpen(false);
                handleLogout();

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

export default Sidebar;