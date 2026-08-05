import {
  Bell,
  Menu,
  Moon,
  Search,
} from "lucide-react";

import useLayout from "@/context/useLayout";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header() {
  const { toggleSidebar } = useLayout();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <Input
            placeholder="Search..."
            className="w-80 pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle appearance"
        >
          <Moon className="h-5 w-5" />
        </Button>

        <Avatar>
          <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
            SA
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}