'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Inter, Playfair_Display } from 'next/font/google';
import { motion, useInView, AnimatePresence, Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Users, Target, Heart, Shield, Star } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

// Service data
interface Service {
  id: string;
  title: string;
  number: string;
  description: string;
  image: string;
  category: string;
}

const services: Service[] = [
  {
    id: 'guest-house',
    title: 'Guest House',
    number: '01',
    description: 'Comfortable and affordable accommodation with breathtaking views of the Rwandan countryside. Our guest house offers a peaceful retreat for travelers and business visitors alike.',
    image: '/images/guest-house.jpg',
    category: 'Hospitality',
  },
  {
    id: 'cafe-restaurant',
    title: 'Café & Restaurant',
    number: '02',
    description: 'Experience authentic African cuisine in a cozy atmosphere. Our café serves freshly brewed coffee, local dishes, and international favorites prepared with love.',
    image: '/images/cafe.jpg',
    category: 'Hospitality',
  },
  {
    id: 'art-gallery',
    title: 'Art Gallery',
    number: '03',
    description: 'Showcasing local artists and traditional masterpieces. Our gallery features imigongo art, paintings, sculptures, and contemporary works from Rwandan artists.',
    image: '/images/art-gallery.jpg',
    category: 'Art',
  },
  {
    id: 'craft-shop',
    title: 'Craft Shop',
    number: '04',
    description: 'Handmade crafts preserving cultural heritage. From woven baskets to pottery and jewelry, each piece tells a story of Rwandan craftsmanship and tradition.',
    image: '/images/craft-shop.jpg',
    category: 'Art',
  },
  {
    id: 'farming',
    title: 'Farming',
    number: '05',
    description: 'Sustainable agriculture empowering local communities. We practice eco-friendly farming methods and support local farmers with training and resources.',
    image: '/images/farming.jpg',
    category: 'Farming',
  },
];

// Values data
const valuesContent = [
  "Team work, Hard-work, innovation, Humility are",
  "some of our key values that keeps a healthy and",
  "growing team"
];

