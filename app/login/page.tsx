'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Inter, Playfair_Display } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useAutoDismiss } from '../hook/useAutoDismiss';
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [error, setError] = useState<{ message: string; code: number | null; visible: boolean }>({
    message: '',
    code: null,
    visible: false
  });

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useAutoDismiss(error.visible, (visible) =>
    setError(prev => ({ ...prev, visible }))
  );

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { email: '', password: '' };

    if (!email || !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError({
            message: data.error || 'Login failed',
            code: response.status,
            visible: true
          });
          return;
        }

        await Promise.all([
          localStorage.setItem('user', JSON.stringify(data.user)),
          localStorage.setItem('token', data.token)
        ]);

        window.location.href = data.dashboard || '/dashboard';
      } catch (err) {
        setError({ message: 'Unexpected error occurred', code: 500, visible: true });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!mounted) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex flex-col`}>
      <Header isScrolled={false} />

      {/* Login Section */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 lg:py-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Illustration/Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col items-center justify-center text-center p-8"
          >
            <div className="relative w-full max-w-md mt-16">
              {/* Abstract Art Illustration */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-gray-400 to-gray-500 opacity-20 blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-tr from-purple-400 to-pink-500 opacity-20 blur-xl"></div>

              <div className="relative bg-white/80 backdrop-blur-sm p-2 shadow-2xl border border-white/50">
                <div className=" w-80 h-80 bg-gradient-to-br from-gray-600 to-black rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Link
                    href="/"
                    className="transition-colors"
                    aria-label="Artisan Crafts Home"
                  >
                    <Image
                      src="/images/logo/logo.png"
                      alt="Insight Art Space Logo"
                      width={250} 
                      height={200} // 60 ÷ (80/26) = 19.5
                      className={`transition-opacity  hover:opacity-80`}
                      priority
                    />
                  </Link>
                </div>
                <h2 className={`${playfair.className} text-4xl font-bold text-gray-900 mb-4`}>
                  Welcome to <span className="text-amber-600">Insight Art Space</span>
                </h2>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-2 lg:px-10 border border-white/50">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className={`${playfair.className} text-3xl lg:text-2xl font-bold text-gray-900 mb-1`}>
                  Login
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-1">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">📧</span>
                    </div>
                    <input
                      type="email"
                      className={`block w-full pl-10 pr-4 py-3.5 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${errors.email
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200/80 focus:border-amber-500 hover:border-gray-300'
                        } focus:outline-none focus:ring-4 focus:ring-amber-500/20`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs flex items-center"
                    >
                      <span className="mr-1">⚠️</span> {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔒</span>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`block w-full pl-10 pr-12 py-3.5 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${errors.password
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200/80 focus:border-amber-500 hover:border-gray-300'
                        } focus:outline-none focus:ring-4 focus:ring-amber-500/20`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs flex items-center"
                    >
                      <span className="mr-1">⚠️</span> {errors.password}
                    </motion.p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link
                    href="/forgotPassword"
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error.visible && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="bg-red-50 border border-red-200 text-red-700 p-2 rounded-xl text-sm flex items-center shadow-sm"
                    >
                      <span className="mr-2">❌</span>
                      {error.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-2 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/90 text-gray-500">Insight Art Space</span>
                  </div>
                </div>
              </div>

              {/* Social Login (Optional) */}
              <div className="mt-8">
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}