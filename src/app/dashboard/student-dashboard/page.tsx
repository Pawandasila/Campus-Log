"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, UserCheck, UserMinus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const studentData = [
  { id: "12345", name: "John Doe", checkIn: "09:00 AM", checkOut: "05:00 PM", status: "checked-out" },
  { id: "12346", name: "Jane Smith", checkIn: "10:00 AM", checkOut: "06:00 PM", status: "checked-out" },
  { id: "12347", name: "Alice Johnson", checkIn: "08:30 AM", checkOut: null, status: "checked-in" },
  { id: "12348", name: "Bob Wilson", checkIn: "09:15 AM", checkOut: "04:45 PM", status: "checked-out" },
  { id: "12349", name: "Carol Brown", checkIn: "08:45 AM", checkOut: null, status: "checked-in" },
  { id: "12350", name: "David Lee", checkIn: "09:30 AM", checkOut: "05:30 PM", status: "checked-out" },
  { id: "12351", name: "Eva Garcia", checkIn: "08:00 AM", checkOut: null, status: "checked-in" },
  { id: "12352", name: "Frank Miller", checkIn: "09:45 AM", checkOut: "05:15 PM", status: "checked-out" },
];

const OverviewCard = ({
  title,
  count,
  icon: Icon,
  className = "",
  textColor = "",
}: {
  title: string;
  count: string;
  icon: React.ElementType;
  className?: string;
  textColor?: string;
}) => (
  <Card className={`${className} bg-white dark:bg-gray-800 transition-all duration-300 hover:scale-105`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {title}
      </CardTitle>
      <Icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold text-transparent bg-gradient-to-r ${textColor} bg-clip-text`}>
        {count}
      </div>
    </CardContent>
  </Card>
);

const Page = () => {
  const [chartVisible, setChartVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    setChartVisible(true);
  }, []);

  const filteredStudents = useMemo(() => {
    return studentData.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.includes(searchTerm);
      
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "checked-in" && student.status === "checked-in") ||
        (statusFilter === "checked-out" && student.status === "checked-out");

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-100 dark:bg-[#16161a] min-h-screen transition-all duration-300">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Admin Student Dashboard
        </h2>
      </div>

      {/* stats card (overview) */}
      <div className="grid gap-4 md:grid-cols-3">
        <OverviewCard
          title="Total Students"
          count="82"
          icon={Users}
          className="shadow-lg"
          textColor="from-blue-600 to-blue-400"
        />
        <OverviewCard
          title="Checked In"
          count="52"
          icon={UserCheck}
          className="shadow-lg"
          textColor="from-green-600 to-green-400"
        />
        <OverviewCard
          title="Checked Out"
          count="30"
          icon={UserMinus}
          className="shadow-lg"
          textColor="from-purple-600 to-purple-400"
        />
      </div>


      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by Name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="checked-in">Checked In</SelectItem>
            <SelectItem value="checked-out">Checked Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-white dark:bg-gray-800 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex justify-between items-center">
            <span>Student Records</span>
            <span className="text-sm font-normal text-gray-500">
              {filteredStudents.length} students found
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 dark:border-gray-700">
                <TableHead className="text-gray-700 dark:text-gray-300">
                  Student Name
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">
                  ID
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">
                  Check-In Time
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">
                  Check-Out Time
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student) => (
                <TableRow 
                  key={student.id}
                  className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {student.name}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {student.id}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {student.checkIn}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {student.checkOut || "---"}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.status === "checked-in" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                    }`}>
                      {student.status === "checked-in" ? "Checked In" : "Checked Out"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedStudents.length === 0 && (
                <TableRow>
                  <TableCell 
                    colSpan={5} 
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    No students found matching your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {filteredStudents.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;