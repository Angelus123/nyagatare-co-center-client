'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  headerColor?: string; // 👈 new prop
}

export default function Header({ theme, setTheme, headerColor }: HeaderProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/adminDashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Dynamic header background
  const bgClass = theme === 'dark' 
    ? 'bg-gray-800' 
    : headerColor 
      ? headerColor // custom class or Tailwind color
      : 'bg-gray-900'; // fallback

  return (
    <header className={`${bgClass} text-white shadow-md sticky top-0 z-50`}>
      <nav className={`${bgClass} sticky top-0 z-50 shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="w-12 h-12 bg-gray-400 backdrop-blur border border-white/20 rounded-full flex items-center justify-center shadow">
                  <svg className="w-10 h-10 fill-white" viewBox="0 0 24 24">
                    <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91c4.59-1.15 8-5.86 8-10.91V5L12 2z" />
                    <path
                      d="M9 12l2 2l4-4"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="ml-3 text-white text-xl font-bold">Insight Art Spac</span>
              </Link>
            </div>

            {/* Nav Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link href="/adminDashboard" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/adminDashboard') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                  Dashboard
                </Link>
                <Link href="/adminDashboard/manageUsers" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/adminDashboard/manageUsers') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                  Manage Users
                </Link>
                <Link href="/adminDashboard/system-settings" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/adminDashboard/system-settings') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                  System Settings
                </Link>
                <Link href="/adminDashboard/activity-overview" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/adminDashboard/activity-overview') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                  Activity Overview
                </Link>
              </div>
            </div>

            {/* Right Section */}
            <div className="ml-4 flex items-center md:ml-6">
              <button
                className="w-10 h-10 rounded-full cursor-pointer bg-gray-100/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              {/* Profile Dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center cursor-pointer text-sm rounded-md bg-white/10 text-white px-3 py-2 hover:bg-white/20"
                  >
                    <span className="mr-2">👤</span>
                    Admin
                    <span className="ml-1">▼</span>
                  </button>
                </div>

                {profileMenuOpen && (
                  <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} ring-1 ring-black ring-opacity-5 py-1 z-50`}>
                    <a href="#" className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-900'}`}>
                      Profile Settings
                    </a>
                    <Link href="/staffDashboard" className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-900'}`}>
                      Staff Dashboard
                    </Link>
                    <Link href="/auditorDashboard" className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-900'}`}>
                      Auditor Dashboard
                    </Link>
                    <a href="#" className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-900'}`}>
                      Account Security
                    </a>
                    <a href="#" className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-900'}`}>
                      Preferences
                    </a>
                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                    <span
                      onClick={() => { window.location.href = '/login'; }}
                      className={`block px-4 py-2 text-sm text-red-600 ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                    >
                      Logout
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
