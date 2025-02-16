"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Activity,
} from "lucide-react";
import Link from "next/link";
import VisitorCharts from "@/components/custom/Dashboard-Material/VisitorCharts";
import SummaryStats from "@/components/custom/Dashboard-Material/Summary-Stat";
import RecentVisitorsTable from "@/components/custom/Dashboard-Material/Recent-Visitor-Table";




const QuickLinks = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const links = [
    {
      href: "/visitor-dashboard#check-in",
      label: "Visitor Check-In",
      icon: UserCheck,
    },
    {
      href: "/visitor-registration",
      label: "Register a Visitor",
      icon: Users,
    },
    {
      href: "/visitor-dashboard",
      label: "View Reports",
      icon: Activity,
    },
  ];

  return (
    <Card className="transition-all hover:shadow-lg dark:bg-gray-900 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-gray-100">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative overflow-hidden rounded-lg p-6 transition-all duration-300 hover:shadow-md 
                dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 bg-gradient-to-br from-indigo-50 to-purple-50"
            >
              <div className="relative z-10">
                <link.icon
                  className={`mb-4 h-6 w-6 transition-colors duration-300 ${
                    hoveredIndex === index
                      ? "text-white"
                      : "text-indigo-600 dark:text-indigo-400"
                  }`}
                />
                <h3
                  className={`font-medium transition-colors duration-300 ${
                    hoveredIndex === index
                      ? "text-white"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {link.label}
                </h3>
              </div>
              <div
                className={`absolute inset-0 transform bg-gradient-to-r from-indigo-600 to-purple-600 transition-transform duration-300 ease-in-out
                ${hoveredIndex === index ? "translate-y-0" : "translate-y-full"}`}
              />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 dark:bg-gray-950 bg-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Visitor Dashboard
        </h1>
      </div>

      <SummaryStats />
      <VisitorCharts />
      <RecentVisitorsTable />
      <QuickLinks />
    </div>
  );
}
