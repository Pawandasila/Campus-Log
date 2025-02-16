"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; 

const ProgressBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    NProgress.configure({
      showSpinner: false,
      minimum: 0.2, 
      speed: 600, 
      trickleSpeed: 80, 
      easing: "ease", 
    });

    
    const style = document.createElement("style");
    style.textContent = `
      #nprogress {
        pointer-events: none;
      }
      #nprogress .bar {
        background: linear-gradient(to right, #4f46e5, #2563eb);
        position: fixed;
        z-index: 1031;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
      }
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px #4f46e5, 0 0 5px #2563eb;
        opacity: 1.0;
        transform: rotate(3deg) translate(0px, -4px);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let timeoutId: NodeJS.Timeout;

    const startProgress = () => {
      clearTimeout(timeoutId);
      NProgress.set(0.2);
      NProgress.start();
    };

    const stopProgress = () => {
      timeoutId = setTimeout(() => {
        NProgress.done();
      }, 500); 
    };

    startProgress();
    stopProgress();

    return () => {
      clearTimeout(timeoutId);
      NProgress.remove();
    };
  }, [pathname, searchParams, isClient]);

  return null;
};

export default ProgressBar;
