'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Inter, Playfair_Display } from 'next/font/google';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Users, Target, Heart, Star,
   Quote, ChevronDown, ChevronLeft, ChevronRight, RightIcon, Phone, Mail, 
   MapPin, Clock, MessageCircle, Send, X, Plus } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';


const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

interface Service {
  id: string;
  title: string;
  number: string;
  description: string;
  image: string;
  category: string;
  highlights?: string[];
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image?: string;
}
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
const services: Service[] = [
  {
    id: 'guest-house',
    title: 'Guest House',
    number: '01',
    description: 'Comfortable and affordable accommodation with breathtaking views of the Rwandan countryside. Our guest house offers a peaceful retreat for travelers and business visitors alike, with clean, cozy rooms and warm hospitality.',
    image: '/images/guest-house.jpg',
    category: 'Accommodation',
    highlights: [
      'Ensuite double & twin rooms',
      'Free Wi-Fi & breakfast included',
      'Countryside & garden views',
    ],
  },
  {
    id: 'cafe-restaurant',
    title: 'Coffee & Breakfast',
    number: '02',
    description: "Start your day right with freshly brewed Rwandan coffee and a hearty breakfast in a cozy atmosphere. Our café also serves local dishes and international favorites throughout the day, all prepared with love.",
    image: '/images/house2.jpg',
    category: 'Café & Restaurant',
    highlights: [
      'Locally roasted coffee & tea',
      'Full breakfast menu from 6,000 RWF',
      'Lunch & dinner: local + international dishes',
    ],
  },
  {
    id: 'events-meetings',
    title: 'Events & Meeting Space',
    number: '03',
    description: "A flexible, well-equipped space for meetings, workshops, and small events. Whether it's a business retreat or a private celebration, our team helps you plan an experience your guests will remember.",
    image: '/images/hero.jpg',
    category: 'Events',
    highlights: [
      'Meeting room seats up to 30 guests',
      'Catering & AV equipment available',
      'Ideal for retreats, workshops & celebrations',
    ],
  },
  {
    id: 'art-gallery',
    title: 'Art Gallery',
    number: '04',
    description: 'Showcasing local artists and traditional masterpieces. Our gallery features imigongo art, paintings, sculptures, and contemporary works from Rwandan artists.',
    image: '/images/jewelry1.jpg',
    category: 'Art',
  },
  {
    id: 'craft-shop',
    title: 'Craft Shop',
    number: '05',
    description: 'Handmade crafts preserving cultural heritage. From woven baskets to pottery and jewelry, each piece tells a story of Rwandan craftsmanship and tradition.',
    image: '/images/craft-shop.jpg',
    category: 'Art',
  },
  {
    id: 'farming',
    title: 'Farming',
    number: '06',
    description: 'Sustainable agriculture empowering local communities. We practice eco-friendly farming methods and support local farmers with training and resources.',
    image: '/images/farming.jpg',
    category: 'Farming',
  },
];

const valuesContent = [
  "Team work, Hard-work, innovation, Humility are",
  "some of our key values that keeps a healthy and",
  "growing team"
];

const valueIcons = [
  { icon: Users, label: 'Teamwork' },
  { icon: Target, label: 'Hard-work' },
  { icon: Star, label: 'Innovation' },
  { icon: Heart, label: 'Humility' },
];

const galleryImages: GalleryImage[] = [
  { id: 'g1', src: '/images/basket.jpg', alt: 'Our team behind the counter', category: 'Team' },
  { id: 'g2', src: '/images/jewerry.jpg', alt: 'Bashana guest house exterior', category: 'Interior' },
  { id: 'g3', src: '/images/pottery.jpg', alt: 'Coffee bar and baristas', category: 'Coffee' },
  { id: 'g4', src: '/images/textiles.jpg', alt: 'Café interior and menu boards', category: 'Interior' },
  { id: 'g5', src: '/images/gallery-artist.jpg', alt: 'Local artist with gallery pieces', category: 'Art' },
  { id: 'g6', src: '/images/gallery-craft-shop.jpg', alt: 'Craft shop and market shelves', category: 'Craft Shop' },
];

