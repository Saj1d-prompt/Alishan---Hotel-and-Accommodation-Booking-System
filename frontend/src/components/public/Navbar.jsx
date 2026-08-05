import { useState } from "react";
import {
  CalendarDays,
  Menu,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
} from "react-router-dom";

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
    name: "About",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

const Navbar = () => {
  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          to="/"
          aria-label="Alishan Accommodation home"
          onClick={closeMobileMenu}
          className="shrink-0"
        >
          <img
            src={logo}
            alt="Alishan Accommodation"
            className="h-16 w-auto object-contain"
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <nav className="flex items-center gap-8">
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

          <Link
            to="/locations"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <CalendarDays size={18} />
            Book Now
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label={
            isMobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMobileMenuOpen}
          onClick={() =>
            setIsMobileMenuOpen(
              (current) => !current
            )
          }
        >
          {isMobileMenuOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>

      {isMobileMenuOpen ? (
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

          <Link
            to="/locations"
            onClick={closeMobileMenu}
            className="m-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            <CalendarDays size={18} />
            Book Now
          </Link>
        </nav>
      ) : null}
    </header>
  );
};

export default Navbar;