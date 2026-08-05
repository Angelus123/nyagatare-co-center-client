'use client';
import { useState, useEffect } from 'react';
import { FaRocket, FaBell, FaEnvelope, FaClock, FaStar, FaPalette, FaHeart } from 'react-icons/fa';

interface ComingSoonProps {
  title?: string;
  description?: string;
  launchDate?: string;
  theme?: 'default' | 'art' | 'minimal' | 'gradient';
  onNotify?: (email: string) => void;
}

export default function ComingSoon({
  title = "Something Amazing is Coming Soon",
  description = "We're working hard to bring you an incredible new experience. Stay tuned for updates!",
  launchDate = "2025-10-10",
  theme = "minimal",
  onNotify,
}: ComingSoonProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const calcDays = () => {
      const launch = new Date(launchDate);
      const now = new Date();
      const diff = launch.getTime() - now.getTime();
      return Math.ceil(diff / (1000 * 3600 * 24));
    };
    setDaysLeft(calcDays());
  }, [launchDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && onNotify) {
      onNotify(email);
      setIsSubscribed(true);
      setEmail('');
    }
  };

  // LIGHT MODE THEME
  const currentTheme = {
    background: 'bg-gradient-to-br from-gray-50 to-gray-100',
    text: 'text-gray-800',
    card: 'bg-white/80 backdrop-blur-md border border-gray-200/50',
    accent: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
  };

  const renderIcon = () => (
    <FaRocket className="text-3xl mb-1 text-blue-500 animate-bounce" />
  );

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${currentTheme.background} ${currentTheme.text}`}>
      <div className={`w-full max-w-sm mx-auto text-center rounded-2xl shadow-2xl p-5 ${currentTheme.card}`}>
        {/* Icon */}
        <div className="flex justify-center mb-2">{renderIcon()}</div>

        {/* Title */}
        <h1 className="text-xl font-bold mb-1">{title}</h1>

        {/* Description */}
        <p className="text-sm opacity-80 mb-3 leading-relaxed">{description}</p>

        {/* Countdown */}
        <div className="mb-3">
          <div className={`text-2xl font-bold ${currentTheme.accent}`}>{daysLeft}</div>
          <div className="text-xs opacity-70">Days Left</div>
          <div className="flex items-center justify-center gap-1 text-xs opacity-70 mt-1">
            <FaClock className="text-xs" />
            {new Date(launchDate).toLocaleDateString()}
          </div>
        </div>

        {/* Email Form */}
        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="mb-3 flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className={`w-full px-3 py-2 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95 ${currentTheme.button}`}
            >
              <FaBell /> Notify Me
            </button>
          </form>
        ) : (
          <div className="bg-green-100 border border-green-200 rounded-md p-2 mb-3 text-green-700 flex items-center justify-center gap-2 text-sm">
            <FaEnvelope /> <span>We&apos;ll notify you when we launch!</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex justify-center gap-2 mt-2">
          {['Art', 'Design', 'Innovation'].map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs opacity-75 mt-4 flex items-center justify-center gap-1">
          Made with <FaHeart className="text-red-500 animate-pulse" /> for creatives
        </p>
      </div>
    </div>
  );
}