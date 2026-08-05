"use client";

import { useState, useEffect, useRef } from "react";
import { Coffee, Home, Palette, ShoppingBag, Sprout } from "lucide-react";
import Header from "./Header";
import Link from "next/link";

const services = [
  { label: "Café & Restaurant", icon: Coffee },
  { label: "Guest House", icon: Home },
  { label: "Art Gallery", icon: Palette },
  { label: "Craft Shop", icon: ShoppingBag, href: "/craftShop" },
  { label: "Farming", icon: Sprout },
];

const videos = [
  { src: "/videos/coffee-shop.mp4", id: 1 },
  { src: "/videos/serving-dish.mp4", id: 2 },
  { src: "/videos/meeting.mp4", id: 3 },
  { src: "/videos/guest-house.mp4", id: 4 },
];

export default function Hero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Keep every video playing in the background so the next one is
  // already running the moment we crossfade to it — no reload, no blank frame.
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    });
  }, [currentVideoIndex]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      <Header />

      {/* Background Video Container - all videos mounted & playing, only opacity crossfades */}
      <div className="absolute inset-0 w-full h-full">
        {videos.map((video, index) => (
          <video
            key={video.id}
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            autoPlay
            muted
            loop
            playsInline
            poster={index === 0 ? "/hero-poster.jpg" : undefined}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentVideoIndex ? "opacity-100" : "opacity-0"
            }`}
            onLoadedData={() => {
              if (index === 0) setHasLoadedOnce(true);
            }}
          >
            <source src={video.src} type="video/mp4" />
          </video>
        ))}
      </div>

      {/* Fallback gradient only before the very first video has ever loaded */}
      {!hasLoadedOnce && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
      )}

      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-16 lg:px-24">
          <h1 className="font-light text-6xl sm:text-7xl lg:text-8xl tracking-tight mt-23">
            Nyagatare Community Center
          </h1>
          <p className="mt-6 max-w-2xl text-xl sm:text-2xl md:text-3xl text-white/80 leading-relaxed">
            Enhancing potential that lies in the Youth and <br /> women in Rural Africa
          </p>
        </div>

        <div className="pb-10 px-6 sm:px-10 md:px-16 lg:px-24">
          <div className="h-px w-full bg-white mb-10" />
        <ul className="flex flex-wrap items-center justify-between gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              const content = (
                <>
                  <Icon size={18} className="text-red-400/70" />
                  {service.label}
                </>
              );
              const className =
                "flex items-center gap-2 px-6 py-2.5 rounded-full border border-red-400/70 text-sm sm:text-base hover:bg-red-400/10 transition-colors whitespace-nowrap";

              return (
                <li key={service.label}>
                  {service.href ? (
                    <Link href={service.href} className={className}>
                      {content}
                    </Link>
                  ) : (
                    <button className={className}>{content}</button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}