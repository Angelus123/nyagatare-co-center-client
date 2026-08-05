'use client';
import Link from 'next/link';
import { Inter, Playfair_Display } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import { useCart } from './context/CartContext';

// Define interfaces for data structures
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
}

interface Category {
  name: string;
  count: number;
  image: string;
  icon: string;
}

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
}

interface NewsletterForm extends HTMLFormElement {
  readonly elements: FormElements;
}

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

export default function Home() {
  const { addToCart } = useCart();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Enhanced featured products data
  const featuredProducts: Product[] = [
    {
      id: 1,
      name: 'Handcrafted Ceramic Vase',
      price: 45.99,
      image: '/images/ceramic-vase.jpg',
      category: 'Pottery',
      description: 'A beautifully glazed vase, handcrafted with traditional techniques.',
      rating: 4.5,
      reviews: 128
    },
    {
      id: 2,
      name: 'Traditional Embroidered Tapestry',
      price: 32.50,
      image: '/images/textiles.jpg',
      category: 'Textiles',
      description: 'Intricate patterns woven by skilled artisans.',
      rating: 4.8,
      reviews: 89
    },
    {
      id: 3,
      name: 'Wood Carved Figurine',
      price: 67.00,
      image: '/images/woodwork.jpg',
      category: 'Woodwork',
      description: 'A detailed carving inspired by cultural heritage.',
      rating: 4.3,
      reviews: 67
    },
    {
      id: 4,
      name: 'Handwoven Reed Basket',
      price: 28.75,
      image: '/images/basket.jpg',
      category: 'Weaving',
      description: 'A sturdy, eco-friendly basket for daily use.',
      rating: 4.6,
      reviews: 203
    },
    {
      id: 5,
      name: 'Silver Tribal Necklace',
      price: 89.99,
      image: '/images/jewelry.jpg',
      category: 'Jewelry',
      description: 'Handcrafted silver necklace with traditional motifs.',
      rating: 4.9,
      reviews: 156
    },
    {
      id: 6,
      name: 'Leather Handbag',
      price: 120.00,
      image: '/images/TKX00114.jpg',
      category: 'Leatherwork',
      description: 'Premium leather bag with intricate tooling.',
      rating: 4.7,
      reviews: 92
    },
    {
      id: 7,
      name: 'Hand-painted Ceramic Bowl Set',
      price: 75.50,
      image: '/images/TKX00188.jpg',
      category: 'Pottery',
      description: 'Set of 4 beautifully painted ceramic bowls.',
      rating: 4.4,
      reviews: 78
    },
    {
      id: 8,
      name: 'Wool Hand-knitted Scarf',
      price: 42.25,
      image: '/images/TKX00298.jpg',
      category: 'Textiles',
      description: 'Warm wool scarf with traditional patterns.',
      rating: 4.8,
      reviews: 134
    }
  ];

  const categories: Category[] = [
    { name: 'Pottery', count: 24, image: '/images/pottery.jpg', icon: '🏺' },
    { name: 'Textiles', count: 32, image: '/images/textiles.jpg', icon: '🧵' },
    { name: 'Woodwork', count: 18, image: '/images/woodwork.jpg', icon: '🪵' },
    { name: 'Jewelry', count: 29, image: '/images/jewelry.jpg', icon: '💍' },
    { name: 'Leatherwork', count: 15, image: '/images/leather.jpg', icon: '👜' },
    { name: 'Weaving', count: 21, image: '/images/basket.jpg', icon: '🧺' },
    { name: 'Metalwork', count: 12, image: '/images/metalwork.jpg', icon: '⚒️' },
    { name: 'Glasswork', count: 8, image: '/images/glasswork.jpg', icon: '🔮' },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? featuredProducts
    : featuredProducts.filter(product => product.category === selectedCategory);

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Basic cart functionality
  const handleAddToCart = (product: Product): void => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
      },
      1
    );
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = `${product.name} added to cart!`;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  // Newsletter form handler
  const handleNewsletterSubmit = (e: React.FormEvent<NewsletterForm>): void => {
    e.preventDefault();
    const email = e.currentTarget.elements.email.value;
    if (email) {
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successMsg.textContent = 'Thank you for subscribing!';
      document.body.appendChild(successMsg);

      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 3000);

      e.currentTarget.reset();
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>

      {/* Sticky Header */}
      <Header isScrolled={isScrolled} />

      {/* Hero Section */}
      <Hero />

      {/* Quick Category Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-center overflow-x-auto space-x-4 py-2 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex flex-col items-center min-w-[80px] group ${selectedCategory === category.name ? 'text-amber-600' : 'text-gray-600'
                  }`}
              >
                <div className={`text-2xl mb-2 p-3 rounded-full ${selectedCategory === category.name ? 'bg-amber-100' : 'bg-gray-100'
                  } group-hover:bg-amber-50 transition-colors`}>
                  {category.icon}
                </div>
                <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
                <span className="text-xs text-gray-500">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-2">
            <h2 className={`${playfair.className} text-3xl font-bold text-gray-900 text-center sm:text-left`}>
              Featured Products
            </h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                className="border border-gray-300 text-gray-600 cursor-pointer rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
              <Link
                href="/shop"
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto text-center"
              >
                View All Products
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.slice(0, 10).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 group"
              >
                <Link href={`/artworks/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <button className="bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-amber-50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-amber-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-700">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-amber-600">${product.price.toFixed(2)}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className={`${playfair.className} text-3xl font-bold text-center mb-12 text-gray-900`}>
            Shop By Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={`/categories/${category.name.toLowerCase()}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                <div className="aspect-video relative overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    <p className="text-white/80 text-sm">{category.count} items</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Banner */}
      <section className="py-12 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className={`${playfair.className} text-3xl font-bold text-white mb-4`}>
            Summer Sale - Up to 50% Off!
          </h2>
          <p className="text-amber-100 mb-6 text-lg">
            Limited time offer on selected handmade crafts. Don&apos;t miss out!
          </p>
          <Link
            href="/sale"
            className="inline-block bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors shadow-lg"
          >
            Shop Sale Items
          </Link>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600 text-sm">30-day money back guarantee</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">On orders over $100</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm">100% secure transactions</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className={`${playfair.className} text-3xl font-bold mb-4 text-amber-900`}>
            Join Our Craft Community
          </h2>
          <p className="mb-8 text-amber-800">
            Subscribe to our newsletter for exclusive updates on new arrivals, artisan stories, and special offers.
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          >
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 text-amber-700 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              required
            />
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}