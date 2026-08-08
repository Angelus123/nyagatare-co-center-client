"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Facebook, Linkedin } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed top-4 sm:top-6 left-0 w-full z-50 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20">
      <motion.div
        initial={false}
        animate={{
          paddingLeft: isScrolled ? 32 : 0,
          paddingRight: isScrolled ? 32 : 0,
          paddingTop: isScrolled ? 18 : 10,
          paddingBottom: isScrolled ? 18 : 10,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`w-full rounded-full text-white flex items-center justify-between transition-colors duration-500 ${
          isScrolled ? "bg-[#8a2b2b] shadow-lg" : "bg-transparent"
        }`}
      >
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Mark */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#8a2a2a] to-[#5e1616] flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <div className="relative w-6 h-6 sm:w-7 sm:h-7">
                <Image
                  src="/images/logo/logo.png"
                  alt="Insight Nyagatare Community Center"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Wordmark */}
          <div className="leading-tight hidden sm:block">
            <p className={`text-white text-lg tracking-wide`}>INSIGHT</p>
                <p className="text-white text-xs tracking-wide -mt-0.5">Nyagatare Community  Center</p>
          </div>
        </Link>

        {/* Menu Button */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(true)}
          className="relative w-11 h-11 rounded-full border border-white/25 flex items-center justify-center gap-[5px] hover:bg-white/10 hover:border-white/40 transition-all duration-300 group/btn shrink-0"
        >
          <span className="absolute w-4 h-[1.5px] bg-white rounded-full -translate-y-[5px] transition-transform duration-300 group-hover/btn:-translate-y-[6px]" />
          <span className="absolute w-4 h-[1.5px] bg-white rounded-full transition-opacity duration-300" />
          <span className="absolute w-4 h-[1.5px] bg-white rounded-full translate-y-[5px] transition-transform duration-300 group-hover/btn:translate-y-[6px]" />
        </button>
      </motion.div>

      {/* Full-screen overlay menu - slides in from right */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#7a1f1f] z-50 overflow-hidden flex flex-col"
            >
              {/* Watermark logo graphic, bottom-right */}
              <div className="absolute -bottom-16 -right-16 w-80 h-80 opacity-10 pointer-events-none">
                <Image
                   src="/images/logo/logo.png"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>

              {/* Top bar: logo + close */}
              <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4">
                <div className="relative w-10 h-10">
                  <Image
                     src="/images/logo/logo.png"
                    alt="Insight Nyagatare Community Center"
                    fill
                    className="object-contain"
                  />
                </div>

                <button
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="w-11 h-11 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav links - right aligned, large */}
              <nav className="flex-1 flex flex-col items-end justify-center gap-2 px-6 sm:px-10 relative z-10">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.15 + index * 0.08,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-4xl sm:text-5xl font-light text-white hover:text-white/70 transition-colors leading-tight"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Divider */}
              <div className="mx-6 sm:mx-8 h-px bg-white/20 relative z-10" />

              {/* Bottom bar: socials + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex items-center justify-between px-6 sm:px-8 py-6 relative z-10"
              >
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  >
                    <Instagram size={16} />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  >
                    <Facebook size={16} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  >
                    <Linkedin size={16} />
                  </a>
                </div>

                <a
                  href="https://wa.me/250700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full border border-white/50 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Chat With Us
                </a>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}