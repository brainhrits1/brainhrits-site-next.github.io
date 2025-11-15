"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Company", href: "/company" },
  { name: "Jobs", href: "/jobs" },
  { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 ease-in-out",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-2xl py-3 border-b border-orange-100"
          : "bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-sm py-5"
      )}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <span
            className={cn(
              "font-heading text-2xl font-bold transition-all duration-300",
              isScrolled
                ? "text-orange-600 hover:text-orange-700"
                : "text-white hover:text-orange-400 drop-shadow-lg"
            )}
          >
            BrainHR IT Solutions
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-semibold transition-all duration-300 relative group",
                isScrolled
                  ? pathname === link.href
                    ? "text-orange-600"
                    : "text-gray-700 hover:text-orange-600"
                  : pathname === link.href
                  ? "text-orange-400"
                  : "text-white hover:text-orange-300 drop-shadow-md"
              )}
            >
              {link.name}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                  isScrolled ? "bg-orange-600" : "bg-orange-400"
                )}
              />
            </Link>
          ))}

          <Button
            asChild
            className={cn(
              "transition-all duration-300 font-semibold shadow-lg hover:shadow-xl",
              isScrolled
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white border-2 border-white/30"
            )}
          >
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button
          className={cn(
            "md:hidden transition-colors duration-300",
            isScrolled ? "text-gray-700" : "text-white"
          )}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-200">
          <div className="container mx-auto px-6 py-6 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-base font-semibold transition-colors py-2 px-4 rounded-lg",
                  pathname === link.href
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button
              asChild
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
