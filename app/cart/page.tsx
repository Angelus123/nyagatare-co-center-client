'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

const ShoppingCartPage: React.FC = () => {
  const { cart, removeFromCart, addToCart } = useCart();
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
  const [isScrolled, setIsScrolled] = useState(false);

  const shippingFee = 10.00;

  // Initialize selected items
  useEffect(() => {
    setSelectedItems((prev) => {
      const newSelected = { ...prev };
      cart.forEach((item) => {
        if (!(item.id in newSelected)) {
          newSelected[item.id] = true;
        }
      });
      // Remove deselected items not in cart
      Object.keys(newSelected).forEach((key) => {
        const numKey = Number(key);
        if (!cart.some((i) => i.id === numKey)) {
          delete newSelected[numKey];
        }
      });
      return newSelected;
    });
  }, [cart]);

  const selectedItemsData = cart.filter((item) => selectedItems[item.id]);
  const selectedQuantity = selectedItemsData.reduce((sum, item) => sum + item.quantity, 0);
  const itemSubtotal = selectedItemsData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotalExclTax = selectedQuantity > 0 ? itemSubtotal + shippingFee : 0;
  const isAllSelected = Object.keys(selectedItems).length === cart.length && Object.values(selectedItems).every(Boolean);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateQuantity = (id: number, change: number) => {
    const currentItem = cart.find((i) => i.id === id);
    if (!currentItem) return;
    const newQuantity = currentItem.quantity + change;
    if (newQuantity <= 0) {
      removeFromCart(id);
      setSelectedItems((prev) => ({ ...prev, [id]: false }));
      return;
    }
    addToCart(
      {
        id: currentItem.id,
        name: currentItem.name,
        price: currentItem.price,
        image: currentItem.image,
        description: currentItem.description,
      },
      change
    );
  };

  const removeItem = (id: number) => {
    removeFromCart(id);
    setSelectedItems((prev) => ({ ...prev, [id]: false }));
  };

  const toggleSelectAll = () => {
    const newState = !isAllSelected;
    const newSelected = cart.reduce(
      (acc, item) => ({ ...acc, [item.id]: newState }),
      {} as Record<number, boolean>
    );
    setSelectedItems(newSelected);
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleProceedToCheckout = () => {
    if (selectedQuantity > 0) {
      const selected = cart.filter((item) => selectedItems[item.id]);
      localStorage.setItem('checkoutItems', JSON.stringify(selected));
      router.push('/checkout');
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className={`${inter.className} min-h-screen bg-gray-50`}>
        <Header isScrolled={isScrolled} />
        <main className="flex justify-center items-center min-h-[70vh] px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🛒
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven’t added anything to your cart yet.</p>
            <Link
              href="/shop"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Continue Shopping
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
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Shopping Cart</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT PANEL */}
            <section className="flex-1">
              {/* Select All */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Select all items ({selectedQuantity} selected)
                  </span>
                </label>
              </div>

              {/* Store Section */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-medium">A</span>
                    </div>
                    <span className="font-medium text-gray-800">Insight Art Space</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    In Stock
                  </span>
                </div>
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">
                    Handcrafted Artworks Collection
                  </h3>
                  <p className="text-xs text-gray-600">
                    <span className="text-red-500 font-medium">Min. order: 1 pcs</span> • Various sold recently
                  </p>
                </div>

                {/* Cart Items */}
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex items-start space-x-4 hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems[item.id] || false}
                        onChange={() => toggleSelectItem(item.id)}
                        className="w-5 h-5 text-blue-600 rounded mt-1 focus:ring-blue-500"
                      />
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            <p className="text-sm font-medium text-gray-600 mt-1">
                              {formatCurrency(item.price)} / piece
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:text-gray-300 transition-colors"
                              >
                                −
                              </button>
                              <span className="w-12 text-center text-gray-500 text-sm font-medium py-1">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* RIGHT PANEL */}
            <aside className="w-full lg:w-96">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-6">
                <h2 className="font-semibold text-lg text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({selectedQuantity})</span>
                    <span className="font-medium text-gray-500">{formatCurrency(itemSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping fee</span>
                    <span className="font-medium text-gray-500">
                      {selectedQuantity > 0 ? formatCurrency(shippingFee) : '$0.00'}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-2 text-gray-500 font-semibold flex justify-between text-base">
                    <span>Subtotal (excl. tax)</span>
                    <span className="text-gray-900">{formatCurrency(subtotalExclTax)}</span>
                  </div>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                    selectedQuantity > 0
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  disabled={selectedQuantity === 0}
                >
                  {selectedQuantity > 0 ? '✓ Proceed to Checkout' : 'Select items to checkout'}
                </button>

                {/* Trust Badges */}
                <ul className="mt-6 space-y-3 text-sm text-gray-700">
                  {[
                    'On-time dispatch and delivery',
                    'Secure SSL-encrypted payments',
                    'Free cancellation, refunds, and returns',
                  ].map((text, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>

                {/* Payment Methods */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-center space-x-2 text-xs">
                    {['🟢', '🔴', '💳', '💰', '🍎', 'Pay'].map((icon, index) => (
                      <div
                        key={index}
                        className="w-8 h-6 bg-white border border-gray-200 rounded flex items-center justify-center"
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShoppingCartPage;