'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  isScrolled: boolean;
}

export default function Navbar({ isScrolled }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/categories', label: 'Categories' },
    { href: '/artworks', label: 'Artworks' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/login', label: 'Login' }
  ];

  const mainCategories = [
    'Jewelry & Accessories',
    'Home Decor',
    'Painting & Drawing',
    'Wood & Metal',
    'Fashion & Textiles',
    'Craft Supplies',
    'Paper Crafts',
    'Kids & Toys',
    'Seasonal & Gifts'
  ];

  const subCategories = [
    'Offers', 'New In', 'Best Sold', 'Inspiration', 'Ideas',
    'Stores', 'Workshops', 'Carts', 'Papercraft', 'Orders', 
  ];

  // Check if current path is cart page
  const isCartPage = pathname === '/cart';
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Top Banner */}
      <div
        className={`bg-amber-600 text-white text-center py-2 text-sm font-medium transition-all duration-300 ${
          isScrolled ? 'hidden' : 'block'
        }`}
      >
        Buy more, save more! Get $5 off $20 or $10 off $40 with code{' '}
        <span className="font-bold">INSIGHT</span>
      </div>

      {/* Header */}
      <header
        className={`fixed w-full z-30 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-1' : 'bg-white py-2'
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Top Row */}
          <div className="relative flex items-center justify-between">
            {/* LEFT: Logo (mobile leftmost, centered on desktop) */}
            <div className="flex-shrink-0">
              <Link href="/" aria-label="Home" className="flex items-center">
                <Image
                  src="/images/logo/logo.png"
                  alt="Insight Art Space Logo"
                  width={220}
                  height={70}
                  className="w-auto h-12 sm:h-14 md:h-16 transition-transform hover:scale-105"
                  priority
                />
              </Link>
            </div>

            {/* CENTER: Search (hidden on mobile), CART (mobile center) */}
            <div className="flex-1 flex justify-center items-center">
              {/* Search Bar on Desktop/Tablet */}
              <div className="hidden md:flex w-full max-w-md relative">
                <input
                  type="text"
                  placeholder="Search products or Categories..."
                  className="w-full pl-10 pr-4 py-1.5 border text-gray-500 border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Cart (always visible, centered on mobile) */}
              <div className="relative md:ml-6 flex justify-center md:justify-end">
                <Link
                  href="/cart"
                  className={`p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full ${
                    isCartPage 
                      ? 'text-amber-700 bg-amber-50' 
                      : 'text-gray-700 hover:text-amber-700'
                  }`}
                  aria-label={`Cart (${cartCount})`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </Link>
                {cartCount > 0 && (
                  <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px] ${
                    isCartPage ? 'bg-amber-600' : 'bg-amber-500'
                  } animate-pulse`}>
                    {cartCount}
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT: Hamburger Menu (mobile rightmost) + Nav (desktop) */}
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-5 text-sm">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors ${
                      pathname === link.href
                        ? 'text-amber-700 underline underline-offset-4'
                        : 'text-gray-700 hover:text-amber-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Hamburger */}
              <button
                className="lg:hidden p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Category Bars */}
          {!isScrolled && (
            <>
              <nav className="hidden md:flex justify-center overflow-x-auto py-2 border-t border-b border-gray-200">
                <div className="flex space-x-4 px-2 min-w-max">
                  {mainCategories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/categories/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-xs sm:text-sm text-gray-700 hover:text-amber-700 font-medium px-2 whitespace-nowrap"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </nav>
              <nav className="hidden md:flex justify-center overflow-x-auto py-1">
                <div className="flex space-x-3 px-2 min-w-max">
                  {subCategories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/categories/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-xs text-gray-600 hover:text-amber-700 px-1 whitespace-nowrap"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </nav>
            </>
          )}
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          } bg-white border-t`}
        >
          <nav className="flex flex-col p-4 space-y-4">
            {/* Main Links */}
            <div>
              <h3 className="font-semibold text-gray-900 text-sm mb-2">Navigation</h3>
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block py-2 px-3 text-sm rounded-lg ${
                      pathname === link.href
                        ? 'text-amber-700 font-semibold bg-amber-50'
                        : 'text-gray-700 hover:text-amber-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Cart link for mobile menu */}
                <Link
                  href="/cart"
                  className={`block py-2 px-3 text-sm rounded-lg ${
                    isCartPage
                      ? 'text-amber-700 font-semibold bg-amber-50'
                      : 'text-gray-700 hover:text-amber-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cart ({cartCount})
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-gray-900 text-sm mb-2">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {mainCategories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block py-2 px-3 text-sm text-gray-700 hover:text-amber-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer */}
      <div className={`transition-all duration-300 ${isScrolled ? 'h-16' : 'h-28'}`} />
    </>
  );
}