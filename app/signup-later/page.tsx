'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoDismiss } from '../hook/useAutoDismiss';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [errors, setErrors] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState<{
    message: string;
    code: number | null;
    visible: boolean;
  }>({
    message: '',
    code: null,
    visible: false
  });

  // Enhanced error handler
  const handleError = (errorCode: number, customMessage?: string) => {
    const messages = {
      409: 'This email is already registered',
      401: 'Invalid OTP code. Please try again.',
      500: 'Server error. Please try again later.',
      default: 'An unexpected error occurred'
    };

    setError({
      message: customMessage || messages[errorCode as keyof typeof messages] || messages.default,
      code: errorCode,
      visible: true
    });
  };

  useAutoDismiss(error.visible, (visible) =>
    setError(prev => ({ ...prev, visible }))
  );
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-pulse text-lg text-amber-600 dark:text-amber-400">Loading...</div>
      </div>
    );
  }

  // Theme-based styling variables with amber/orange color scheme
  const themeStyles = {
    bgColor: theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20',
    textColor: theme === 'dark' ? 'text-white' : 'text-gray-800',
    secondaryBg: theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/90',
    borderColor: theme === 'dark' ? 'border-gray-700' : 'border-amber-200/80',
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    inputBg: theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/80',
    inputBorder: theme === 'dark' ? 'border-gray-600' : 'border-amber-200',
    welcomeBg: theme === 'dark' ? 'bg-gradient-to-br from-amber-900/80 to-orange-900/80' : 'bg-gradient-to-br from-amber-500 to-orange-600',
    buttonBg: theme === 'dark' ? 'bg-gradient-to-r from-amber-600 to-orange-600' : 'bg-gradient-to-r from-amber-500 to-orange-600',
    successBg: theme === 'dark' ? 'bg-green-900/50' : 'bg-green-50',
    successBorder: theme === 'dark' ? 'border-green-700' : 'border-green-200',
    successText: theme === 'dark' ? 'text-green-300' : 'text-green-700',
    errorBg: theme === 'dark' ? 'bg-red-500/20' : 'bg-red-50',
    errorBorder: theme === 'dark' ? 'border-red-500/30' : 'border-red-200',
    errorText: theme === 'dark' ? 'text-red-300' : 'text-red-700',
  };

  // Handle logo click to redirect home
  const handleLogoClick = () => {
    router.push('/');
  };

  // Handle redirect to OTP verification
  const handleOtpVerifyClick = () => {
    router.push(`/otpverify?email=${encodeURIComponent(formData.email)}`);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (id === 'password') {
      evaluatePasswordStrength(value);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const evaluatePasswordStrength = (password: string) => {
    let strength = 'Weak';
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})");
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    if (strongRegex.test(password)) {
      strength = 'Strong';
    } else if (mediumRegex.test(password)) {
      strength = 'Medium';
    }

    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'Strong':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'Strong':
        return 'w-full';
      case 'Medium':
        return 'w-2/3';
      default:
        return 'w-1/3';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = formData;

    // Validation
    if (!fullName || !validateEmail(email) || password.length < 8 || password !== confirmPassword) {
      console.error('Validation failed:', { fullName, email, password, confirmPassword });
      setErrors({
        fullName: !fullName ? 'Full Name is required' : '',
        email: !validateEmail(email) ? 'Invalid email address' : '',
        password: password.length < 8 ? 'Password must be at least 8 characters' : (password !== confirmPassword ? 'Passwords do not match' : '')
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch( "/api/auth/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        handleError(response.status, data.error || 'An error occurred during signup');
        console.error('Signup error:', data.error);
        throw new Error(`Signup failed: ${response.statusText}`);
      }

      console.log('Signup successful:', data);
      // Redirect to OTP verification page
      handleOtpVerifyClick();
      setSuccess(true);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className={`min-h-screen ${themeStyles.bgColor} flex items-center justify-center p-4`}>
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Panel - Welcome Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`${themeStyles.welcomeBg} text-white rounded-3xl p-8 lg:p-12 flex flex-col justify-center relative hidden md:flex min-h-[600px] backdrop-blur-sm`}
        >
          <div className="absolute top-8 left-8">
            <div 
              className="bg-white/10 p-3 rounded-xl w-fit cursor-pointer hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              onClick={handleLogoClick}
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎨</span>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                Insight Art Space
              </h1>
              <p className="text-amber-100 text-lg leading-relaxed">
                Discover curated art collections, connect with artists, and bring creativity into your space.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Curated Art Collections",
                  description: "Discover handpicked artworks from emerging and established artists",
                  icon: "🖼️"
                },
                {
                  title: "Artist Community", 
                  description: "Connect with talented artists and fellow art enthusiasts",
                  icon: "👨‍🎨"
                },
                {
                  title: "Secure Transactions",
                  description: "Safe and verified art purchases with authenticity guarantees", 
                  icon: "🛡️"
                },
                {
                  title: "Virtual Exhibitions",
                  description: "Explore stunning digital galleries from anywhere in the world",
                  icon: "🏛️"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                    <p className="text-amber-100 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Registration Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center lg:justify-start"
        >
          <div className={`w-full max-w-md ${themeStyles.secondaryBg} backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-2xl border ${themeStyles.borderColor}`}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">✨</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Join Our Community
              </h2>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Start your artistic journey in just 2 minutes
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">👤</span>
                  </div>
                  <input 
                    id="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    required 
                    className={`block w-full pl-10 pr-4 py-3.5 rounded-xl border-2 bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm transition-all duration-200 ${
                      errors.fullName 
                        ? 'border-red-300 focus:border-red-500' 
                        : `${themeStyles.inputBorder} focus:border-amber-500 hover:border-amber-300 dark:hover:border-gray-600`
                    } focus:outline-none focus:ring-4 focus:ring-amber-500/20 dark:focus:ring-amber-400/20`} 
                    placeholder="John Doe" 
                  />
                </div>
                {errors.fullName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs flex items-center"
                  >
                    <span className="mr-1">⚠️</span> {errors.fullName}
                  </motion.p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">📧</span>
                  </div>
                  <input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className={`block w-full pl-10 pr-4 py-3.5 rounded-xl border-2 bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : `${themeStyles.inputBorder} focus:border-amber-500 hover:border-amber-300 dark:hover:border-gray-600`
                    } focus:outline-none focus:ring-4 focus:ring-amber-500/20 dark:focus:ring-amber-400/20`} 
                    placeholder="email@example.com" 
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
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔒</span>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`block w-full pl-10 pr-12 py-3.5 rounded-xl border-2 bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm transition-all duration-200 ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : `${themeStyles.inputBorder} focus:border-amber-500 hover:border-amber-300 dark:hover:border-gray-600`
                    } focus:outline-none focus:ring-4 focus:ring-amber-500/20 dark:focus:ring-amber-400/20`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                {formData.password && (
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getStrengthColor()} ${getStrengthWidth()}`}
                      ></div>
                    </div>
                    <p className={`text-sm font-medium ${
                      passwordStrength === 'Strong' ? 'text-green-600 dark:text-green-400' :
                      passwordStrength === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {passwordStrength === 'Strong' ? 'Strong password' : 
                       passwordStrength === 'Medium' ? 'Medium strength' : 
                       'Weak password'}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔒</span>
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`block w-full pl-10 pr-12 py-3.5 rounded-xl border-2 bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm transition-all duration-200 ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : `${themeStyles.inputBorder} focus:border-amber-500 hover:border-amber-300 dark:hover:border-gray-600`
                    } focus:outline-none focus:ring-4 focus:ring-amber-500/20 dark:focus:ring-amber-400/20`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
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

              {/* Error Message */}
              <AnimatePresence>
                {error.visible && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className={`${themeStyles.errorBg} border ${themeStyles.errorBorder} ${themeStyles.errorText} p-4 rounded-xl text-sm flex items-center shadow-sm`}
                  >
                    <span className="mr-2">❌</span>
                    {error.message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full ${themeStyles.buttonBg} text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center hover:shadow-xl`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </motion.button>

              {/* Login Link */}
              <div className="text-center pt-6 border-t border-amber-200 dark:border-gray-700">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-amber-600 dark:text-amber-400 font-semibold hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`${themeStyles.successBg} border ${themeStyles.successBorder} ${themeStyles.successText} p-4 rounded-xl text-sm text-center`}
                  >
                    ✅ Account created successfully! Redirecting...
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}