'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { Copy, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const inter = Inter({ subsets: ['latin'] });

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
}

interface PayerInfo {
  name: {
    given_name: string;
    surname?: string;
  };
  email_address?: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  totalAmount: number;
  shippingFee: number;
  taxAmount: number;
  customerNote: string | null;
  shippingFullName: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingPhone: string;
  billingFullName: string;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingPostalCode: string;
  billingCountry: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  deliveredAt: string | null;
  items: OrderItem[];
  payer?: PayerInfo;
}

const OrderSuccessPage: React.FC = () => {
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load last order from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('lastOrder');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setOrderData(parsed);
        clearCart(); // runs only once
        localStorage.removeItem('checkoutItems');
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 👈 empty dependency array


  // Track scroll for header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = () => {
    if (!orderData) return;

    const text = `
                  Order Confirmation
                  ------------------------
                  Order Number: ${orderData.orderNumber}
                  Customer: ${orderData.shippingFullName}
                  Total: $${(orderData.totalAmount / 100).toFixed(2)}
                  Status: ${orderData.status}
                  Date: ${new Date(orderData.createdAt).toLocaleString()}
                  Items: ${orderData.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
                  `;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount: number) =>
    `$${(amount / 100).toFixed(2)}`;

  if (!orderData) {
    return (
      <div className={`${inter.className} min-h-screen bg-gray-50`}>
        <Header isScrolled={isScrolled} />
        <main className="flex justify-center items-center min-h-[70vh] px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              No recent order details available.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Go to Shop
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <Header isScrolled={isScrolled} />

      <main className={`${isScrolled ? 'pt-32' : 'pt-14'} transition-all`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Shop
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-green-200 rounded-lg shadow-sm p-8"
          >
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">
                Order Confirmed! 🎉
              </h1>
              <p className="text-gray-600 text-lg">
                Thank you for your purchase,{' '}
                {orderData.payer?.name?.given_name || orderData.shippingFullName}!
              </p>
              <p className="text-gray-500 mt-2">
                A confirmation email has been sent to{' '}
                {orderData.payer?.email_address || 'your email'}.
              </p>
            </div>

            {/* Order Info + Address */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Order Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Information
                </h2>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Order #:</span>{' '}
                    {orderData.orderNumber}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(orderData.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span className="capitalize text-green-600 font-semibold">
                      {orderData.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Total:</span>{' '}
                    {formatCurrency(orderData.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {orderData.shippingFullName === 'Digital Delivery'
                    ? 'Delivery Method'
                    : 'Shipping Address'}
                </h2>
                <div className="space-y-2 text-gray-700">
                  <p className="font-medium">{orderData.shippingFullName}</p>
                  {orderData.shippingStreet && <p>{orderData.shippingStreet}</p>}
                  <p>
                    {orderData.shippingCity}, {orderData.shippingState}{' '}
                    {orderData.shippingPostalCode}
                  </p>
                  <p>{orderData.shippingCountry}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
                {orderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center space-x-4 hover:bg-gray-50 transition"
                  >
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-600">
                          {item.quantity} × {formatCurrency(item.price)}
                        </p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    {formatCurrency(
                      orderData.totalAmount -
                      orderData.taxAmount -
                      orderData.shippingFee
                    )}
                  </span>
                </div>
                {orderData.shippingFee > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{formatCurrency(orderData.shippingFee)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatCurrency(orderData.taxAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-2 font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(orderData.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy Order Details'}
              </button>
              <Link
                href="/shop"
                className="flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
