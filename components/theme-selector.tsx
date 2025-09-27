import { setTheme } from "../app/actions/theme";
import { getTheme } from "../lib/theme";

export default async function ThemeSelector() {
  const currentTheme = await getTheme();

  const themes = [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
    { value: "blue", label: "Blue", icon: "🔵" },
    { value: "green", label: "Green", icon: "🟢" },
    { value: "system", label: "System", icon: "💻" },
  ] as const;

  return (
    <div className="relative group">
      {/* Current Theme Button */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
        <span className="text-xs">
          {themes.find((t) => t.value === currentTheme)?.icon}
        </span>
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          {themes.find((t) => t.value === currentTheme)?.label}
        </span>
        <svg
          className="w-4 h-4 text-muted-foreground transition-transform group-hover:rotate-180"
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

      {/* Dropdown Menu */}
      <div className="absolute right-0 bottom-full mb-2 w-40 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {themes.map((theme) => (
            <form key={theme.value} action={setTheme.bind(null, theme.value)}>
              <button
                type="submit"
                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors text-left
                  ${
                    currentTheme === theme.value
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  }
                `}
              >
                <span className="text-xs">{theme.icon}</span>
                <span>{theme.label}</span>
                {currentTheme === theme.value && (
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
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
