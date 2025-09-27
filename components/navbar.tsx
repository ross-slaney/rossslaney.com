import Link from "next/link";
import MobileMenu from "./mobile-menu";

export default function Navbar() {
  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Name */}
          <Link
            href="/"
            className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
          >
            Ross Slaney
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:opacity-70 transition-opacity font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Component */}
          <MobileMenu navLinks={navLinks} />
        </div>
      </div>
    </nav>
  );
}
