'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  // logout: () => Promise<void>;
}

export default function Header({ theme, setTheme }: HeaderProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user } = useAuth();


  return (
    <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-[#003366]'} text-white shadow-md sticky top-0 z-50`}>
      {/* Top Navigation */}
      <nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-500'} sticky top-0 z-50 shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="bg-black-800 backdrop-blur  rounded-full flex items-center justify-center shadow">
                  {/* Logo */}
                  <Link
                    href="/"
                    className="transition-colors"
                    aria-label="Artisan Crafts Home"
                  >
                    <Image
                      src="/images/logo/logo.png"
                      alt="Insight Art Space Logo"
                      width={50} // Reduced from 80
                      height={50} // 60 ÷ (80/26) = 19.5
                      priority
                    />
                  </Link>
                </div>
                <span className="ml-3 text-white text-xl font-bold">Insight Art Space</span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  href="/auditDashboard"
                  className={`px-3 py-2 rounded-md text-lg font-medium `}
                >
                  Welcome {user?.name || 'Admin'}
                </Link>

              </div>
            </div>

            <div className="ml-4 flex items-center md:ml-6">
              <button
                className="w-10 h-10 rounded-full cursor-pointer bg-gray-100/10 hover:bg-gray-400/5 flex items-center justify-center transition-all duration-300"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center text-sm rounded-md bg-white/10 text-white px-3 py-2 hover:bg-white/20"
                  >
                    <span className="mr-2">👤</span>
                    Admin
                    <span className="ml-1">▼</span>
                  </button>
                </div>

                {profileMenuOpen && (
                  <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} ring-1 ring-black ring-opacity-5 py-1 z-50`}>
                    <a
                      href="#"
                      className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                    >
                      Profile Settings
                    </a>
                    <a
                      href="#"
                      className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                    >
                      Account Security
                    </a>
                    <a
                      href="#"
                      className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                    >
                      Preferences
                    </a>
                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                    <span
                      onClick={async () => {
                        // await logout();
                        window.location.href = '/login';
                      }}
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