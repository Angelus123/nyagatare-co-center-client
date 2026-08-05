'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaPaperPlane, FaMapMarkerAlt } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactPage() {
    const [form, setForm] = useState({ email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    interface Product {
        id: number;
        name: string;
        price: number;
        image: string;
        category: string;
        description: string;
    }
    const [cart, setCart] = useState<Product[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Here you could integrate EmailJS, Resend, or your API endpoint
        // For now, it just simulates success
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setForm({ email: '', message: '' });
    };

     // Scroll effect for header
      useEffect(() => {
        const handleScroll = () => {
          setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

    return (
        <div>
            <Header isScrolled={isScrolled} />
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center px-4 py-10">
                <motion.div
                    className="w-full max-w-3xl bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    {/* ✨ Title */}
                    <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                        Contact{' '}
                        <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            Insight Art Space
                        </span>
                    </h1>

                    {/* 📞 Contact Info */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8 text-gray-700">
                        <div className="flex items-center gap-2">
                            <FaEnvelope className="text-amber-600" />
                            <span>info@insightartspace.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaPhone className="text-amber-600" />
                            <span>0785182823</span>
                        </div>
                    </div>

                    {/* 📧 Contact Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-amber-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 outline-none text-gray-700"
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            required
                            rows={4}
                            value={form.message}
                            onChange={handleChange}
                            className="w-full border border-amber-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 outline-none text-gray-700 resize-none"
                        />

                        <button
                            type="submit"
                            disabled={submitted}
                            className={`flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-transform hover:scale-105 ${submitted ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            <FaPaperPlane />
                            {submitted ? 'Message Sent!' : 'Send Message'}
                        </button>
                    </form>

                    {/* 🗺️ Map Section */}
                    <div className="mt-10 rounded-2xl overflow-hidden shadow-lg border border-amber-200">
                        <iframe
                            title="Insight Art Space Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d997656.3027158413!2d29.8738883!3d-1.9402787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca422a3b8a7b1%3A0x7e9f96a260df10f3!2sRwanda!5e0!3m2!1sen!2srw!4v1696276287337!5m2!1sen!2srw"
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}
