"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/use-theme-cookie";

export default function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
        <span className="text-xs">☀️</span>
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          Light
        </span>
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    );
  }

  const themes = [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
    { value: "blue", label: "Blue", icon: "🔵" },
    { value: "green", label: "Green", icon: "🟢" },
    { value: "system", label: "System", icon: "💻" },
  ] as const;

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <div ref={dropdownRef} className="relative group">
      {/* Current Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        <span className="text-xs">{currentTheme.icon}</span>
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          {currentTheme.label}
        </span>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : "group-hover:rotate-180"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 bottom-full mb-2 w-40 bg-background border border-border rounded-lg shadow-lg transition-all duration-200 z-50 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
        }`}
      >
        <div className="py-1">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => {
                setTheme(themeOption.value);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors text-left
                ${
                  theme === themeOption.value
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                }
              `}
            >
              <span className="text-xs">{themeOption.icon}</span>
              <span>{themeOption.label}</span>
              {theme === themeOption.value && (
                <svg
                  className="w-4 h-4 ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
