import {
  Bell,
  LogOut,
  Menu,
} from "lucide-react";
import {
  useNavigate,
} from "react-router-dom";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Button,
} from "@/components/ui/button";

import useAuth from "@/context/useAuth";
import useLayout from "@/context/useLayout";

export default function Header() {
  const {
    toggleSidebar,
  } = useLayout();

  const {
    user,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const handleLogout =
    async () => {
      await logout();

      navigate(
        "/admin/login",
        {
          replace: true,
        },
      );
    };

  const initials =
    user?.name
      ?.split(" ")
      .map(
        (part) =>
          part[0],
      )
      .join("")
      .slice(0, 2)
      .toUpperCase()
    ?? "AD";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md">
      <Button
        variant="ghost"
        size="icon"
        onClick={
          toggleSidebar
        }
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">
            {user?.name}
          </p>

          <p className="text-xs text-slate-500">
            {user?.email}
          </p>
        </div>

        <Avatar>
          <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        <Button
          variant="ghost"
          size="icon"
          onClick={
            handleLogout
          }
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}