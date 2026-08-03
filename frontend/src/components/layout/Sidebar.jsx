import useLayout from "@/hooks/useLayout";
import {
  LayoutDashboard,
  Users,
  Building2,
  BedDouble,
  CalendarDays,
  CreditCard,
  FileText,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

import Logo from "./Logo";
import SidebarItem from "./SidebarItem";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    icon: Users,
    label: "Guests",
    to: "/guests",
  },
  {
    icon: Building2,
    label: "Properties",
    to: "/properties",
  },
  {
    icon: BedDouble,
    label: "Rooms",
    to: "/rooms",
  },
  {
    icon: CalendarDays,
    label: "Bookings",
    to: "/bookings",
  },
  {
    icon: CreditCard,
    label: "Payments",
    to: "/payments",
  },
  {
    icon: FileText,
    label: "Reports",
    to: "/reports",
  },
  {
    icon: Settings,
    label: "Settings",
    to: "/settings",
  },
];

export default function Sidebar() {
    const { collapsed } = useLayout();
  return (
    <motion.aside
      animate={{
        width: collapsed ? 80 : 260,
      }}
      transition={{
        duration: 0.25,
        ease: "easeInOut",
      }}
      className="flex h-screen flex-col border-r border-slate-200 bg-white shadow-sm"
    >
      <Logo collapsed={collapsed} />

      <nav className="mt-4 flex-1 overflow-y-auto px-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        {!collapsed && (
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">
              Alishan
            </p>

            <p className="text-xs text-slate-500">
              Accommodation System
            </p>
          </div>
        )}
      </div>
    </motion.aside>
  );
}