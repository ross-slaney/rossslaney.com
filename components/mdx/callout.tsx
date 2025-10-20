import { ReactNode } from "react";

interface CalloutProps {
  children: ReactNode;
  type?: "info" | "warning" | "success" | "error";
  title?: string;
}

export function Callout({ children, type = "info", title }: CalloutProps) {
  const styles = {
    info: {
      container:
        "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      title: "text-blue-900 dark:text-blue-200",
      emoji: "ℹ️",
    },
    warning: {
      container:
        "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800",
      icon: "text-yellow-600 dark:text-yellow-400",
      title: "text-yellow-900 dark:text-yellow-200",
      emoji: "⚠️",
    },
    success: {
      container:
        "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
      icon: "text-green-600 dark:text-green-400",
      title: "text-green-900 dark:text-green-200",
      emoji: "✅",
    },
    error: {
      container:
        "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
      icon: "text-red-600 dark:text-red-400",
      title: "text-red-900 dark:text-red-200",
      emoji: "❌",
    },
  };

  const style = styles[type];

  return (
    <div className={`my-6 rounded-lg border p-4 ${style.container}`}>
      <div className="flex gap-3">
        <div className={`text-xl ${style.icon}`}>{style.emoji}</div>
        <div className="flex-1">
          {title && (
            <p className={`mb-2 font-semibold ${style.title}`}>{title}</p>
          )}
          <div className="text-sm text-foreground/80">{children}</div>
        </div>
      </div>
    </div>
  );
}
