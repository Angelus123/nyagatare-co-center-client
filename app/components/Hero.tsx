import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import the font
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

// Product data
const artworks = [
  {
    id: 1,
    name: 'Handwoven Basket',
    description: 'Intricately woven from natural fibers, perfect for storage or decor.',
    price: 45.99,
    image: '/images/artworks/basket.jpg',
    category: 'home-decor',
  },
  {
    id: 2,
    name: 'Ceramic Vase',
    description: 'Hand-painted with traditional motifs, adds elegance to any space.',
    price: 59.99,
    image: '/images/artworks/TKX00217.jpg',
    category: 'ceramics',
  },
  {
    id: 3,
    name: 'Wooden Sculpture',
    description: 'Carved from sustainable wood, depicting cultural symbols.',
    price: 89.99,
    image: '/images/artworks/TKX00247.jpg',
    category: 'woodwork',
  },
  {
    id: 4,
    name: 'Embroidered Textile',
    description: 'Vibrant patterns hand-stitched by artisans.',
    price: 34.99,
    image: '/images/artworks/textiles.jpg',
    category: 'textiles',
  },
  {
    id: 5,
    name: 'Beaded Jewelry Set',
    description: 'Colorful beads in traditional designs, includes necklace and earrings.',
    price: 29.99,
    image: '/images/artworks/jewelry.jpg',
    category: 'jewelry',
  },
  {
    id: 6,
    name: 'Pottery Bowl',
    description: 'Wheel-thrown and glazed with earthy tones.',
    price: 24.99,
    image: '/images/artworks/TKX00247.jpg',
    category: 'ceramics',
  },
  {
    id: 7,
    name: 'Bamboo Lantern',
    description: 'Eco-friendly lantern with intricate cutouts for ambient lighting.',
    price: 39.99,
    image: '/images/artworks/TKX00319.jpg',
    category: 'lighting',
  },
  {
    id: 8,
    name: 'Silk Scarf',
    description: 'Hand-dyed silk with cultural prints, soft and luxurious.',
    price: 49.99,
    image: '/images/artworks/TKX00247.jpg',
    category: 'fashion',
  },
  {
    id: 9,
    name: 'Metal Wall Art',
    description: 'Hammered metal piece inspired by ancient craftsmanship.',
    price: 74.99,
    image: '/images/artworks/TKX00310.jpg',
    category: 'metalwork',
  },
  {
    id: 10,
    name: 'Leather Journal',
    description: 'Hand-bound with embossed designs, ideal for writing or sketching.',
    price: 32.99,
    image: '/images/artworks/TKX00247.jpg',
    category: 'stationery',
  },
  {
    id: 11,
    name: 'Stone Carving',
    description: 'Detailed sculpture from natural stone, a timeless piece.',
    price: 99.99,
    image: '/images/artworks/TKX09970.jpg',
    category: 'stonework',
  },
  {
    id: 12,
    name: 'Woven Rug',
    description: 'Durable and colorful, hand-loomed from wool and cotton.',
    price: 129.99,
    image: '/images/artworks/woodwork.jpg',
    category: 'textiles',
  },
];

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide for background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % artworks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-slide for artworks
  useEffect(() => {
    if (isAutoSliding) {
      const interval = setInterval(() => {
        setCurrentProductIndex((prev) => (prev + 1) % artworks.length);
      }, 5000);
      timeoutRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [isAutoSliding]);

  // Handle navigation with pause on interaction
  const handlePrevProduct = () => {
    setIsAutoSliding(false);
    setCurrentProductIndex((prev) => (prev === 0 ? artworks.length - 1 : prev - 1));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsAutoSliding(true), 10000); // Resume auto-slide after 10s
  };

  const handleNextProduct = () => {
    setIsAutoSliding(false);
    setCurrentProductIndex((prev) => (prev === artworks.length - 1 ? 0 : prev + 1));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsAutoSliding(true), 10000); // Resume auto-slide after 10s
  };

  // Animation variants for product
  const productVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: { opacity: 0, x: 50, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="relative py-10 min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-amber-800">
      {/* Background Slider */}
      <div className="absolute inset-0 bg-cover bg-center bg-fixed">
        {artworks.map((product, index) => (
          <motion.div
            key={product.id}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${product.image})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            aria-label={`Background image of traditional craft: ${product.image.split('/').pop()?.replace('.jpg', '')}`}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/40 z-10" />

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-20 text-center text-white mt-2">
        <motion.h1
          className={`${playfair.className} text-4xl md:text-4xl font-bold mb-2 drop-shadow-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Traditional Art & Craft
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-2 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Discover unique handmade treasures that weave stories of cultural heritage and masterful craftsmanship.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Link
            href="/shop"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Shop Now
          </Link>
          <Link
            href="/about"
            className="border-2 border-white hover:bg-white/20 text-white font-semibold py-2 px-8 rounded-full transition duration-300 transform hover:scale-105"
          >
            Our Story
          </Link>
        </motion.div>
      </div>

      {/* Product Carousel */}
      <div className="relative w-full max-w-4xl mx-auto mt-8 mb-12 z-20 max-h-[250px]" role="region" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProductIndex}
            // variants={productVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex flex-col md:flex-row items-center bg-white/95 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              {/* Description - Left Side */}
              <div className="w-full md:w-1/2 p-16 md:p-2 md:px-16 text-left">
                <h3 className={`${playfair.className} text-xl md:text-2xl font-semibold text-gray-800 mb-2`}>{artworks[currentProductIndex].name}</h3>
                <p className="text-gray-600 mb-1 text-xs md:text-sm">{artworks[currentProductIndex].description}</p>
                <p className="text-amber-600 font-bold text-lg md:text-xl mb-3">${artworks[currentProductIndex].price.toFixed(2)}</p>
                <Link href={`/artworks/${artworks[currentProductIndex].id}`}>
                  <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-1 px-4 rounded-full transition duration-300 shadow-md hover:shadow-lg text-sm">
                    View Details
                  </button>
                </Link>
              </div>
              {/* Image - Right Side */}
              <div className="w-full md:w-1/2 h-[150px]">
                <img
                  src={artworks[currentProductIndex].image}
                  alt={`Image of ${artworks[currentProductIndex].name}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevProduct}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Previous product"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNextProduct}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Next product"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>

      {/* Slider Indicators (Dots) */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {artworks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-amber-500' : 'bg-white/50'
              }`}
            aria-label={`Slide to background image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;