// Icons for values
const valueIcons = [
  { icon: Users, label: 'Teamwork' },
  { icon: Target, label: 'Hard-work' },
  { icon: Star, label: 'Innovation' },
  { icon: Heart, label: 'Humility' },
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const aboutSectionRef = useRef<HTMLElement>(null);
  const valuesSectionRef = useRef<HTMLElement>(null);
  const servicesSectionRef = useRef<HTMLElement>(null);

  const isAboutInView = useInView(aboutSectionRef, { once: false, amount: 0.2 });
  const isValuesInView = useInView(valuesSectionRef, { once: false, amount: 0.2 });
  const isServicesInView = useInView(servicesSectionRef, { once: false, amount: 0.2 });

  // Text content with line breaks matching the image
  const content = [
    "At Bashana, we are innovating life in",
    "Rural Africa - Creating jobs for the",
    "youth and women",
    "Here at Bashana we are focusing on ideas that will bring about positive changes",
    "and sustainable development for the youth and women. Currently focused in three",
    "main areas: Hospitality, Arts & Crafts and Farming."
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const logoVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  // Values animation variants - upward transition
  const valuesContainerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const valuesItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Services animation variants
  const servicesContainerVariants: Variants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const servicesItemVariants: Variants = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const toggleService = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Handle hover for dropdown
  const handleMouseEnter = (id: string) => {
    setExpandedId(id);
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    setExpandedId(null);
    setHoveredId(null);
  };

  // Right content for services
  const rightContent = [
    "Hospitality, Art, Entertainment",
    "Explore our work and engage with us though supporting our business or collaborating with us on our numerous ventures. Help us deliver more impact in Rural Africa."
  ];

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      {/* Sticky Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* About Section - White Background */}
      <section
        ref={aboutSectionRef}
        className="relative w-full min-h-screen py-20 px-6 sm:px-10 md:px-16 lg:px-24 overflow-hidden bg-white"
      >
        <h3 className='text-3xl sm:text-4xl md:text-xl text-[#800000] mb-7'>Hello, welcome to life in Rural Africa.</h3>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,0,0,0.1) 0%, transparent 50%)`,
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate={isAboutInView ? "visible" : "hidden"}
            className="lg:w-1/3 flex justify-center"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <Image
                src="/logo-black.svg"
                alt="Bashana Companies"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isAboutInView ? "visible" : "hidden"}
            className="lg:w-2/3 space-y-2"
          >
            {content.map((line, index) => (
              <motion.p
                key={index}
                variants={itemVariants}
                className={`text-gray-800 leading-relaxed ${
                  index === 0
                    ? "text-2xl sm:text-3xl md:text-4xl font-light"
                    : index <= 3
                    ? "text-xl sm:text-2xl md:text-3xl font-light"
                    : "text-base sm:text-lg md:text-xl text-gray-600"
                }`}
              >
                {line}
              </motion.p>
            ))}

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isAboutInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-8 h-0.5 w-24 bg-gradient-to-r from-amber-500 to-transparent"
              style={{ transformOrigin: "left" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section - With Image Background and Icons */}
      <section
        ref={valuesSectionRef}
        className="relative w-full py-20 px-6 sm:px-10 md:px-16 lg:px-24 overflow-hidden bg-white"
      >
        <div className="max-w-7xl mx-auto">
          {/* Rounded image background container with margins */}
          <motion.div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden mx-0 sm:mx-4 md:mx-8"
            initial={{ opacity: 0, y: 50 }}
            animate={isValuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Background Image - Only visible when scrolled to */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/images/hero.jpg"
                alt="Team values"
                fill
                className="object-cover"
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-20 py-16 md:py-20 lg:py-24">
              <div className="max-w-4xl mx-auto">
                {/* Icons Row */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isValuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-wrap items-center gap-6 sm:gap-8 md:gap-10 mb-6"
                >
                  {valueIcons.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isValuesInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                          <Icon size={28} className="text-white" />
                        </div>
                        <span className="text-xs text-white/60 mt-1">{item.label}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Values Text */}
                <motion.div
                  variants={valuesContainerVariants}
                  initial="hidden"
                  animate={isValuesInView ? "visible" : "hidden"}
                  className="space-y-1"
                >
                  {valuesContent.map((line, index) => (
                    <motion.p
                      key={index}
                      variants={valuesItemVariants}
                      className="text-xl sm:text-2xl md:text-3xl font-light text-white leading-relaxed"
                    >
                      {line}
                    </motion.p>
                  ))}
                </motion.div>

                {/* Founder Info */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isValuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mt-8"
                >
                  <p className="text-lg sm:text-xl font-medium text-white">
                    Charles Ashimwe · <span className="font-light text-white/70">Founder & Director</span>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section - With dark background */}
      <section
        ref={servicesSectionRef}
        className="relative w-full min-h-screen py-20 px-6 sm:px-10 md:px-16 lg:px-24 overflow-hidden"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)`,
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-2"
          >
            Home of the services we offer
          </motion.h2>

          {/* Right Content - Slides in from right */}
          <motion.div
            variants={servicesContainerVariants}
            initial="hidden"
            animate={isServicesInView ? "visible" : "hidden"}
            className="mb-12"
          >
            <motion.p
              variants={servicesItemVariants}
              className="text-xl sm:text-2xl md:text-3xl font-light text-white/80"
            >
              {rightContent[0]}
            </motion.p>
            <motion.p
              variants={servicesItemVariants}
              className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mt-2 leading-relaxed"
            >
              {rightContent[1]}
            </motion.p>
          </motion.div>

          {/* Services List - Hover to expand */}
          <div className="space-y-4">
            {services.map((service, index) => {
              const isExpanded = expandedId === service.id;
              const isHovered = hoveredId === service.id;

              return (
                <div
                  key={service.id}
                  className="border-b border-white/10 last:border-0"
                  onMouseEnter={() => handleMouseEnter(service.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <motion.button
                    className="w-full flex items-center justify-between py-4 md:py-5 group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <span className="text-sm md:text-base font-light text-white/40">
                        {service.number}
                      </span>
                      <span className="text-lg md:text-xl font-medium text-white group-hover:text-amber-400 transition-colors">
                        {service.title}
                      </span>
                      <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                        {service.category}
                      </span>
                    </div>

                    <motion.div
                      animate={{
                        rotate: isExpanded ? 180 : (isHovered ? -90 : 0),
                      }}
                      transition={{ duration: 0.3 }}
                      className="text-white/40 group-hover:text-amber-400 transition-colors"
                    >
                      <ChevronDown
                        size={24}
                        className={`transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </motion.div>
                  </motion.button>

                  {/* Dropdown Content - Opens on hover */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 md:pb-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                          {/* Description - Left */}
                          <div className="flex flex-col justify-center">
                            <h4 className="text-lg md:text-xl font-semibold text-white mb-2">
                              {service.title}
                            </h4>
                            <p className="text-sm md:text-base text-white/70 leading-relaxed">
                              {service.description}
                            </p>
                          </div>

                          {/* Image - Right */}
                          <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden bg-gray-800">
                            <Image
                              src={service.image}
                              alt={service.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}