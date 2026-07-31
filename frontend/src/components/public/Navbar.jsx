import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/logo/Alishan1.png";

const navItems = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Rooms", path: "/rooms" },
    { name: "Book Now", path: "/booking" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
];

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b">
            <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

                {/* Logo */}
                <NavLink to="/">
                    <img
                        src={logo}
                        alt="Alishan Accommodation"
                        className="h-20 w-auto object-contain"
                    />
                </NavLink>

                {/* Desktop Menu */}
                <nav className="hidden lg:flex gap-8">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold"
                                    : "text-gray-700 hover:text-blue-600 transition"
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Language */}
                <div className="hidden lg:block">
                    <button className="border rounded-lg px-4 py-2 hover:bg-gray-100">
                        🇬🇧 EN
                    </button>
                </div>

                {/* Mobile */}
                <button
                    className="lg:hidden"
                    onClick={() => setOpen(!open)}
                >
                    <Menu size={28} />
                </button>

            </div>

            {open && (
                <div className="lg:hidden bg-white border-t">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="block px-6 py-4 border-b hover:bg-gray-50"
                            onClick={() => setOpen(false)}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            )}
        </header>
    );
};

export default Navbar;