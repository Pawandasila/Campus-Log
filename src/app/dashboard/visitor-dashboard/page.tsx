"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart
} from "recharts";
import {
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  LogIn,
  LogOut,
  Calendar,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Dummy data
const dummyVisitors = [
  {
    _id: "1",
    Fname: "John",
    Lname: "Doe",
    email: "john@example.com",
    CheckInTime: "2024-02-13T09:00:00",
    CheckOutTime: "2024-02-13T17:00:00",
    Date: "2024-02-13",
    PurposeOfVisit: "Meeting",
    qrCodePath: "/placeholder-qr.png",
  },
  {
    _id: "2",
    Fname: "Jane",
    Lname: "Smith",
    email: "jane@example.com",
    CheckInTime: "2024-02-13T10:00:00",
    CheckOutTime: null,
    Date: "2024-02-13",
    PurposeOfVisit: "Interview",
    qrCodePath: "/placeholder-qr.png",
  },
  // Add more dummy data as needed
];

const stats = {
  totalVisitors: 150,
  checkedIn: 45,
  checkedOut: 95,
  pendingCheckIn: 10,
};

const purposeOfVisitData = [
  { name: "Meeting", value: 30 },
  { name: "Interview", value: 25 },
  { name: "Delivery", value: 20 },
  { name: "Site Visit", value: 15 },
];

const dailyVisitorTrend = [
  { name: "Mon", visitors: 45 },
  { name: "Tue", visitors: 52 },
  { name: "Wed", visitors: 49 },
  { name: "Thu", visitors: 63 },
  { name: "Fri", visitors: 58 },
  { name: "Sat", visitors: 48 },
  { name: "Sun", visitors: 42 },
];

const VisitorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);
  const [chartsVisible, setChartsVisible] = useState(false);
  const itemsPerPage = 5;

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "Pending";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    setChartsVisible(true);
  }, []);

  const filteredVisitors = useMemo(() => {
    return dummyVisitors.filter((visitor) => {
      const matchesSearch =
        visitor.Fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.Lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "All" ||
        (filterStatus === "Checked In" && !visitor.CheckOutTime) ||
        (filterStatus === "Checked Out" && visitor.CheckOutTime);

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  const paginatedVisitors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVisitors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVisitors, currentPage]);

  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black">
    <div className="container mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Visitor Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Monitor and manage visitor activity in real-time
          </p>
        </div>
        <div className="flex space-x-4">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Calendar className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Visitors", value: stats.totalVisitors, icon: Users, color: "from-blue-600 to-blue-400" },
            { title: "Checked In", value: stats.checkedIn, icon: LogIn, color: "from-green-600 to-green-400" },
            { title: "Checked Out", value: stats.checkedOut, icon: LogOut, color: "from-purple-600 to-purple-400" },
            { title: "Pending CheckOut", value: stats.pendingCheckIn, icon: Clock, color: "from-orange-600 to-orange-400" },
          ].map((stat, index) => (
            <Card 
              key={index} 
              className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <h3 className={`text-2xl font-bold mt-2 bg-gradient-to-r bg-clip-text text-transparent ${stat.color}`}>
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} bg-opacity-10 transition-transform duration-300 hover:scale-110`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Purpose of Visit Chart */}
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Visitor Purpose</CardTitle>
                <BarChart2 className="h-5 w-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div 
                className={`h-[300px] transition-opacity duration-1000 ${
                  chartsVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={purposeOfVisitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      wrapperStyle={{
                        outline: "none",
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="url(#colorGradient)" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                      animationBegin={300}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#6366F1" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Daily Visitor Trend Chart */}
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Daily Visitor Trend</CardTitle>
                <TrendingUp className="h-5 w-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div 
                className={`h-[300px] transition-opacity duration-1000 ${
                  chartsVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyVisitorTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      wrapperStyle={{
                        outline: "none",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stroke="#8B5CF6"
                      fill="url(#areaGradient)"
                      animationDuration={1500}
                      animationBegin={300}
                    />
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Visitors Table */}
      <Card className="overflow-hidden hover:shadow-lg transition-all">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-lg font-semibold">Visitors List</CardTitle>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search visitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-[200px]"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Checked In">Checked In</SelectItem>
                  <SelectItem value="Checked Out">Checked Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800 ">
                  <TableHead className="font-semibold text-center">Name</TableHead>
                  <TableHead className="font-semibold text-center">Email</TableHead>
                  <TableHead className="font-semibold text-center">Check-In Time</TableHead>
                  <TableHead className="font-semibold text-center">Check-Out Time</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVisitors.map((visitor) => (
                  <TableRow 
                    key={visitor._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell className="font-medium text-center">{`${visitor.Fname} ${visitor.Lname}`}</TableCell>
                    <TableCell className="text-center">{visitor.email}</TableCell>
                    <TableCell className="text-center">{formatDateTime(visitor.CheckInTime)}</TableCell>
                    <TableCell className="text-center">{formatDateTime(visitor.CheckOutTime || "")}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedQrCode(visitor.qrCodePath)}
                        className="hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-gray-900 dark:hover:bg-gray-600"
                      >
                        View QR
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Modal */}
      <Dialog open={!!selectedQrCode} onOpenChange={() => setSelectedQrCode(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Visitor QR Code</DialogTitle>
          </DialogHeader>
          {selectedQrCode && (
            <div className="flex justify-center p-6">
              <img
                src={selectedQrCode}
                alt="Visitor QR Code"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  </div>
  );
};

export default VisitorDashboard;
