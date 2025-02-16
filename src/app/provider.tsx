"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import Header from "@/components/custom/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/custom/AppSidebar";
import { SidebarContextProvider } from "@/context/SidebarContext";
import { Toaster } from "@/components/ui/toaster";
import {UserProvide} from "@/context/UserContext";

interface ProviderProps {
  children: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return match ? match[2] : null;
  };

  const checkAuth = () => {
    const userRole = getCookie("userRole");
    console.log("Checking userRole from cookies:", userRole);

    if (userRole) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
    const cookieListener = () => {
      checkAuth();
    };

    window.addEventListener("storage", cookieListener);

    return () => {
      window.removeEventListener("storage", cookieListener);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated === false) {
      const publicPaths = ["/login", "/signup"];
      if (!publicPaths.includes(pathname)) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const publicPages = ["/login", "/signup", "/not-found", "/unauthorized"];
  const isPublicPage = publicPages.some((path) => pathname.startsWith(path));

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserProvide>
        <SidebarContextProvider>
          {isPublicPage ? (
            <>{children}</>
          ) : (
            <div className="flex h-screen">
              <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-auto transition-all duration-300 bg-slate-100 dark:bg-gray-900">
                    {children}
                  </main>
                </div>
              </SidebarProvider>
              <Toaster />
            </div>
          )}
        </SidebarContextProvider>
      </UserProvide>
    </ThemeProvider>
  );
};

export default Provider;
