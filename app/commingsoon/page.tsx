'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ComingSoon() {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => setIsVisible(true), []);

    return (
        <div>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4">
                <div
                    className={`text-center max-w-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                >
                    {/* 🔧 Animated Builder Illustration */}
                    <div className="w-36 h-36 mx-auto mb-4 relative">
                        <svg viewBox="0 0 120 120" className="w-full h-full">
                            {/* Sun */}
                            <circle cx="95" cy="25" r="10" fill="#FFD54F" />
                            {/* Ground */}
                            <rect x="0" y="90" width="120" height="30" fill="#8D6E63" />
                            {/* Building */}
                            <rect x="35" y="50" width="50" height="40" fill="#B0BEC5" stroke="#455A64" strokeWidth="1.5" />
                            {/* Windows */}
                            <rect x="40" y="55" width="10" height="10" fill="#81D4FA" />
                            <rect x="55" y="55" width="10" height="10" fill="#81D4FA" />
                            <rect x="70" y="55" width="10" height="10" fill="#81D4FA" />
                            {/* Worker */}
                            <g transform="translate(60, 85)">
                                <circle cx="0" cy="-5" r="4" fill="#FFB74D" />
                                <rect x="-2" y="-2" width="4" height="8" fill="#1565C0" />
                                <line x1="2" y1="0" x2="8" y2="-5" stroke="#FFB74D" strokeWidth="2" />
                                <rect x="8" y="-7" width="5" height="3" fill="#5D4037" />
                            </g>
                        </svg>
                        <div className="absolute top-0 left-0 w-10 h-10 bg-amber-200 rounded-full blur-lg animate-pulse"></div>
                    </div>

                    {/* ✨ Text Content */}
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
                        Coming{' '}
                        <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            Soon
                        </span>
                    </h1>

                    <p className="text-gray-600 text-sm mb-4">
                        We’re crafting something exciting. Stay tuned for the launch!
                    </p>

                    {/* 📊 Progress Bar */}
                    <div className="max-w-xs mx-auto mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>80%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-gradient-to-r from-amber-500 to-orange-600 h-1.5 rounded-full animate-pulse"
                                style={{ width: '80%' }}
                            ></div>
                        </div>
                    </div>

                    {/* 📅 Expected Launch */}
                    <p className="text-sm text-gray-700 mb-5">
                        Expected Launch:{' '}
                        <span className="text-amber-600 font-semibold">December 2024</span>
                    </p>

                    {/* 🎯 Action Buttons */}
                    <div className="flex justify-center gap-3">
                        <Link
                            href="/"
                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-transform hover:scale-105 shadow-md"
                        >
                            Home
                        </Link>
                        <button className="border border-amber-500 text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-xl text-sm font-semibold transition-transform hover:scale-105">
                            Notify Me
                        </button>
                    </div>

                    {/* 💫 Floating Animation */}
                    <div className="absolute bottom-10 right-10 w-12 h-12 bg-orange-200/40 rounded-full blur-lg animate-bounce" />
                </div>
            </div>
        </div>
    );
}