const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Aline Uwase',
    role: 'Guest House Visitor',
    quote: "The most peaceful stay I've had in Rwanda. The staff felt like family, and waking up to that countryside view every morning was unforgettable.",
    rating: 5,
    image: '/images/testimonial-1.jpg',
  },
  {
    id: 't2',
    name: 'James Mugisha',
    role: 'Café Regular',
    quote: 'Best coffee in Nyagatare, hands down. I come here every weekend for breakfast and the atmosphere never disappoints.',
    rating: 5,
    image: '/images/testimonial-2.jpg',
  },
  {
    id: 't3',
    name: 'Sarah Kimani',
    role: 'Corporate Retreat Organizer',
    quote: 'We hosted our team retreat here and everything was seamless — great space, attentive staff, and delicious catering throughout.',
    rating: 5,
    image: '/images/testimonial-3.jpg',
  },
  {
    id: 't4',
    name: 'Eric Nshimiyimana',
    role: 'Craft Shop Customer',
    quote: 'Beautiful, authentic craftsmanship. I bought gifts for my whole family and every piece tells a story of real Rwandan artistry.',
    rating: 5,
    image: '/images/testimonial-4.jpg',
  },
];

const faqs: FAQItem[] = [
  {
    id: 'faq1',
    question: 'Do I need to book in advance for the guest house?',
    answer: 'We recommend booking at least a few days ahead, especially during weekends and holiday seasons, to guarantee availability. You can reach us via WhatsApp, phone, or the contact form to check current availability and reserve your room.',
  },
  {
    id: 'faq2',
    question: 'What time does the café open, and is breakfast included with a room booking?',
    answer: 'Our café opens daily from 6am. Breakfast is included with guest house bookings and served each morning between 6am and 10am. Walk-in customers are also welcome for coffee, breakfast, lunch, and dinner throughout the day.',
  },
  {
    id: 'faq3',
    question: 'Can I host a private event or meeting at Nyagatare Community Center?',
    answer: 'Yes — our meeting and event space seats up to 30 guests and can be arranged for workshops, retreats, and private celebrations. Catering and basic AV equipment are available on request. Reach out to us directly to discuss your event details and pricing.',
  },
  {
    id: 'faq4',
    question: 'Are the crafts and art pieces available for purchase, and do you ship internationally?',
    answer: "All pieces in our craft shop and art gallery are available for purchase on-site. At this time we don't offer international shipping directly, but we're happy to help coordinate delivery within Rwanda or connect you with local shipping partners for cross-border requests.",
  },
  {
    id: 'faq5',
    question: 'How can I get in touch or find your exact location?',
    answer: "You can reach us via WhatsApp, phone, or email — all listed in our Contact section. Our exact location is available through the Google Maps pin on this site, or via our what3words-style location code: 4F4C+C4J, Kayonza.",
  },
];

