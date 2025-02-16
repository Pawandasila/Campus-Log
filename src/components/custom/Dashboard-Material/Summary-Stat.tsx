import React from "react";
import { CalendarDays, TrendingUp, UserCheck, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const visitorTrend = [
  { name: "Mon", visitors: 150 },
  { name: "Tue", visitors: 230 },
  { name: "Wed", visitors: 180 },
  { name: "Thu", visitors: 290 },
  { name: "Fri", visitors: 200 },
  { name: "Sat", visitors: 140 },
  { name: "Sun", visitors: 120 },
];

const summaryStats = {
  totalVisitors: 1234,
  activeVisitors: 45,
  todayCheckIns: 89,
};

const SummaryStats = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
    {[
      {
        title: "Total Visitors",
        value: summaryStats.totalVisitors,
        icon: Users,
        trend: "+14%",
        chartData: visitorTrend,
      },
      {
        title: "Active Visitors",
        value: summaryStats.activeVisitors,
        icon: UserCheck,
        trend: "+5%",
        chartData: visitorTrend.slice(-5),
      },
      {
        title: "Today's Check-ins",
        value: summaryStats.todayCheckIns,
        icon: CalendarDays,
        trend: "+12%",
        chartData: visitorTrend.slice(-5),
      },
    ].map((stat, index) => (
      <Card
        key={index}
        className="overflow-hidden transition-all hover:shadow-lg dark:bg-gray-900 dark:border-gray-800"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold mt-2 dark:text-gray-100">
                {stat.value}
              </h3>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400 mr-1" />
                <span className="text-sm text-emerald-500 dark:text-emerald-400">
                  {stat.trend}
                </span>
              </div>
            </div>
            <stat.icon className="w-8 h-8 text-indigo-500 dark:text-indigo-400 opacity-20" />
          </div>
          <div className="h-16 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stat.chartData}>
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
  );
};

export default SummaryStats;
