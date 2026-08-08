"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative w-full bg-black/90 backdrop-blur-sm text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-bold text-lg sm:text-xl tracking-wider">BASHANNA</span>
          <span className="text-[10px] sm:text-xs tracking-[0.2em] text-white/60">COMPANIES</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/services" className="text-sm text-white/70 hover:text-white transition-colors">
            Services
          </Link>
          <Link href="/contact" className="text-sm text-white/70 hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        {/* Menu Button - Mobile */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2"
        >
          <span className="block w-6 h-[2px] bg-white" />
          <span className="block w-6 h-[2px] bg-white" />
          <span className="block w-6 h-[2px] bg-white" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-white/10 z-50">
          <nav className="flex flex-col items-center py-6 space-y-4">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-base text-white/70 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="text-base text-white/70 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/services"
              onClick={() => setMenuOpen(false)}
              className="text-base text-white/70 hover:text-white transition-colors"
            >
              Services
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="text-base text-white/70 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}