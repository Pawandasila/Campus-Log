import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface Visitor {
  id: number;
  name: string;
  email: string;
  checkInTime: string;
  status: string;
  avatar: string;
  formattedCheckInTime?: string;
}

const recentVisitors: Visitor[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    checkInTime: "2024-02-12T09:00:00",
    status: "Checked In",
    avatar: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    checkInTime: "2024-02-12T10:30:00",
    status: "Pending",
    avatar: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
  },
  {
    id: 3,
    name: "Bob Wilson",
    email: "bob@example.com",
    checkInTime: "2024-02-12T11:15:00",
    status: "Checked Out",
    avatar: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
  },
];

const RecentVisitorsTable = () => {
  const [formattedVisitors, setFormattedVisitors] = useState(recentVisitors);

  useEffect(() => {
    const updatedVisitors = recentVisitors.map((visitor) => ({
      ...visitor,
      formattedCheckInTime: new Date(visitor.checkInTime).toLocaleString(),
    }));
    setFormattedVisitors(updatedVisitors);
  }, []);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Visitors</CardTitle>
        <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Visitor
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Check-in Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {formattedVisitors.map((visitor) => (
                <tr
                  key={visitor.id}
                  className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={visitor.avatar}
                        alt={visitor.name}
                        className="mr-3 h-8 w-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium dark:text-gray-100">
                          {visitor.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {visitor.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm dark:text-gray-300">
                    {visitor.formattedCheckInTime}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        visitor.status === "Checked In"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : visitor.status === "Pending"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                      }`}
                    >
                      {visitor.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentVisitorsTable;
