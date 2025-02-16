"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "../ui/sidebar";
import SidebarData from "./SidebarData";
import { Building2 } from "lucide-react";
import { useUser } from "@/context/UserContext";


const AppSidebar = () => {
  const {user} = useUser();
  return (
    <Sidebar className="bg-white border-r border-gray-200 dark:border-slate-700 flex flex-col transition-all duration-300">
      
      <SidebarHeader className="flex items-center border-b border-gray-200 dark:border-slate-700 h-[61px] px-4">
        <div className="flex items-center gap-3 min-w-0">
          <Building2 className="h-6 w-6 text-primary dark:text-primary/90 flex-shrink-0" />
          <div className="min-w-0 overflow-hidden">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              Visitor Dashboard
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Management System
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup className="flex-1 py-4">
          <SidebarData />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-3 px-2 py-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {user?.username}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
              Visitor System
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              v1.0.0
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;