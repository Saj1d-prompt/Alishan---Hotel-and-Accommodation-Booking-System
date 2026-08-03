import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

import logo from "@/assets/logo/Alishan1.png";

const navItems = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Locations",
    path: "/locations",
  },
  {
    name: "Rooms",
    path: "/rooms",
  },
  {
    name: "Book Now",
    path: "/booking",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <NavLink
          to="/"
          aria-label="Alishan Accommodation home"
          onClick={closeMobileMenu}
        >
          <img
            src={logo}
            alt="Alishan Accommodation"
            className="h-20 w-auto object-contain"
          />
        </NavLink>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "font-medium transition-colors",
                  isActive
                    ? "text-blue-600"
                    : "text-slate-700 hover:text-blue-600",
                ].join(" ")
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label={
            isMobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((current) => !current)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav className="border-t border-slate-200 bg-white lg:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                [
                  "block border-b border-slate-100 px-6 py-4 font-medium transition",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-600",
                ].join(" ")
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;