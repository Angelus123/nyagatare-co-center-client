'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 🏗️ Illustration */}
        <div className="w-48 h-48 mx-auto mb-4">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <circle cx="60" cy="60" r="55" fill="#FFF8E1" stroke="#FFB300" strokeWidth="2" />
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              fill="#FB8C00"
              fontSize="40"
              fontWeight="bold"
              dy=".3em"
            >
              404
            </text>
          </svg>
        </div>

        {/* 🚧 Text */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 text-sm mb-5">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* 🏠 Back Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md transition-transform hover:scale-105"
        >
          <FaHome />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
