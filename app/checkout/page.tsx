'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
  PayPalButtonsComponentProps,
} from '@paypal/react-paypal-js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, Truck, Shield, X, Copy, Home } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
}

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const PayPalButtonWrapper = ({
  createPaypalProps,
}: {
  createPaypalProps: () => PayPalButtonsComponentProps;
}) => {
  const [{ isPending }] = usePayPalScriptReducer();
  return isPending ? (
    <div className="flex justify-center py-3">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  ) : (
    <PayPalButtons {...createPaypalProps()} />
  );
};

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalError, setPaypalError] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Shipping state
  const [shippingEnabled, setShippingEnabled] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const shippingFee = 10.0;
  const taxRate = 0.1;

  // Load checkout items
  useEffect(() => {
    const stored = localStorage.getItem('checkoutItems');
    setCheckoutItems(stored ? JSON.parse(stored) : cart);
  }, [cart]);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load PayPal Client ID
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
    if (!id) setPaypalError('Payment system unavailable. Please try again.');
    setPaypalClientId(id);
  }, []);

  const totalItems = checkoutItems.reduce((s, i) => s + i.quantity, 0);
  const subtotal = checkoutItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax + (shippingEnabled ? shippingFee : 0);

  const formatCurrency = (n: number) => `$${n.toFixed(2)}`;

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Generate a random order number
  const generateOrderNumber = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const createPaypalProps = (): PayPalButtonsComponentProps => ({
    style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' },
    createOrder: (data, actions) =>
      actions.order.create({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              value: total.toFixed(2),
              currency_code: 'USD'
            },
            description: 'Handcrafted Artworks Order',
          },
        ],
      }),
    onApprove: async (data, actions) => {
      setIsProcessing(true);
      setPaypalError(''); // Clear any previous errors

      try {
        if (!actions.order) {
          throw new Error('Order actions not available');
        }

        const details = await actions.order.capture();
        console.log('PayPal Success:', details);

        // Create order data in the format expected by OrderSuccessPage
        const orderData = {
          id: details.id || `order_${Date.now()}`,
          orderNumber: generateOrderNumber(),
          userId: 'guest', // or get from user context if available
          status: 'completed',
          totalAmount: Math.round(total * 100), // Convert to cents
          shippingFee: shippingEnabled ? Math.round(shippingFee * 100) : 0,
          taxAmount: Math.round(tax * 100),
          customerNote: null,
          shippingFullName: shippingEnabled ? shippingInfo.fullName : 'Digital Delivery',
          shippingStreet: shippingEnabled ? shippingInfo.address : 'Digital Product',
          shippingCity: shippingEnabled ? shippingInfo.city : 'Digital',
          shippingState: shippingEnabled ? '' : 'Digital',
          shippingPostalCode: shippingEnabled ? shippingInfo.postalCode : '00000',
          shippingCountry: shippingEnabled ? shippingInfo.country : 'Digital',
          shippingPhone: '',
          billingFullName: shippingEnabled ? shippingInfo.fullName : 'Digital Delivery',
          billingStreet: shippingEnabled ? shippingInfo.address : 'Digital Product',
          billingCity: shippingEnabled ? shippingInfo.city : 'Digital',
          billingState: shippingEnabled ? '' : 'Digital',
          billingPostalCode: shippingEnabled ? shippingInfo.postalCode : '00000',
          billingCountry: shippingEnabled ? shippingInfo.country : 'Digital',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          paidAt: new Date().toISOString(),
          deliveredAt: null,
          items: checkoutItems.map(item => ({
            ...item,
            // Ensure price is in cents for consistency
            price: Math.round(item.price * 100)
          })),
          payer: {
            name: {
              given_name: details.payer?.name?.given_name || 'Customer',
              surname: details.payer?.name?.surname || '',
            },
            email_address: details.payer?.email_address,
          }
        };

        // Save to localStorage in the correct format
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        clearCart();
        localStorage.removeItem('checkoutItems');
        
        // Redirect to order success page instead of showing modal
        router.push('/order-success');
        
      } catch (err) {
        console.error('PayPal capture error:', err);
        setPaypalError('Payment failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    },
    onError: (err) => {
      console.error('PayPal Error:', err);
      setPaypalError('Payment could not be completed. Please try another method.');
    },
    onCancel: (data) => {
      console.log('Payment cancelled by user');
      setPaypalError('Payment was cancelled. Please try again if you wish to complete your purchase.');
    },
  });

  if (checkoutItems.length === 0) {
    return (
      <div className={`${inter.className} min-h-screen bg-gray-50`}>
        <Header isScrolled={isScrolled} />
        <main className="flex justify-center items-center min-h-[70vh] px-4">
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🛒
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">No Items to Checkout</h2>
            <p className="text-gray-600 mb-6">Your cart is empty.</p>
            <Link
              href="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Go to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <Header isScrolled={isScrolled} />
      <main className={`${isScrolled ? 'pt-32' : 'pt-14'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href="/cart"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Cart
          </Link>

          <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT PANEL */}
            <section className="flex-1 space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-6 border-b bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>
                <div className="divide-y">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Section */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-lg text-gray-900">Shipping Details</h2>
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={shippingEnabled}
                      onChange={() => setShippingEnabled(!shippingEnabled)}
                      className="mr-2 accent-blue-600"
                    />
                    Ship to address
                  </label>
                </div>

                {shippingEnabled && (
                  <div className="space-y-3">
                    <input
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleShippingChange}
                      placeholder="Full Name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      required
                    />
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      placeholder="Street Address"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      required
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        placeholder="City"
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        required
                      />
                      <input
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleShippingChange}
                        placeholder="Postal Code"
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        required
                      />
                    </div>
                    <input
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      placeholder="Country"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      required
                    />
                  </div>
                )}
              </div>
            </section>

            {/* RIGHT PANEL */}
            <aside className="w-full lg:w-96">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="font-semibold text-lg mb-4 text-gray-900">Order Total</h2>
                <div className="space-y-3 mb-6 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {shippingEnabled && (
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatCurrency(shippingFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="border-t pt-3 font-semibold flex justify-between text-base">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                {paypalError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center">
                    <X className="w-4 h-4 mr-2" />
                    {paypalError}
                  </div>
                )}

                {paypalClientId ? (
                  <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'USD' }}>
                    <PayPalButtonWrapper createPaypalProps={createPaypalProps} />
                  </PayPalScriptProvider>
                ) : (
                  <p className="text-center text-gray-600">Loading PayPal...</p>
                )}

                <ul className="mt-6 space-y-3 text-sm text-gray-700">
                  {['Secure SSL payments', 'Money-back guarantee', 'Buyer protection'].map((text, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;