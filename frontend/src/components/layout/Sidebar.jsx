import {
  BedDouble,
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import useLayout from "@/context/useLayout";

import Logo from "./Logo";
import SidebarItem from "./SidebarItem";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    to: "/admin",
  },
  {
    icon: Users,
    label: "Guests",
    to: "/admin/guests",
  },
  {
    icon: Building2,
    label: "Properties",
    to: "/admin/properties",
  },
  {
    icon: BedDouble,
    label: "Rooms",
    to: "/admin/rooms",
  },
  {
    icon: CalendarDays,
    label: "Bookings",
    to: "/admin/bookings",
  },
  {
    icon: CreditCard,
    label: "Payments",
    to: "/admin/payments",
  },
  {
    icon: FileText,
    label: "Reports",
    to: "/admin/reports",
  },
  {
    icon: Settings,
    label: "Settings",
    to: "/admin/settings",
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
      className="flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white shadow-sm"
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
        {!collapsed ? (
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">
              Alishan
            </p>

            <p className="text-xs text-slate-500">
              Accommodation System
            </p>
          </div>
        ) : null}
      </div>
    </motion.aside>
  );
}