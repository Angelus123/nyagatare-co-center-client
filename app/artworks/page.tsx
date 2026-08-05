'use client';
import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { Inter, Playfair_Display } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const artworks = [
  {
    id: 1,
    name: 'Handwoven Basket',
    description: 'Intricately woven from natural fibers, perfect for storage or decor. This beautiful basket is crafted by skilled artisans using sustainable materials that are both durable and eco-friendly.',
    price: 45.99,
    image: '/images/artworks/basket.jpg',
    category: 'home-decor',
  },
  {
    id: 2,
    name: 'Ceramic Vase',
    description: 'Hand-painted with traditional motifs, adds elegance to any space. Each vase is unique, featuring patterns passed down through generations of ceramic artists.',
    price: 59.99,
    image: '/images/artworks/TKX00217.jpg',
    category: 'ceramics',
  },
  {
    id: 3,
    name: 'Wooden Sculpture',
    description: 'Carved from sustainable wood, depicting cultural symbols. This sculpture represents the rich heritage and craftsmanship of local woodworkers.',
    price: 89.99,
    image: '/images/artworks/TKX00247.jpg',
    category: 'woodwork',
  },
  {
    id: 4,
    name: 'Embroidered Textile',
    description: 'Vibrant patterns hand-stitched by artisans. Each textile tells a story through its intricate designs and color combinations.',
    price: 34.99,
    image: '/images/artworks/textiles.jpg',
    category: 'textiles',
  },
  {
    id: 5,
    name: 'Beaded Jewelry Set',
    description: 'Colorful beads in traditional designs, includes necklace and earrings. Made with natural stones and traditional beading techniques.',
    price: 29.99,
    image: '/images/artworks/jewelry.jpg',
    category: 'jewelry',
  },
  {
    id: 6,
    name: 'Pottery Bowl',
    description: 'Wheel-thrown and glazed with earthy tones. Each bowl is unique with its own character and finish.',
    price: 24.99,
    image: '/images/artworks/TKX00247.jpg',
    category: 'ceramics',
  },
  {
    id: 7,
    name: 'Bamboo Lantern',
    description: 'Eco-friendly lantern with intricate cutouts for ambient lighting. Creates beautiful patterns when lit.',
    price: 39.99,
    image: '/images/artworks/TKX00319.jpg',
    category: 'lighting',
  },
  {
    id: 8,
    name: 'Silk Scarf',
    description: 'Hand-dyed silk with cultural prints, soft and luxurious. Lightweight and perfect for any occasion.',
    price: 49.99,
    image: '/images/artworks/TKX00247.jpg',
    category: 'fashion',
  },
  {
    id: 9,
    name: 'Metal Wall Art',
    description: 'Hammered metal piece inspired by ancient craftsmanship. Adds a touch of elegance to any wall.',
    price: 74.99,
    image: '/images/artworks/TKX00310.jpg',
    category: 'metalwork',
  },
  {
    id: 10,
    name: 'Leather Journal',
    description: 'Hand-bound with embossed designs, ideal for writing or sketching. Features high-quality paper and durable binding.',
    price: 32.99,
    image: '/images/artworks/TKX00247.jpg',
    category: 'stationery',
  },
  {
    id: 11,
    name: 'Stone Carving',
    description: 'Detailed sculpture from natural stone, a timeless piece. Showcases the natural beauty of the material.',
    price: 99.99,
    image: '/images/artworks/TKX09970.jpg',
    category: 'stonework',
  },
  {
    id: 12,
    name: 'Woven Rug',
    description: 'Durable and colorful, hand-loomed from wool and cotton. Adds warmth and character to any room.',
    price: 129.99,
    image: '/images/artworks/woodwork.jpg',
    category: 'textiles',
  },
];

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

function Products() {

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [cart, setCart] = useState<Product[]>([]);
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
      <div className={`${inter.className} min-h-screen bg-amber-50 py-8`}>
        <div className="container mx-auto px-4">
          <h1 className={`${playfair.className} text-4xl font-bold text-amber-900 mb-8`}>
            All Artworks
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((product) => (
              <Link
                key={product.id}
                href={`/artworks/${product.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium mb-2 capitalize">
                    {product.category.replace('-', ' ')}
                  </span>
                  <h3 className="font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-amber-600 font-bold mt-2">${product.price}</p>
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
const WrappedProducts = () => (
  <CartProvider>
    <Products />
  </CartProvider>
);

export default WrappedProducts;