function CircularLogo() {
  return (
    <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        <defs>
          <path
            id="circlePath"
            d="M 100, 100 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
          />
        </defs>
        <text fill="#0b1f3a" fontSize="11" fontWeight="600" letterSpacing="2">
          <textPath href="#circlePath" startOffset="0%">
            COMPANIES · BASHANA · COMPANIES · BASHANA ·
          </textPath>
        </text>
      </svg>

      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#7a2020] flex items-center justify-center">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16">
          <Image
            src="/logo-white.svg"
            alt="Bashana Companies"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const aboutSectionRef = useRef<HTMLElement>(null);
  const valuesSectionRef = useRef<HTMLElement>(null);
  const servicesSectionRef = useRef<HTMLElement>(null);
  const gallerySectionRef = useRef<HTMLElement>(null);
   const contactSectionRef = useRef<HTMLElement>(null);
  const testimonialsSectionRef = useRef<HTMLElement>(null);
  const faqSectionRef = useRef<HTMLElement>(null);
  
  
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const isGalleryInView = useInView(gallerySectionRef, { once: false, amount: 0.15 });
  const isContactInView = useInView(contactSectionRef, { once: false, amount: 0.15 });
  const isTestimonialsInView = useInView(testimonialsSectionRef, { once: false, amount: 0.2 });
  const isFaqInView = useInView(faqSectionRef, { once: false, amount: 0.15 });
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0].id);
  
  const isAboutInView = useInView(aboutSectionRef, { once: false, amount: 0.2 });
  const isValuesInView = useInView(valuesSectionRef, { once: false, amount: 0.2 });
  const isServicesInView = useInView(servicesSectionRef, { once: false, amount: 0.2 });

 const storyParagraphs = [
    "It started with the Nyagatare Community Center  a small space built to give young people and women in the area a place to learn, work, and gather. What began as a single room has grown into Bashana: a home for hospitality, arts & crafts, and farming, all rooted in the same community.",
    "Our mission is simple  create real, sustainable opportunities where they're needed most. Every guest house booking, every cup of coffee, every craft sold puts income directly back into the hands of local youth and women, funding training, tools, and new ventures across Rural Africa.",
    "Bashana is led by Charles Ashimwe, Founder & Director, alongside a growing team who believe that lasting change happens when a community builds it for itself.",
  ];

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    // Replace with your actual submit logic (API route, email service, etc.)
    setTimeout(() => {
      setFormStatus('sent');
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  const valuesContainerVariants = {
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

  const valuesItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const servicesContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const servicesItemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const galleryContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const galleryItemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const toggleService = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMouseEnter = (id: string) => {
    setExpandedId(id);
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    setExpandedId(null);
    setHoveredId(null);
  };

  const rightContent = [
    "Hospitality, Art, Entertainment",
    "Explore our work and engage with us though supporting our business or collaborating with us on our numerous ventures. Help us deliver more impact in Rural Africa."
  ];

  useEffect(() => {
    if (lightboxIndex === null) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % galleryImages.length));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + galleryImages.length) % galleryImages.length));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % galleryImages.length));
  const prevImage = () => setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + galleryImages.length) % galleryImages.length));
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <Hero />

      {/* About Section */}
      <section
  ref={aboutSectionRef}
  className="relative w-full py-20 pb-10 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 overflow-hidden bg-white"
