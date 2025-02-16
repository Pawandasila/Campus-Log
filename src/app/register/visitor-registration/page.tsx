"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { registerVisitor } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Enter a valid email address." }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: "Enter 10 digits." }),
  aadhaarNumber: z.string().regex(/^\d{12}$/, { message: "Enter 12 digits." }),
  purposeOfVisit: z.string().min(5, { message: "Enter a valid purpose." }),
  visitDate: z.string(),
  hasVehicle: z.boolean().default(false),
  vehicleNumber: z.string().optional(),
  userImage: z.instanceof(File).optional(),
});

const Page = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const today = format(new Date(), "yyyy-MM-dd");
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      aadhaarNumber: "",
      purposeOfVisit: "",
      visitDate: today,
      hasVehicle: false,
      vehicleNumber: "",
      userImage: undefined,
    },
  });

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Submit Form Data
  async function onSubmit(values: any) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "userImage" && selectedFile) {
          formData.append("Photo", selectedFile);
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await registerVisitor(formData);
      console.log(response);

      toast({
        title: "Success",
        description: "visitor registered",
        variant: "default",
      });

      form.reset();
      setImagePreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <Card className="w-full max-w-3xl mx-auto dark:bg-slate-950">
        <CardHeader className="text-center">
          <CardTitle className="text-xl md:text-2xl font-bold dark:text-white">
            Visitor Registration
          </CardTitle>
          <CardDescription className="dark:text-slate-400">
            Please fill out the form below to register.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Photo Upload - Centered */}
              <div className="flex flex-col items-center space-y-4 mb-6">
                <Avatar className="w-20 h-20 md:w-24 md:h-24">
                  <AvatarImage src={imagePreview || undefined} />
                  <AvatarFallback className="dark:bg-slate-700">VP</AvatarFallback>
                </Avatar>
                <div className="grid w-full max-w-sm items-center">
                  <Label htmlFor="picture" className="dark:text-white text-center mb-2">
                    Upload your photo
                  </Label>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mx-auto"
                  />
                </div>
              </div>

              {/* Form Fields - Two columns on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-white">Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="dark:bg-slate-900 dark:text-white" />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-white">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          className="dark:bg-slate-900 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-white">Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} className="dark:bg-slate-900 dark:text-white" />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Aadhaar Number */}
                <FormField
                  control={form.control}
                  name="aadhaarNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-white">Aadhaar Number</FormLabel>
                      <FormControl>
                        <Input {...field} className="dark:bg-slate-900 dark:text-white" />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Visit Date */}
                <FormField
                  control={form.control}
                  name="visitDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-white">Visit Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          readOnly
                          className="dark:bg-slate-900 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Vehicle Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasVehicle"
                      checked={form.watch("hasVehicle")}
                      onCheckedChange={(checked) => {
                        form.setValue("hasVehicle", checked === true);
                        if (!checked) form.setValue("vehicleNumber", "");
                      }}
                      className="dark:bg-slate-900"
                    />
                    <Label htmlFor="hasVehicle" className="dark:text-white">
                      I arrived in a vehicle
                    </Label>
                  </div>

                  {form.watch("hasVehicle") && (
                    <FormField
                      control={form.control}
                      name="vehicleNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-white">Vehicle Number</FormLabel>
                          <FormControl>
                            <Input {...field} className="dark:bg-slate-900 dark:text-white" />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Purpose of Visit - Full width */}
              <FormField
                control={form.control}
                name="purposeOfVisit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white">Purpose of Visit</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        {...field}
                        className="resize-none dark:bg-slate-900 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Submit Button - Full width */}
              <Button
                type="submit"
                className="w-full h-12 text-base bg-black hover:bg-gray-800 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register Visit"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;