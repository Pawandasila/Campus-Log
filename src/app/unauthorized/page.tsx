'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldX, ArrowLeft, HomeIcon } from 'lucide-react';
import Link from 'next/link';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="relative text-center space-y-8 max-w-2xl mx-auto">
        {/* Animated Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8 animate-float">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-gradient-to-br from-red-500 to-red-600 rounded-full p-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <ShieldX className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 relative">
          {/* 3D Rotating Text */}
          <h1 
            className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-200 pb-2 animate-float"
            style={{
              transform: 'perspective(1000px) rotateX(10deg)',
              textShadow: '0 20px 30px rgba(0,0,0,0.5)'
            }}
          >
            Unauthorized
          </h1>

          <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
            Sorry, but you don't have permission to access this page. Please make sure you have the correct credentials.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="bg-white text-black hover:bg-gray-100 hover:scale-105 transform transition-all duration-300 min-w-[160px] group"
          >
            <Link href="/">
              <HomeIcon className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              Back to Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 hover:scale-105 transform transition-all duration-300 min-w-[160px] group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 -z-10">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-500/20 rounded-full blur-sm animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;