>
        <h3 className="text-sm sm:text-base md:text-lg mb-7 font-medium">
          <span className="text-[#0b1f3a]">Hello, welcome to life in </span>
          <span className="text-[#993232]">rural Africa.</span>
        </h3>

        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate={isAboutInView ? "visible" : "hidden"}
            className="lg:w-1/3 flex justify-center"
          >
            <CircularLogo />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isAboutInView ? "visible" : "hidden"}
            className="lg:w-2/3 space-y-6"
          >
            <motion.p
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-[#0b1f3a] w-full"
            >
              At Bashana, we are innovating life in{' '}
              <span className="text-[#993232] font-bold">Rural Africa – Creating jobs</span>{' '}
              for the youth and women
            </motion.p>

            <div className="space-y-4">
              {storyParagraphs.map((paragraph, index) => (
                <motion.p
                  key={`story-${index}`}
                  variants={itemVariants}
                  className="text-base sm:text-lg text-gray-600 leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isAboutInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-8 h-0.5 w-24 bg-gradient-to-r from-[#993232] to-transparent"
              style={{ transformOrigin: "left" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
    <section
  ref={valuesSectionRef}
  className="relative w-full pt-10 pb-20 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 overflow-hidden bg-white"
>
        <div className="w-full">
          <motion.div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden mx-0 sm:mx-4 md:mx-8"
            initial={{ opacity: 0, y: 50 }}
            animate={isValuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/images/hero.jpg"
                alt="Team values"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>

            <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-20 py-16 md:py-20 lg:py-24">
              <div className="max-w-4xl mx-auto">
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

      {/* Services Section */}
      <section
        ref={servicesSectionRef}
        className="relative w-full min-h-screen py-20 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 overflow-hidden"
        style={{ backgroundColor: '#023047FA' }}
      >
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)`,
            }}
          />
        </div>

        <div className="relative z-10 w-full">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-2"
          >
            services we offer
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-[#993232]">
              {rightContent[0]}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mt-2 leading-relaxed">
              {rightContent[1]}
            </p>
          </motion.div>

          <motion.div
            variants={servicesContainerVariants}
            initial="hidden"
            animate={isServicesInView ? "visible" : "hidden"}
          >
            {services.map((service) => {
              const isExpanded = expandedId === service.id;

              return (
                <motion.div
                  key={service.id}
                  variants={servicesItemVariants}
                  className="border-t border-white last:border-b"
                  onMouseEnter={() => handleMouseEnter(service.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="w-full flex items-center justify-between py-8 md:py-10 group cursor-pointer">
                    <div className="flex items-baseline gap-4 md:gap-8">
                      <span className="text-sm md:text-base font-medium text-white/70 self-start mt-1">
                        {service.number}.
                      </span>
                      <span className="text-2xl sm:text-3xl md:text-4xl font-medium text-white transition-colors">
                        {service.title}
                      </span>
                    </div>

                    <motion.div
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex-shrink-0 w-15 h-15 md:w-17 md:h-17 rounded-full border-2 border-[#c95c5c] flex items-center justify-center text-[#c95c5c] group-hover:bg-[#993232] group-hover:border-[#993232] group-hover:text-white transition-colors duration-300"
                    >
                      <ArrowUpRight size={30} strokeWidth={2.5} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 md:pb-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                          <motion.div
                            variants={descriptionVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col justify-center pl-9 md:pl-14"
                          >
                            <span className="text-xs text-[#c95c5c] uppercase tracking-wider mb-2 font-medium">
                              {service.category}
                            </span>
                            <p className="text-sm md:text-base text-white/70 leading-relaxed">
                              {service.description}
                            </p>

                            {service.highlights && (
                              <ul className="mt-4 space-y-1.5">
                                {service.highlights.map((h, i) => (
                                  <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                                    <span className="text-[#c95c5c] mt-1">•</span>
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            <Link
                              href={`/services/${service.id}`}
                              className="group/learn inline-flex items-center gap-3 mt-6 w-fit"
                            >
                              <span className="px-5 py-2.5 rounded-full bg-[#993232] text-white text-sm md:text-base font-medium group-hover/learn:bg-[#7a2828] transition-colors duration-300">
                                Learn more
                              </span>

                              <motion.span
                                className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#c95c5c] text-[#c95c5c] group-hover/learn:border-[#993232] group-hover/learn:bg-[#993232] group-hover/learn:text-white transition-colors duration-300"
                                initial={{ rotate: 0 }}
                                whileHover={{ rotate: 45 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                              >
                                <ArrowUpRight size={18} strokeWidth={2.5} />
                              </motion.span>
                            </Link>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                            className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden bg-gray-800"
                          >
                            <Image
                              src={service.image}
                              alt={service.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        ref={gallerySectionRef}
        className="relative w-full py-20 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 overflow-hidden bg-white"
      >
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isGalleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-sm sm:text-base text-[#0b1f3a] font-medium mb-4"
          >
            Our visual collation of the Bashana experience
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isGalleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-[#0b1f3a]"
          >
            Explore our <span className="text-[#993232] font-bold">artistry</span> and commitment<br />
            to <span className="text-[#993232] font-bold">excellence</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isGalleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-gray-600 mt-6 leading-relaxed"
          >
            Embark on a visual journey through our cherished moments, each image reflecting our dedication <br /> to preserving & capturing rural Africa&apos;s beauty & significance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isGalleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4 mt-8"
          >
            <Link
              href="/gallery"
              className="px-6 py-3 rounded-full bg-[#0b1f3a] text-white text-sm md:text-base font-medium hover:bg-[#0b1f3a]/90 transition-colors duration-300"
            >
              View more
            </Link>

            <motion.a
              href="/gallery"
              className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full border-2 border-[#c95c5c] text-[#c95c5c] hover:border-[#993232] hover:bg-[#993232] hover:text-white transition-colors duration-300"
              whileHover={{ rotate: 45 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ArrowUpRight size={20} strokeWidth={2.5} />
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isGalleryInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 h-[2px] w-full bg-[#023047FA]"
            style={{ transformOrigin: "left" }}
          />

          <motion.div
            variants={galleryContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-10"
          >
           {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                variants={galleryItemVariants}
                onClick={() => openLightbox(index)}
                className="group relative w-full h-64 md:h-72 rounded-xl overflow-hidden bg-gray-200 cursor-pointer"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <span className="text-xs uppercase tracking-wider text-white/70 font-medium">
                    {image.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
       <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              aria-label="Close lightbox"
              className="absolute top-6 right-6 w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10"
            >
              <X size={22} />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 text-white/60 text-sm font-medium z-10">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>

            {/* Prev arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous image"
              className="absolute left-4 sm:left-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 hover:border-white transition-colors z-10"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Next arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
              className="absolute right-4 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 hover:border-white transition-colors z-10"
            >
              <ChevronRight size={22} />
            </button>

            {/* Image */}
            <motion.div
              key={galleryImages[lightboxIndex].id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[90vw] h-[75vh] max-w-5xl"
            >
              <Image
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />

              {/* Category label under image */}
              <div className="absolute -bottom-10 left-0 right-0 text-center">
                <span className="text-xs uppercase tracking-wider text-white/50 font-medium">
                  {galleryImages[lightboxIndex].category}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
{/* Testimonials Section */}
      <section
        ref={testimonialsSectionRef}
        className="relative w-full py-20 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 overflow-hidden"
        style={{ backgroundColor: '#023047FA' }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 70% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)`,
          }} />
        </div>

        <div className="relative z-10 w-full">
          {/* Header */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isTestimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-sm sm:text-base text-white/60 font-medium mb-4"
          >
            What people are saying
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isTestimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-white max-w-2xl"
          >
            Stories from our <span className="text-[#c95c5c] font-bold">guests</span> and community
          </motion.h2>

          <div className="mt-14 max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[activeTestimonial].id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-10 md:p-12"
              >
                <Quote size={36} className="text-[#c95c5c] mb-6" strokeWidth={1.5} />

                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-[#c95c5c] text-[#c95c5c]" />
                  ))}
                </div>

                <p className="text-lg sm:text-xl md:text-2xl font-light text-white/90 leading-relaxed">
                  &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                </p>

                <div className="flex items-center gap-4 mt-8">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                    {testimonials[activeTestimonial].image && (
                      <Image
                        src={testimonials[activeTestimonial].image!}
                        alt={testimonials[activeTestimonial].name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">
                      {testimonials[activeTestimonial].name}
                    </p>
                    <p className="text-white/50 text-xs sm:text-sm">
                      {testimonials[activeTestimonial].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-2">
                {testimonials.map((t, index) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTestimonial(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeTestimonial ? 'w-8 bg-[#c95c5c]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={prevTestimonial}
                  aria-label="Previous testimonial"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-[#c95c5c] hover:text-[#c95c5c] transition-colors duration-300"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextTestimonial}
                  aria-label="Next testimonial"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-[#c95c5c] hover:text-[#c95c5c] transition-colors duration-300"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* FAQ Section */}
      <section
        ref={faqSectionRef}
        className="relative w-full py-20 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 overflow-hidden bg-white"
      >
        {/* Paper texture background */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

       <div className="relative z-10 w-full">
          {/* Header */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-sm sm:text-base text-[#993232] font-medium mb-4"
          >
            FAQ
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-[#0b1f3a]"
          >
            Answers to our most frequently asked<br />
            <span className="text-[#993232] font-bold">questions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-[#0b1f3a]/70 max-w-xl mt-6 leading-relaxed"
          >
            Find quick answers to common questions about our services, process, and more.
          </motion.p>

          {/* Get in touch button + arrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4 mt-8"
          >
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-full bg-[#0b1f3a] text-white text-sm md:text-base font-medium hover:bg-[#0b1f3a]/90 transition-colors duration-300"
            >
              Get in touch with us
            </Link>

            <motion.a
              href="/contact"
              className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#993232] text-[#993232] hover:bg-[#993232] hover:text-white transition-colors duration-300"
              whileHover={{ rotate: 45 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ArrowUpRight size={20} strokeWidth={2.5} />
            </motion.a>
          </motion.div>

          {/* Accordion List - full width */}
          <div className="mt-14 w-full">
            {faqs.map((faq, index) => {
              const isOpen = openFaqId === faq.id;

              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFaqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between gap-4 py-7 text-left group"
                  >
                    <span className="text-xl sm:text-2xl md:text-3xl font-medium text-[#0b1f3a]">
                      {faq.question}
                    </span>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex-shrink-0 text-[#993232]"
                    >
                      <ChevronDown size={28} strokeWidth={2} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed pb-7 pr-12">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={`h-px w-full transition-colors duration-300 ${
                      isOpen ? 'bg-[#993232]' : 'bg-[#0b1f3a]/30'
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

     {/* Contact Section */}
      {/* Contact Section */}
      <section
        ref={contactSectionRef}
        className="relative w-full py-20 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 overflow-hidden"
        style={{ backgroundColor: '#023047FA' }}
      >
        {/* Subtle pattern overlay - matches Services/Testimonials */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)`,
          }} />
        </div>

        <div className="relative z-10 w-full">
          {/* Header */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isContactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-sm sm:text-base text-white/60 font-medium mb-4"
          >
            Get in touch
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isContactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-white max-w-3xl"
          >
            Let&apos;s start a <span className="text-[#c95c5c] font-bold">conversation</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isContactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-white/60 max-w-xl mt-6 leading-relaxed"
          >
            Have a question, booking request, or partnership idea? We&apos;d love to hear from you — reach out any way that works best.
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-14">
            {/* Left - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isContactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 focus:border-[#c95c5c] focus:ring-1 focus:ring-[#c95c5c] outline-none transition-colors text-white placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 focus:border-[#c95c5c] focus:ring-1 focus:ring-[#c95c5c] outline-none transition-colors text-white placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 focus:border-[#c95c5c] focus:ring-1 focus:ring-[#c95c5c] outline-none transition-colors text-white placeholder:text-white/30 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#993232] text-white text-sm md:text-base font-medium hover:bg-[#7a2828] transition-colors duration-300 disabled:opacity-60"
                >
                  <span>
                    {formStatus === 'sending' ? 'Sending...' : formStatus === 'sent' ? 'Message sent!' : 'Send message'}
                  </span>
                  <Send size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </form>
            </motion.div>

            {/* Right - Map + Contact Details */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isContactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              className="space-y-6"
            >
              {/* Google Maps Embed */}
              <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-white/15">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63700.0!2d30.467049188679223!3d-1.4129379872745653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMjQnNDYuNiJTIDMwwrAyOCcwMS40IkU!5e0!3m2!1sen!2srw!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Nyagatare Community Center location map"
                  className="absolute inset-0"
                />
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#c95c5c]/15 flex items-center justify-center">
                    <Phone size={18} className="text-[#c95c5c]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-0.5">Phone</p>
                    <a href="tel:+250782073369" className="text-sm font-medium text-white hover:text-[#c95c5c] transition-colors">
                      +250 782 073 369
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#c95c5c]/15 flex items-center justify-center">
                    <Mail size={18} className="text-[#c95c5c]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-0.5">Email</p>
                    <a href="mailto:hello@bashanacompanies.com" className="text-sm font-medium text-white hover:text-[#c95c5c] transition-colors break-all">
                      hello@bashanacompanies.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#c95c5c]/15 flex items-center justify-center">
                    <MapPin size={18} className="text-[#c95c5c]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-0.5">Location</p>
                    <p className="text-sm font-medium text-white">4F4C+C4J, Kayonza</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#c95c5c]/15 flex items-center justify-center">
                    <Clock size={18} className="text-[#c95c5c]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-0.5">Business Hours</p>
                    <p className="text-sm font-medium text-white">Mon–Sat: 7am – 9pm</p>
                    <p className="text-sm font-medium text-white">Sun: 8am – 6pm</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/250782073369"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 p-5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/25 hover:bg-[#25D366]/15 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center">
                    <MessageCircle size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Chat with us on WhatsApp</p>
                    <p className="text-xs text-white/50">Usually replies within a few hours</p>
                  </div>
                </div>
                <ArrowUpRight size={20} className="text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>
        < Footer />

    </div>
  );
}