import { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "outline";
}

export default function Card({ className, variant = "default", children, ...props }: CardProps) {
  const variants = {
    default: "bg-slate-800/50 border border-slate-700",
    gradient: "bg-gradient-to-br from-pink-500/10 to-orange-500/10 border border-pink-500/30",
    outline: "bg-transparent border-2 border-slate-700",
  };
  
  return (
    <div className={`rounded-2xl ${variants[variant]} ${className || ""}`} {...props}>
      {children}
    </div>
  );
}
