import React from "react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const visitorTrend = [
  { name: "Mon", visitors: 150 },
  { name: "Tue", visitors: 230 },
  { name: "Wed", visitors: 180 },
  { name: "Thu", visitors: 290 },
  { name: "Fri", visitors: 200 },
  { name: "Sat", visitors: 140 },
  { name: "Sun", visitors: 120 },
];

const visitorDistribution = [
  { name: "Morning", value: 35 },
  { name: "Afternoon", value: 45 },
  { name: "Evening", value: 20 },
];

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899"];

const VisitorCharts = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Weekly Visitor Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorTrend}>
                <defs>
                  <linearGradient
                    id="colorVisitors"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "0.375rem",
                    color: "#F3F4F6",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#6366F1"
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-900 dark:border-gray-800 transition-all hover:shadow-lg">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Visitor Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visitorDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {visitorDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "0.375rem",
                    color: "#F3F4F6",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorCharts;
