"use client";

import { useState, useEffect, useRef } from "react";
import { Coffee, Home, Palette, ShoppingBag, Sprout } from "lucide-react";

const services = [
  { label: "Café & Restaurant", icon: Coffee },
  { label: "Guest House", icon: Home },
  { label: "Art Gallery", icon: Palette },
  { label: "Craft Shop", icon: ShoppingBag },
  { label: "Farming", icon: Sprout },
];

// Video sources
const videos = [
  { src: "/videos/coffee-shop.mp4", id: 1 },
  { src: "/videos/coffee-shop.mp4", id: 2 },
  { src: "/videos/coffee-shop.mp4", id: 3 },
  { src: "/videos/coffee-shop.mp4", id: 4 },
];

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-slide videos every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      setIsVideoLoaded(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load and play video when index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((error) => {
        console.error("Video play error:", error);
      });
    }
  }, [currentVideoIndex]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      {/* Background Video Container */}
      <div className="absolute inset-0 w-full h-full">
        {videos.map((video, index) => (
          <video
            key={video.id}
            ref={index === currentVideoIndex ? videoRef : null}
            autoPlay={index === currentVideoIndex}
            muted
            loop
            playsInline
            poster="/hero-poster.jpg"
            className={`absolute inset-0 w-full h-full object-cover grayscale contrast-100 brightness-[0.7] transition-opacity duration-1000 ${
              index === currentVideoIndex && isVideoLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoadedData={() => {
              if (index === currentVideoIndex) {
                setIsVideoLoaded(true);
              }
            }}
            onError={() => {
              if (index === currentVideoIndex) {
                setIsVideoLoaded(true);
              }
            }}
          >
            <source src={video.src} type="video/mp4" />
          </video>
        ))}
      </div>

      {/* Fallback gradient background while video loads */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
      )}

      {/* Lighter overlays for better visibility */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

      {/* Content sits above the video/overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero copy */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-16 lg:px-24">
            <h1 className="font-light text-6xl sm:text-7xl lg:text-8xl tracking-tight mt-23">
              Nyagatare Community Center
            </h1>
          <p className="mt-6 max-w-2xl text-xl sm:text-2xl md:text-3xl text-white/80 leading-relaxed">
            Enhancing potential that lies in the Youth and <br /> women in Rural Africa
          </p>
        </div>

        {/* Divider + service pills */}
        <div className="pb-10 px-6 sm:px-10 md:px-16 lg:px-24">
          <div className="h-px w-full bg-white mb-10" />
          <ul className="flex flex-wrap items-center justify-between gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <li key={service.label}>
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-red-400/70 text-sm sm:text-base hover:bg-red-400/10 transition-colors whitespace-nowrap">
                    <Icon size={18} className="text-red-400/70" />
                    {service.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}