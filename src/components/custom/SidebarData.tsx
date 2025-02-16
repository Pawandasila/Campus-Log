"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  QrCode,
  Key,
} from "lucide-react";
import { useSidebarContext } from "@/context/SidebarContext";
import {
  SidebarGroupLabel,
  SidebarMenuItem,
} from "../ui/sidebar";
import { ScrollArea } from "../ui/scroll-area";

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  allowedRoles: string[];
  section?: string;
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
    allowedRoles: ["ADMIN", "Receptionist"],
    section: "Overview",
  },
  {
    name: "Visitor Dashboard",
    path: "/dashboard/visitor-dashboard",
    icon: <Users className="h-5 w-5" />,
    allowedRoles: ["ADMIN", "Receptionist"],
    section: "Dashboards",
  },
  {
    name: "Student Dashboard",
    path: "/dashboard/student-dashboard",
    icon: <Users className="h-5 w-5" />,
    allowedRoles: ["ADMIN", "Receptionist"],
    section: "Dashboards",
  },
  {
    name: "Visitor Registration",
    path: "/register/visitor-registration",
    icon: <UserPlus className="h-5 w-5" />,
    allowedRoles: ["Receptionist" , "ADMIN"],
    section: "Registration",
  },
  {
    name: "Student Registration",
    path: "/register/student-registration",
    icon: <UserPlus className="h-5 w-5" />,
    allowedRoles: ["Receptionist" , "ADMIN"],
    section: "Registration",
  },
  {
    name: "Event Registration",
    path: "/register/event-registration",
    icon: <Calendar className="h-5 w-5" />,
    allowedRoles: ["Receptionist" , "ADMIN"],
    section: "Registration",
  },
  {
    name: "QR Scanner",
    path: "/scanner",
    icon: <QrCode className="h-5 w-5" />,
    allowedRoles: ["Guard" , "ADMIN"],
    section: "Tools",
  },
  {
    name: "Credentials",
    path: "/credentials",
    icon: <Key className="h-5 w-5" />,
    allowedRoles: ["ADMIN"],
    section: "Settings",
  },
];

const SidebarData = () => {
  const pathname = usePathname();
  const { isOpen } = useSidebarContext();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return match ? match[2] : null;
  };

  useEffect(() => {
    const loadUserRole = () => {
      try {
        const role = getCookie("userRole");
        console.log("User role from cookies:", role);
        const validRoles = ["ADMIN", "Receptionist", "GUARD"];
        const validatedRole = role && validRoles.includes(role) ? role : null;
        console.log(validatedRole)

        setUserRole(validatedRole);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading user role:", error);
        setUserRole(null);
        setIsLoading(false);
      }
    };

    loadUserRole();
  }, []);

  if (isLoading) {
    return (
      <div className="px-2 py-2">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!userRole) {
    console.warn("No user role found in localStorage or invalid role");
    return (
      <div className="px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
        No access rights available. Please log in again. 
        Current role in localStorage: {localStorage.getItem("userRole")}
      </div>
    );
  }

  const filteredNavItems = navItems.filter((item) => 
    item.allowedRoles.some(role => role.toLowerCase() === userRole.toLowerCase())
  );

  const groupedItems = filteredNavItems.reduce((acc, item) => {
    const section = item.section || "Other";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as { [key: string]: NavItem[] });

  if (Object.keys(groupedItems).length === 0) {
    return (
      <div className="px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
        No menu items available for your role: {userRole}
      </div>
    );
  }

  return (
    <div className="px-2 py-2">
      {Object.entries(groupedItems).map(([section, items]) => (
        <div key={section} className="mb-6">
          {isOpen && (
            <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {section}
            </SidebarGroupLabel>
          )}
          <ScrollArea className="h-full">
            <div className="space-y-1">
              {items.map((item) => (
                <Link key={item.path} href={item.path} className="block">
                  <SidebarMenuItem
                    className={`flex items-center gap-3 px-3 py-3.5 rounded-lg transition-all duration-200 group relative ${
                      pathname === item.path
                        ? "bg-primary/10 dark:bg-primary/80 text-primary dark:text-primary-foreground shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {isOpen && (
                      <span className="font-medium text-sm truncate">
                        {item.name}
                      </span>
                    )}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-md shadow-lg border border-gray-200 dark:border-slate-700 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </SidebarMenuItem>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
};

export default SidebarData;