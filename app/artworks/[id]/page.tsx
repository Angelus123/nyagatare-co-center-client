'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Inter, Playfair_Display } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  StarHalf, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Minus,
  Check,
  Shield,
  Truck,
  ArrowLeft,
  X
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  details?: string[];
}

// Enhanced artworks data with more details
const artworks = [
  {
    id: 1,
    name: 'Handwoven Basket',
    description: 'Intricately woven from natural fibers, perfect for storage or decor. This beautiful basket is crafted by skilled artisans using sustainable materials that are both durable and eco-friendly.',
    price: 45.99,
    image: '/images/artworks/basket.jpg',
    category: 'home-decor',
    details: [
      'Material: Natural fibers',
      'Handwoven by artisans',
      'Eco-friendly and sustainable',
      'Size: 12" diameter x 8" height'
    ],
  },
  {
    id: 2,
    name: 'Ceramic Vase',
    description: 'Hand-painted with traditional motifs, adds elegance to any space. Each vase is unique, featuring patterns passed down through generations of ceramic artists.',
    price: 59.99,
    image: '/images/artworks/TKX00217.jpg',
    category: 'ceramics',
    details: [
      'Material: Ceramic',
      'Hand-painted traditional motifs',
      'Height: 10"',
      'Each piece is unique'
    ],
  },
  {
    id: 3,
    name: 'Wooden Sculpture',
    description: 'Carved from sustainable wood, depicting cultural symbols. This sculpture represents the rich heritage and craftsmanship of local woodworkers.',
    price: 89.99,
    image: '/images/artworks/TKX00247.jpg',
    category: 'woodwork',
    details: [
      'Material: Sustainable wood',
      'Hand-carved cultural symbols',
      'Height: 14"',
      'Unique grain patterns'
    ],
  },
  {
    id: 4,
    name: 'Embroidered Textile',
    description: 'Vibrant patterns hand-stitched by artisans. Each textile tells a story through its intricate designs and color combinations.',
    price: 34.99,
    image: '/images/artworks/textiles.jpg',
    category: 'textiles',
    details: [
      'Material: Cotton blend',
      'Hand-embroidered patterns',
      'Size: 24" x 36"',
      'Machine washable'
    ],
  },
  {
    id: 5,
    name: 'Beaded Jewelry Set',
    description: 'Colorful beads in traditional designs, includes necklace and earrings. Made with natural stones and traditional beading techniques.',
    price: 29.99,
    image: '/images/artworks/jewelry.jpg',
    category: 'jewelry',
    details: [
      'Includes necklace and earrings',
      'Natural stones and beads',
      'Handcrafted',
      'Traditional beading techniques'
    ],
  },
  {
    id: 6,
    name: 'Pottery Bowl',
    description: 'Wheel-thrown and glazed with earthy tones. Each bowl is unique with its own character and finish.',
    price: 24.99,
    image: '/images/artworks/TKX00247.jpg',
    category: 'ceramics',
    details: [
      'Material: Pottery clay',
      'Wheel-thrown and glazed',
      'Diameter: 8"',
      'Food safe'
    ],
  },
  {
    id: 7,
    name: 'Bamboo Lantern',
    description: 'Eco-friendly lantern with intricate cutouts for ambient lighting. Creates beautiful patterns when lit.',
    price: 39.99,
    image: '/images/artworks/TKX00319.jpg',
    category: 'lighting',
    details: [
      'Material: Bamboo',
      'Hand-cut patterns',
      'Height: 12"',
      'For indoor use'
    ],
  },
  {
    id: 8,
    name: 'Silk Scarf',
    description: 'Hand-dyed silk with cultural prints, soft and luxurious. Lightweight and perfect for any occasion.',
    price: 49.99,
    image: '/images/artworks/TKX00247.jpg',
    category: 'fashion',
    details: [
      'Material: 100% silk',
      'Hand-dyed prints',
      'Size: 60" x 18"',
      'Dry clean only'
    ],
  },
  {
    id: 9,
    name: 'Metal Wall Art',
    description: 'Hammered metal piece inspired by ancient craftsmanship. Adds a touch of elegance to any wall.',
    price: 74.99,
    image: '/images/artworks/TKX00310.jpg',
    category: 'metalwork',
    details: [
      'Material: Hammered metal',
      'Wall mount included',
      'Size: 20" x 20"',
      'Handcrafted finish'
    ],
  },
  {
    id: 10,
    name: 'Leather Journal',
    description: 'Hand-bound with embossed designs, ideal for writing or sketching. Features high-quality paper and durable binding.',
    price: 32.99,
    image: '/images/artworks/TKX00247.jpg',
    category: 'stationery',
    details: [
      'Material: Genuine leather',
      'Hand-bound',
      'Includes 120 pages',
      'Size: 6" x 8"'
    ],
  },
  {
    id: 11,
    name: 'Stone Carving',
    description: 'Detailed sculpture from natural stone, a timeless piece. Showcases the natural beauty of the material.',
    price: 99.99,
    image: '/images/artworks/TKX09970.jpg',
    category: 'stonework',
    details: [
      'Material: Natural stone',
      'Hand-carved details',
      'Height: 10"',
      'Each piece is unique'
    ],
  },
  {
    id: 12,
    name: 'Woven Rug',
    description: 'Durable and colorful, hand-loomed from wool and cotton. Adds warmth and character to any room.',
    price: 129.99,
    image: '/images/artworks/woodwork.jpg',
    category: 'textiles',
    details: [
      'Material: Wool and cotton',
      'Hand-loomed',
      'Size: 5\' x 7\'',
      'Vibrant colors'
    ],
  },
];


