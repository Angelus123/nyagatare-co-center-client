'use client'; // Required for client-side rendering in Next.js App Router

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';

// Import the font
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
// Define interfaces for data structures
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

// Default placeholder image for missing artisan images
const placeholderImage = '/images/placeholders/human-silhouette.jpg'; // Path to a human silhouette placeholder

// Sample artisan data (expandable; showcasing artisans behind the crafts)
const artisans = [
  {
    id: 1,
    name: 'Aisha Mwamba',
    specialty: 'Textile Weaving',
    description: 'Aisha creates vibrant handwoven textiles using techniques passed down through generations, blending bold colors with intricate patterns.',
    image: '/images/artisans/aisha.jpg', // Valid image
    link: '/artisans/aisha-mwamba',
  },
  {
    id: 2,
    name: 'Kofi Amadi',
    specialty: 'Ceramic Pottery',
    description: 'Kofi’s wheel-thrown pottery features earthy glazes and traditional motifs, reflecting his deep connection to cultural heritage.',
    image: '/images/artisans/kofi.jpg',
    link: '/artisans/kofi-amadi',
  },
  {
    id: 3,
    name: 'Lila Chen',
    specialty: 'Wood Carving',
    description: 'Lila carves sustainable wood into stunning sculptures, each piece telling stories of her community’s folklore.',
    image: '/images/artisans/lila.jpg', // Valid image
    link: '/artisans/lila-chen',
  },
  {
    id: 4,
    name: 'Sanaa Patel',
    specialty: 'Beaded Jewelry',
    description: 'Sanaa designs intricate beaded jewelry sets, combining traditional techniques with modern elegance.',
    image: '/images/artisans/sana.jpg',
    link: '/artisans/sanaa-patel',
  },
  {
    id: 5,
    name: 'Mateo Rivera',
    specialty: 'Metalwork',
    description: 'Mateo’s hammered metal wall art captures ancient craftsmanship, creating bold, timeless decor pieces.',
    image: '/images/artisans/mateo.jpg', // Valid image
    link: '/artisans/mateo-rivera',
  },
  {
    id: 6,
    name: 'Fatima Diallo',
    specialty: 'Leather Crafting',
    description: 'Fatima hand-binds leather journals with embossed designs, perfect for writers and artists alike.',
    image: '/images/artisans/fatima.jpg', // Valid image
    link: '/artisans/fatima-diallo',
  },
  // Add more artisans as needed
];

const Artisans: React.FC = () => {
   const [cart, setCart] = useState<Product[]>([]);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

   // Add scroll effect for header
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  return (
    <div>
      {/* Sticky Header */}
      <Header isScrolled={isScrolled} />
      <section className="min-h-screen bg-amber-50 py-16">
        {/* Header tying back to Hero, Shop, and Categories style */}
        <div className="container mx-auto px-4 text-center mb-12">
          <motion.h1
            className={`${playfair.className} text-4xl md:text-6xl font-bold text-amber-800 mb-4`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            aria-label="Artisans Section Title"
          >
            Meet Our Artisans
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-amber-700 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Discover the skilled artisans behind our handmade treasures. Each creator brings cultural heritage and passion to their craft.
          </motion.p>
        </div>

        {/* Artisan Grid */}
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {artisans.map((artisan, index) => (
            <motion.div
              key={artisan.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              role="article"
              aria-label={`Artisan: ${artisan.name}`}
            >
              <img
                src={artisan.image || placeholderImage} // Fallback to placeholder if image is missing
                alt={artisan.image ? artisan.name : `Placeholder for ${artisan.name}`}
                className="w-full h-96 object-cover object-top" // Increased height and prioritized top
                loading="lazy"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-amber-800 mb-2">{artisan.name}</h2>
                <p className="text-amber-700 font-medium mb-2">{artisan.specialty}</p>
                <p className="text-amber-600 mb-4">{artisan.description}</p>
                <div className="flex justify-center">
                  <Link
                    href={artisan.link}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
                    aria-label={`Learn more about ${artisan.name}`}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Artisans;