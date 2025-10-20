"use client";

import { useState } from "react";

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface DemoGraphProps {
  title?: string;
  data?: DataPoint[];
}

export function DemoGraph({
  title = "Interactive Demo Graph",
  data = [
    { label: "Azure", value: 85, color: "#0078D4" },
    { label: ".NET", value: 90, color: "#512BD4" },
    { label: "Next.js", value: 88, color: "#000000" },
    { label: "DevOps", value: 92, color: "#2560E0" },
  ],
}: DemoGraphProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="my-8 rounded-lg border border-border bg-muted/30 p-6">
      <h3 className="mb-6 text-xl font-semibold text-foreground">{title}</h3>

      <div className="space-y-4">
        {data.map((item, index) => {
          const isHovered = hoveredIndex === index;
          const isSelected = selectedIndex === index;
          const isActive = isHovered || isSelected;
          const percentage = (item.value / maxValue) * 100;

          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  {item.label}
                </span>
                <span
                  className={`font-semibold transition-all ${
                    isActive
                      ? "text-foreground scale-110"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.value}%
                </span>
              </div>

              <div className="relative h-8 w-full overflow-hidden rounded-full bg-muted">
                <button
                  onClick={() =>
                    setSelectedIndex(selectedIndex === index ? null : index)
                  }
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group absolute inset-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label={`${item.label}: ${item.value}%`}
                >
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                      opacity: isActive ? 1 : 0.8,
                      transform: isActive ? "scaleY(1.1)" : "scaleY(1)",
                    }}
                  />

                  {/* Animated shine effect on hover */}
                  {isActive && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      style={{
                        animation: "shimmer 1.5s infinite",
                      }}
                    />
                  )}
                </button>
              </div>

              {/* Detail panel on selection */}
              {isSelected && (
                <div className="animate-in slide-in-from-top-2 rounded-md bg-background/50 p-3 text-sm">
                  <p className="text-muted-foreground">
                    <span
                      className="font-semibold"
                      style={{ color: item.color }}
                    >
                      {item.label}
                    </span>{" "}
                    has a proficiency score of{" "}
                    <span className="font-semibold text-foreground">
                      {item.value}%
                    </span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-muted-foreground italic">
        💡 Tip: Click or hover over the bars to interact
      </p>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
