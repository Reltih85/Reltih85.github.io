import { Link, NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Menu } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/patodev-favicon.png"; 

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-xl transition hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
          isActive ? "bg-neutral-100 dark:bg-neutral-800" : ""
        }`
      }
      onClick={() => setOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-neutral-950/50 border-b border-neutral-200/60 dark:border-neutral-800">
      <div className="container-section flex items-center justify-between h-16">
        {/* Logo + marca */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="PatoDev Technologies"
            className="h-9 w-auto rounded-md"
            loading="eager"
          />
          <div className="leading-tight">
            <span className="font-extrabold tracking-tight text-base md:text-lg">
              PATO<span className="text-brand">DEV</span>
            </span>
            <div className="hidden sm:block text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 -mt-0.5">
              TECHNOLOGIES
            </div>
          </div>
        </Link>

        {/* navegación desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/">Inicio</NavItem>
          <NavItem to="/projects">Proyectos</NavItem>
          <NavItem to="/apps">Apps</NavItem>
          <NavItem to="/contact">Contacto</NavItem>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>

        {/* botón menú móvil */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* menú móvil */}
      {open && (
        <div className="md:hidden border-t border-neutral-200/60 dark:border-neutral-800">
          <div className="container-section py-2 flex flex-col gap-1">
            <NavItem to="/">Inicio</NavItem>
            <NavItem to="/projects">Proyectos</NavItem>
            <NavItem to="/apps">Apps</NavItem>
            <NavItem to="/contact">Contacto</NavItem>
            <div className="py-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
