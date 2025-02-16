"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerAccount } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Lock,
  User,
  Loader2,
  Mail,
  Phone,
  UserPlus,
  UserCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const page = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    mobileNumber: "",
    role: "ADMIN",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setForm((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await registerAccount(form);
      if (res.success) {
        router.push("/login");
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-100/80 text-transparent bg-clip-text">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your details to register a new account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="pl-10 bg-gray-900 text-white border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                    className="pl-10 bg-gray-900 text-white border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="pl-10 bg-gray-900 text-white border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    className="pl-10 bg-gray-900 text-white border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="relative">
                  <UserCheck className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Select
                    value={form.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger className="pl-10 bg-gray-900 text-white border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 text-white border-gray-700">
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                      <SelectItem value="GUARD">Guard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-900/20 border-red-900"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                href={'/login'}
                  className="p-0 dark:text-white dark:hover:text-gray-300"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute h-full w-full bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        </div>
      </div>
    </div>
  );
};

export default page;