import { useState } from "react";
import { Navigate, Outlet } from "react-router";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import patternBg from "../assets/grafismo/1.png";
import { useAuth } from "~/context/AuthContext";
import Loader from "~/components/Loader";
import "~/styles/loader.css";

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const auth = useAuth();

  if (auth.checking) {
    return <Loader />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-sans text-[#1e1b1c] relative overflow-hidden">

       {/* Pattern Background */}
            <div 
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                backgroundImage: `url(${patternBg})`,
                backgroundRepeat: 'repeat',
                backgroundSize: '  250px', // Creates a good distance between the graphics
                opacity: 0.07,
                mixBlendMode: 'multiply'
            }}
            />

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a5331] z-30 flex items-center justify-between px-4 text-white">
        <div className="font-bold text-lg">Gatil ONG</div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((value) => !value)}
          aria-label="Abrir menu"
          className="p-2 rounded-md hover:bg-white/10"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </aside>

      <main className="min-h-screen w-full md:pl-64 pt-16 md:pt-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}