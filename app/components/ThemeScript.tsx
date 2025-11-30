"use client";
import { useEffect } from "react";

export function ThemeScript() {
  useEffect(() => {
    // Initialize theme on client side
    const theme = localStorage.getItem("theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, []);

  return null;
}




