import React from "react";
import { Bell, Search, Settings, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useSidebarContext } from "@/context/SidebarContext";
import { SidebarTrigger } from "../ui/sidebar";
import { Badge } from "../ui/badge";
import { useUser } from "@/context/UserContext";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { isOpen, toggle } = useSidebarContext();
  const {user} = useUser();

  return (
    <header className="bg-background/80 dark:bg-black backdrop-blur-sm border-b dark:border-slate-700 z-30 sticky top-0">
      <div className="px-4 flex justify-between items-center h-[60px]">
        <div className="flex items-center gap-4">
          <SidebarTrigger
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
          </SidebarTrigger>
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-md w-64 
                focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-slate-600
                text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-700 dark:text-gray-200" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-700 dark:text-gray-200" />
          </Button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-slate-800">
                <Bell className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-white dark:bg-slate-900 border dark:border-slate-700">
              <DropdownMenuLabel className="text-gray-900 dark:text-gray-100">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-700" />
              <DropdownMenuItem className="focus:bg-gray-100 dark:focus:bg-slate-800">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-gray-900 dark:text-gray-100">New visitor</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">John Doe just checked in</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-gray-100 dark:focus:bg-slate-800">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-gray-900 dark:text-gray-100">System Update</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Security patches installed</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-slate-900 border dark:border-slate-700">
              <DropdownMenuLabel className="text-gray-900 dark:text-gray-100">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-700" />
              <DropdownMenuItem className="text-gray-700 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-slate-800">
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-slate-800">
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-slate-800">
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-700" />
              <DropdownMenuItem className="text-red-600 dark:text-red-400 focus:bg-gray-100 dark:focus:bg-slate-800">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Badge className="bg-rose-100 dark:bg-primary/80 text-primary dark:text-primary-foreground text-rose-500 hover:bg-rose-200">
            {user?.role}
          </Badge>
        </div>
      </div>
    </header>
  );
};

export default Header;