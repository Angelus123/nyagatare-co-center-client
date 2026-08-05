'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { FaEnvelope } from 'react-icons/fa';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  logout: () => Promise<void>;
}

export default function Header({ theme, setTheme, logout }: HeaderProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0); 
   useEffect(() => {
    if (!user?.id) return;

    const fetchUnreadCount = async () => {
      try {


        const response = await fetch(`/api/chat/unseen-count/${user.id}`);
        if (response.ok) {
          const data = await response.json();

          console.log("data:---",data)
          setUnreadMessages(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch unread messages:', error);
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Set up polling (fetch every 30 seconds)
    const interval = setInterval(fetchUnreadCount, 30000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [user?.id]);



  return (
    <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-[#003366]'} text-white shadow-md sticky top-0 z-50`}>
      {/* Top Navigation */}
      
      <nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-900'} sticky top-0 z-50 shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/staffDashboard" className="flex-shrink-0 flex items-center">
                <div className="w-12 h-12 bg-blue-400 backdrop-blur border border-white/20 rounded-full flex items-center justify-center shadow">
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
                <span className="ml-3 text-white text-xl font-bold">Staff Dashboard</span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link 
                  href="/staffDashboard" 
                  className={`px-3 py-2 rounded-md text-lg font-medium `}
                >
                  Welcome {user?.name || 'Auditor'}
                </Link>
              </div>
            </div>

            <div className="ml-4 flex items-center md:ml-6">
              {/* Messages Link */}
              <Link href="/staffDashboard/chat" className="mr-4">
                <div className="relative flex mt-1 items-center justify-center">
                  <FaEnvelope className="text-gray-300 text-2xl cursor-pointer hover:text-white transition-colors" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {unreadMessages}
                    </span>
                  )}
                </div>
              </Link>

              <button
                className="w-10 h-10 rounded-full cursor-pointer bg-gray-100/10 hover:bg-blue-400/5 flex items-center justify-center transition-all duration-300"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              <div className="ml-3 relative cursor-pointer">
                <div>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center cursor-pointer text-sm rounded-md bg-white/10 text-white px-3 py-2 hover:bg-white/20"
                  >
                    <span className="mr-2">👤</span>
                    Staff
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
                    {/* <Link
                      href="/auditorDashboard"
                      className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-900'}`}

                    >
                      Auditor Dashboard
                    </Link> */}
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
                        await logout();
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