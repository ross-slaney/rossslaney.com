"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileMenuProps {
  navLinks: Array<{ href: string; label: string }>;
}

export default function MobileMenu({ navLinks }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-6 relative">
          <span
            className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
              isMenuOpen ? "rotate-45 top-3" : "top-1"
            }`}
          />
          <span
            className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out top-3 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
              isMenuOpen ? "-rotate-45 top-3" : "top-5"
            }`}
          />
        </div>
      </button>

      {/* Mobile Menu - Full Width */}
      <div
        className={`md:hidden absolute left-0 right-0 top-full bg-background border-t border-border transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 text-foreground hover:bg-muted rounded-md transition-colors font-medium"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
