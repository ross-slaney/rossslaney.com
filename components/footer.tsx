import ThemeSelector from "./theme-selector";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ross Slaney. All rights reserved.
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Theme:</span>
            <ThemeSelector />
          </div>
        </div>
      </div>
    </footer>
  );
}
