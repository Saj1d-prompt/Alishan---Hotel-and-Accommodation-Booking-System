import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function SidebarItem({
  icon: Icon,
  label,
  to,
  collapsed,
}) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"}
      aria-label={label}
    >
      {({ isActive }) => (
        <motion.div
          whileHover={{
            x: 4,
          }}
          whileTap={{
            scale: 0.98,
          }}
          className={`mx-3 mb-2 flex h-11 items-center rounded-xl px-3 transition-all ${
            isActive
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Icon size={20} />

          {!collapsed ? (
            <span className="ml-3 text-sm font-medium">
              {label}
            </span>
          ) : null}
        </motion.div>
      )}
    </NavLink>
  );
}