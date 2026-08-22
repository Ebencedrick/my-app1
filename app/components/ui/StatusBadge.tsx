import { CheckCircle, Pause, Clock, XCircle, AlertCircle } from "lucide-react";

export interface StatusBadgeProps {
  status: "active" | "paused" | "draft" | "completed" | "rejected" | "in_review";
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = {
    active: {
      icon: CheckCircle,
      label: "Running",
      className: "bg-green-500/20 text-green-400 border border-green-500/30",
    },
    paused: {
      icon: Pause,
      label: "Paused",
      className: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    },
    draft: {
      icon: Clock,
      label: "Draft",
      className: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
    },
    completed: {
      icon: CheckCircle,
      label: "Completed",
      className: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    },
    rejected: {
      icon: XCircle,
      label: "Rejected",
      className: "bg-red-500/20 text-red-400 border border-red-500/30",
    },
    in_review: {
      icon: AlertCircle,
      label: "In Review",
      className: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    },
  };
  
  const { icon: Icon, label, className } = config[status];
  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
  };
  
  return (
    <span className={`inline-flex items-center gap-2 font-semibold rounded-full capitalize ${className} ${sizes[size]}`}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
}