// Star Rating Component
const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div className="flex">
      {[...Array(full)].map((_, i) => (
        <Star key={`full-${i}`} size={size} color="#fbbf24" fill="#fbbf24" />
      ))}
      {half ? <StarHalf key="half" size={size} color="#fbbf24" fill="#fbbf24" /> : null}
      {[...Array(empty)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} color="#d1d5db" fill="transparent" />
      ))}
    </div>
  );
};

// Image Gallery Component
const ImageGallery: React.FC<{ images: string[]; productName: string }> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        <motion.img
          key={selectedImage}
          src={images[selectedImage]}
          alt={productName}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Navigation Arrows for multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage(prev => (prev - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setSelectedImage(prev => (prev + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index ? 'border-amber-500' : 'border-transparent'
              }`}
            >
              <img
                src={image}
                alt={`${productName} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Product Page Component
const Product = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const product = artworks.find(p => p.id === parseInt(id));
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description');

  // Mock product images (in real app, you'd have multiple images per product)
  const productImages = [
    product?.image || '',
    product?.image || '', // Duplicate for demo - replace with actual different images
    product?.image || '',
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
      },
      quantity
    );

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
      },
      quantity
    );

    router.push('/cart');
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-amber-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className={`${playfair.className} text-4xl font-bold text-amber-900 mb-4`}>
              Product Not Found
            </h1>
            <p className="text-amber-700 mb-8">The product you &apos;re looking for doesn&apos;t exist.</p>
            <Link 
              href="/artworks" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Browse Artworks
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const related = artworks.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const rating = 4.5; // Mock rating - in real app, this would come from your data
  const reviews = 127; // Mock reviews count

  return (
    <div className="min-h-screen bg-amber-50">
      <Header/>
      
      {/* Success Notification */}
      <AnimatePresence>
        {addedToCart && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3"
          >
            <div className="bg-green-600 rounded-full p-1">
              <ShoppingCart size={20} />
            </div>
            <div>
              <p className="font-semibold">Successfully added to cart!</p>
              <p className="text-sm opacity-90">{quantity} x {product.name}</p>
            </div>
            <button
              onClick={() => setAddedToCart(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-amber-700">
          <Link href="/" className="hover:text-amber-900">Home</Link>
          <span>/</span>
          <Link href="/artworks" className="hover:text-amber-900">Artworks</Link>
          <span>/</span>
          <span className="text-amber-900 font-medium">{product.name}</span>
        </nav>
      </div>

      <div className={`${inter.className} container mx-auto px-4 py-8`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={productImages} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className={`${playfair.className} text-4xl font-bold text-amber-900 mb-2`}>
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={rating} />
                <span className="text-amber-700">{rating} ({reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-amber-600 mb-4">
                ${product.price.toFixed(2)}
              </div>
            </div>

            {/* Description */}
            <p className="text-amber-800 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-amber-900">Quantity:</span>
              <div className="flex items-center text-gray-500 border border-amber-300 rounded-lg">
                <button 
                  onClick={decreaseQuantity}
                  className="p-3 hover:bg-amber-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 min-w-[60px] text-center font-semibold">
                  {quantity}
                </span>
                <button 
                  onClick={increaseQuantity}
                  className="p-3 hover:bg-amber-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={handleAddToCart}
                className={`flex-1 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-3 ${
                  addedToCart 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
                whileHover={{ scale: !addedToCart ? 1.02 : 1 }}
                whileTap={{ scale: !addedToCart ? 0.98 : 1 }}
                disabled={addedToCart}
              >
                <ShoppingCart size={20} />
                {addedToCart ? 'Added!' : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
              </motion.button>
              
              <motion.button
                onClick={handleBuyNow}
                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Buy Now
              </motion.button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-4">
              <button
                onClick={toggleWishlist}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isWishlisted 
                    ? 'bg-red-50 text-red-600 border border-red-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                <Share2 size={18} />
                Share
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-amber-200">
              <div className="flex items-center gap-3 text-sm">
                <Truck size={20} className="text-amber-600" />
                <div>
                  <div className="font-semibold text-gray-400">Free Shipping</div>
                  <div className="text-amber-700">Over $50</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Shield size={20} className="text-amber-600" />
                <div>
                  <div className="font-semibold text-gray-400">Secure Payment</div>
                  <div className="text-amber-700">100% Protected</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Check size={20} className="text-amber-600" />
                <div>
                  <div className="font-semibold text-gray-400">Quality Guarantee</div>
                  <div className="text-amber-700">1 Year Warranty</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="border-b border-amber-200">
            <nav className="flex gap-8">
              {[
                { id: 'description' as const, label: 'Description' },
                { id: 'details' as const, label: 'Product Details' },
                { id: 'shipping' as const, label: 'Shipping & Returns' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-2 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'text-amber-700 border-b-2 border-amber-700'
                      : 'text-amber-600 hover:text-amber-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-amber max-w-none">
                <p className="text-amber-800 leading-relaxed">
                  {product.description} This exquisite piece is crafted with the utmost care and attention to detail, 
                  ensuring that each item is unique and of the highest quality. Perfect for adding a touch of 
                  handmade elegance to your home or as a special gift for loved ones.
                </p>
              </div>
            )}

            {activeTab === 'details' && product.details && (
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-center gap-3 text-amber-800">
                    <Check size={16} className="text-amber-600 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-amber-800">
                <div>
                  <h4 className="font-semibold mb-2">Shipping Information</h4>
                  <p>Free standard shipping on orders over $50. Express shipping available for an additional fee.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Returns Policy</h4>
                  <p>30-day return policy. Items must be in original condition. Custom pieces may have different return policies.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className={`${playfair.className} text-3xl font-bold text-amber-900 mb-8 text-center`}>
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(item => (
                <Link 
                  key={item.id} 
                  href={`/artworks/${item.id}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-amber-600 font-semibold mt-2">${item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Product;