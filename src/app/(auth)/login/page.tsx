"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAccount } from "@/lib/api";
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
import { Lock, User, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

const Page = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const {setUser} = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginAccount(formData);
      if (response.success) {
        document.cookie = `userRole=${response.role}; path=/`;

        setUser({
          id: response.user.id,
          email: response.user.email,
          username: response.user.username,
          role: response.role,
          mobileNumber: response.user.mobileNumber,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
        })

        window.dispatchEvent(new Event("storage"));
        
        if (response.role === "ADMIN") {
          router.push("/");
        } else if (response.role === "GUARD") {
          router.push("/scanner");
        } else {
          router.push("/unauthorized");
        }
        
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      console.error("Login failed", error);
      setError(error.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-100/80 text-transparent bg-clip-text">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
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
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="pl-10 bg-gray-900 text-white border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
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
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-400">
                Do not have an account ?
                <Link
                href={'/signup'}
                  className="dark:text-white dark:hover:text-gray-30 p-1"
                >
                  Sign Up
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

export default Page;
