"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "gradient-btn",
  secondary:
    "bg-mint-200 text-mint-800 hover:bg-mint-300 font-semibold rounded-xl transition-all active:scale-[0.98]",
  ghost:
    "text-gray-500 hover:text-rose-400 hover:bg-rose-50 rounded-xl transition-all",
  outline:
    "border-2 border-rose-200 text-rose-500 hover:bg-rose-50 font-semibold rounded-xl transition-all",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(variants[variant], sizes[size], "inline-flex items-center justify-center gap-2", className)}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
