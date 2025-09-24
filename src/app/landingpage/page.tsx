"use client";

import React from "react";
import Link from "next/link";
import { Folder, Twitter, Linkedin, Menu, X } from "lucide-react";
import HeroSection from "./hero";
import ProblemSection from "./problem";
import SolutionSection from "./solution";
import TestimonialsSection from "./testimonials";
import { Button } from "@/components/ui/button";
import AnimatedGradientBackground from "@/components/animated-background";

// LandingPage - assembles marketing sections into a single scrollable page
export default function LandingPage() {
  // Mobile nav state for hamburger drawer
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // Smooth anchor scrolling with reduced-motion respect
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const anchors = Array.from(
      document.querySelectorAll('a[href^="#"]')
    ) as HTMLAnchorElement[];

    const handler = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const behavior: ScrollBehavior = mq.matches ? "auto" : "smooth";
      target.scrollIntoView({ behavior, block: "start" });
    };

    anchors.forEach((a) => a.addEventListener("click", handler));
    return () =>
      anchors.forEach((a) => a.removeEventListener("click", handler));
  }, []);
  return (
    // Root wrapper with global animated background layer
    <div className="relative min-h-screen flex flex-col overflow-x-hidden scroll-smooth">
      {/* Global animated background behind all sections */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatedGradientBackground />
      </div>
      {/* Frosted glass navbar; content slides under */}
      <nav className="sticky top-0 z-50 h-16 border-b border-white/20 bg-white/30 backdrop-blur-xl supports-[backdrop-filter]:bg-white/30">
        <div className="mx-auto max-w-7xl h-full px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Folder className="h-7 w-7 md:h-8 md:w-8 text-indigo-600" />
            <span className="text-lg md:text-xl font-bold tracking-tight">
              PitchCraft
            </span>
          </Link>
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <a href="#hero">Home</a>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <a href="#problem">Problem</a>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <a href="#solution">Solution</a>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <a href="#testimonials">Testimonials</a>
            </Button>
          </div>
          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Open navigation menu"
              aria-controls="mobile-nav"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {/* Overlay */}
            <div
              className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
                mobileOpen
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
              aria-hidden
              onClick={() => setMobileOpen(false)}
            />
            {/* Slide-down top panel */}
            <nav
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-xl transition-transform duration-300 ease-out ${
                mobileOpen ? "translate-y-0" : "-translate-y-full"
              }`}
            >
              <div className="relative p-4 pb-6 flex flex-col">
                <Link href="/" className="flex items-center gap-3">
                  <Folder className="h-7 w-7 md:h-8 md:w-8 text-indigo-600" />
                  <span className="text-lg md:text-xl font-bold tracking-tight">
                    PitchCraft
                  </span>
                </Link>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Close menu"
                  className="absolute top-3 right-3"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
                <div className="mt-8 grid gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setMobileOpen(false)}
                  >
                    <a href="#hero">Home</a>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setMobileOpen(false)}
                  >
                    <a href="#problem">Problem</a>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setMobileOpen(false)}
                  >
                    <a href="#solution">Solution</a>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setMobileOpen(false)}
                  >
                    <a href="#testimonials">Testimonials</a>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </nav>

      {/* Main content sections (placed above background) */}
      <main className="flex-1 relative z-10">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <TestimonialsSection />
      </main>

      {/* Footer - minimal links + socials placeholders */}
      <footer className="relative z-10 border-t bg-gray-50/70 backdrop-blur-sm text-[11px] text-gray-600">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} PitchCraft. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gray-900">
              Contact
            </Link>
            <div className="flex items-center gap-1.5 text-gray-600">
              {/* Socials: Twitter */}
              <Button asChild variant="ghost" size="icon">
                <a
                  href="#"
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
              {/* Socials: LinkedIn */}
              <Button asChild variant="ghost" size="icon">
                <a
                  href="#"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
