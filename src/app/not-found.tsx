"use client"
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomeIcon, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* 3D Rotating "404" Text Effect */}
        <div className="relative perspective-[1000px] h-48">
          <div className="absolute inset-0 flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
            <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 animate-[spin_20s_linear_infinite]">
              404
            </h1>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">Page not found</h2>
          <p className="text-muted-foreground text-lg max-w-sm mx-auto">
            Oops! It seems you've ventured into unknown territory. The page you're looking for doesn't exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="default"
            size="lg"
            asChild
            className="group transition-all hover:shadow-lg"
          >
            <Link href="/">
              <HomeIcon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Back to Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="group transition-all hover:shadow-lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-4px] transition-transform" />
            Go Back
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-grid-primary/10 bg-[size:32px_32px] opacity-20" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;