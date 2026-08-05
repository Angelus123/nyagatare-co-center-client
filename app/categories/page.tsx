'use client';
import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { Inter, Playfair_Display } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

const categories = [
  {
    name: 'jewelry',
    displayName: 'Jewelry',
    description: 'Exquisite handmade jewelry with traditional designs',
    image: '/images/categories/jewelry.jpg',
    icon: '💍',
    productCount: 4
  },
  {
    name: 'home-decor',
    displayName: 'Home Decor',
    description: 'Beautiful handcrafted items for your living space',
    image: '/images/categories/home-decor.jpg',
    icon: '🏺',
    productCount: 2
  },
  {
    name: 'ceramics',
    displayName: 'Ceramics',
    description: 'Handcrafted pottery and ceramic art pieces',
    image: '/images/categories/ceramics.jpg',
    icon: '🍶',
    productCount: 2
  },
  {
    name: 'textiles',
    displayName: 'Textiles',
    description: 'Woven and embroidered fabrics with traditional patterns',
    image: '/images/categories/textiles.jpg',
    icon: '🧵',
    productCount: 2
  },
  {
    name: 'woodwork',
    displayName: 'Woodwork',
    description: 'Exquisite wooden sculptures and functional items',
    image: '/images/categories/woodwork.jpg',
    icon: '🪵',
    productCount: 1
  },
  {
    name: 'fashion',
    displayName: 'Fashion',
    description: 'Traditional and contemporary fashion accessories',
    image: '/images/categories/fashion.jpg',
    icon: '👘',
    productCount: 1
  }
];

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

// Cart Context for better state management
interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};



const Categories: React.FC = () => {

 const [cart, setCart] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [showDescription, setShowDescription] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);

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
      <div className={`${inter.className} min-h-screen bg-gray-50 py-20`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className={`${playfair.className} text-2xl md:text-2xl font-bold text-gray-900 mb-4`}>
              SHOP BY CATEGORY
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our carefully curated collections of handcrafted products, each category representing
              unique traditional crafts and artisan skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/categories/${category.name}`}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-amber-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {category.productCount} items
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className="text-2xl font-semibold">{category.displayName}</h3>
                    </div>
                    <p className="text-amber-100 text-sm">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const WrappedCategories = () => (
  <CartProvider>
    <Categories />
  </CartProvider>
);

export default WrappedCategories;