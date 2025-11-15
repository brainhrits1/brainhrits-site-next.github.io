"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/company", label: "Company" },
  { href: "/jobs", label: "Jobs" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all",
        "backdrop-blur-xl border-b",
        isScrolled
          ? "bg-slate-900/70 border-white/10 shadow-lg ring-1 ring-black/5"
          : "bg-slate-900/30 border-white/10"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-18 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg md:text-xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              BrainHR
            </span>{" "}
            IT Solutions
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {routes.map((r) => {
            const active = pathname === r.href;
            return (
              <Link
                key={r.href}
                href={r.href}
                className={cn(
                  "relative text-sm/6 text-slate-200 hover:text-white transition-colors",
                  "after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-2",
                  "after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-orange-400 after:to-amber-300",
                  "hover:after:w-4",
                  active && "after:w-6 text-white"
                )}
              >
                {r.label}
              </Link>
            );
          })}

          <Link href="/contact">
            <Button
              className="rounded-full px-5 bg-orange-500/90 hover:bg-orange-500 shadow-lg shadow-orange-500/25"
              size="sm"
            >
              Get in Touch
            </Button>
          </Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="p-2 text-white/90">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-slate-900/95 text-slate-100"
            >
              <div className="mt-10 flex flex-col gap-4">
                {routes.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className={cn(
                      "px-2 py-2 rounded-md hover:bg-white/5",
                      pathname === r.href && "bg-white/10"
                    )}
                  >
                    {r.label}
                  </Link>
                ))}
                <Link href="/contact">
                  <Button className="mt-2 w-full rounded-full bg-orange-500/90 hover:bg-orange-500">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
