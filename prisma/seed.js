require("dotenv").config();
const { PrismaClient, ArtworkStatus } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// ======================
// Categories
// ======================
const categories = [
  {
    name: "jewelry",
    displayName: "Jewelry",
    description: "Exquisite handmade jewelry with traditional designs",
    image: "/images/categories/jewelry.jpg",
    icon: "💍",
    productCount: 4,
  },
  {
    name: "home-decor",
    displayName: "Home Decor",
    description: "Beautiful handcrafted items for your living space",
    image: "/images/categories/home-decor.jpg",
    icon: "🏺",
    productCount: 2,
  },
  {
    name: "ceramics",
    displayName: "Ceramics",
    description: "Handcrafted pottery and ceramic art pieces",
    image: "/images/categories/ceramics.jpg",
    icon: "🍶",
    productCount: 2,
  },
  {
    name: "textiles",
    displayName: "Textiles",
    description: "Woven and embroidered fabrics with traditional patterns",
    image: "/images/categories/textiles.jpg",
    icon: "🧵",
    productCount: 2,
  },
  {
    name: "woodwork",
    displayName: "Woodwork",
    description: "Exquisite wooden sculptures and functional items",
    image: "/images/categories/woodwork.jpg",
    icon: "🪵",
    productCount: 1,
  },
  {
    name: "fashion",
    displayName: "Fashion",
    description: "Traditional and contemporary fashion accessories",
    image: "/images/categories/fashion.jpg",
    icon: "👘",
    productCount: 1,
  },
  // ======================
  // Art Categories
  // ======================
  {
    name: "painting",
    displayName: "Painting",
    description: "Traditional and contemporary paintings",
    image: "/images/categories/painting.jpg",
    icon: "🎨",
    productCount: 0,
  },
  {
    name: "abstract",
    displayName: "Abstract",
    description: "Abstract art and expressionist works",
    image: "/images/categories/abstract.jpg",
    icon: "🟡",
    productCount: 0,
  },
  {
    name: "digital",
    displayName: "Digital Art",
    description: "Digital creations and prints",
    image: "/images/categories/digital.jpg",
    icon: "💻",
    productCount: 0,
  },
  {
    name: "photography",
    displayName: "Photography",
    description: "Fine art photography prints",
    image: "/images/categories/photography.jpg",
    icon: "📷",
    productCount: 0,
  },
];

// ======================
// artworks
// ======================
const products = [
  {
    name: "Handwoven Basket",
    description:
      "Intricately woven from natural fibers, perfect for storage or decor.",
    price: 45.99,
    image: "/images/artworks/basket.jpg",
    category: "home-decor",
    rating: 4.5,
    reviewCount: 128,  // Changed from 'reviews'
  },
  {
    name: "Ceramic Vase",
    description:
      "Hand-painted with traditional motifs, adds elegance to any space.",
    price: 59.99,
    image: "/images/artworks/TKX00217.jpg",
    category: "ceramics",
    rating: 4.8,
    reviewCount: 89,  // Changed from 'reviews'
  },
  {
    name: "Wooden Sculpture",
    description: "Carved from sustainable wood, depicting cultural symbols.",
    price: 89.99,
    image: "/images/artworks/TKX00247.jpg",
    category: "woodwork",
    rating: 4.3,
    reviewCount: 67,  // Changed from 'reviews'
  },
  {
    name: "Embroidered Textile",
    description: "Vibrant patterns hand-stitched by artisans.",
    price: 34.99,
    image: "/images/artworks/textiles.jpg",
    category: "textiles",
    rating: 4.6,
    reviewCount: 203,  // Changed from 'reviews'
  },
  {
    name: "Beaded Jewelry Set",
    description:
      "Colorful beads in traditional designs, includes necklace and earrings.",
    price: 29.99,
    image: "/images/artworks/jewelry.jpg",
    category: "jewelry",
    rating: 4.9,
    reviewCount: 156,  // Changed from 'reviews'
  },
  {
    name: "Silver Tribal Necklace",
    description: "Handcrafted silver necklace with traditional motifs.",
    price: 89.99,
    image: "/images/artworks/jewelry-2.jpg",
    category: "jewelry",
    rating: 4.7,
    reviewCount: 92,  // Changed from 'reviews'
  },
  {
    name: "Gold Plated Earrings",
    description: "Elegant gold plated earrings with gemstone accents.",
    price: 45.5,
    image: "/images/artworks/jewelry-3.jpg",
    category: "jewelry",
    rating: 4.8,
    reviewCount: 134,  // Changed from 'reviews'
  },
  {
    name: "Traditional Bracelet Set",
    description: "Set of three bracelets with cultural patterns.",
    price: 67.0,
    image: "/images/artworks/jewelry-4.jpg",
    category: "jewelry",
    rating: 4.6,
    reviewCount: 78,  // Changed from 'reviews'
  },
  {
    name: "Handwoven Wall Hanging",
    description: "Beautiful textile art for your walls.",
    price: 75.99,
    image: "/images/artworks/textiles-2.jpg",
    category: "home-decor",
    rating: 4.4,
    reviewCount: 56,  // Changed from 'reviews'
  },
  {
    name: "Decorative Ceramic Plates",
    description: "Set of hand-painted decorative plates.",
    price: 52.99,
    image: "/images/artworks/ceramics-2.jpg",
    category: "home-decor",
    rating: 4.7,
    reviewCount: 89,  // Changed from 'reviews'
  },
];

// ======================
// Artworks
// ======================
const artworks = [
  { 
    title: 'Sunset Dreams', 
    artist: 'Maria Rodriguez', 
    price: 2500, 
    status: ArtworkStatus.AVAILABLE, 
    category: 'Painting', 
    medium: 'Oil on Canvas',
    views: 1247, 
    likes: 89,
    featured: true,
    description: 'A beautiful sunset landscape capturing the golden hour over rolling hills.',
    dimensions: '24" x 36"',
    imageUrl: '/images/artworks/sunset-dreams.jpg',
    createdAt: new Date('2024-01-15')
  },
  { 
    title: 'Abstract Harmony', 
    artist: 'James Wilson', 
    price: 1800, 
    status: ArtworkStatus.SOLD, 
    category: 'Abstract', 
    medium: 'Acrylic',
    views: 892, 
    likes: 67,
    featured: false,
    description: 'An exploration of color and form in abstract expressionism.',
    dimensions: '30" x 30"',
    imageUrl: '/images/artworks/abstract-harmony.jpg',
    createdAt: new Date('2024-01-10')
  },
  { 
    title: 'Ocean Waves', 
    artist: 'Sarah Chen', 
    price: 3200, 
    status: ArtworkStatus.AVAILABLE, 
    category: 'Digital', 
    medium: 'Digital Art',
    views: 1567, 
    likes: 124,
    featured: true,
    description: 'Digital rendering of powerful ocean waves with photorealistic details.',
    dimensions: 'Limited Edition Print',
    imageUrl: '/images/artworks/ocean-waves.jpg',
    createdAt: new Date('2024-01-08')
  },
  { 
    title: 'Mountain Peak', 
    artist: 'Robert Kim', 
    price: 2750, 
    status: ArtworkStatus.RESERVED, 
    category: 'Photography', 
    medium: 'Fine Art Print',
    views: 734, 
    likes: 45,
    featured: false,
    description: 'Black and white photography of majestic mountain ranges at dawn.',
    dimensions: '16" x 24"',
    imageUrl: '/images/artworks/mountain-peak.jpg',
    createdAt: new Date('2024-01-12')
  },
  // Additional artworks to showcase variety
  { 
    title: 'Urban Reflections', 
    artist: 'Lisa Thompson', 
    price: 1900, 
    status: ArtworkStatus.AVAILABLE, 
    category: 'Painting', 
    medium: 'Watercolor',
    views: 567, 
    likes: 34,
    featured: false,
    description: 'Cityscape reflections in rain puddles with vibrant watercolor technique.',
    dimensions: '18" x 24"',
    imageUrl: '/images/artworks/urban-reflections.jpg',
    createdAt: new Date('2024-01-20')
  },
  { 
    title: 'Desert Bloom', 
    artist: 'Ahmed Hassan', 
    price: 4200, 
    status: ArtworkStatus.AVAILABLE, 
    category: 'Abstract', 
    medium: 'Mixed Media',
    views: 892, 
    likes: 78,
    featured: true,
    description: 'Mixed media exploration of desert flora and geometric patterns.',
    dimensions: '36" x 48"',
    imageUrl: '/images/artworks/desert-bloom.jpg',
    createdAt: new Date('2024-01-05')
  },
  { 
    title: 'Silent Forest', 
    artist: 'Emma Wilson', 
    price: 2800, 
    status: ArtworkStatus.RESERVED, 
    category: 'Photography', 
    medium: 'Fine Art Print',
    views: 1123, 
    likes: 156,
    featured: false,
    description: 'Misty morning in an ancient forest captured with large format camera.',
    dimensions: '20" x 30"',
    imageUrl: '/images/artworks/silent-forest.jpg',
    createdAt: new Date('2024-01-18')
  },
  { 
    title: 'Neon Dreams', 
    artist: 'Carlos Martinez', 
    price: 3500, 
    status: ArtworkStatus.AVAILABLE, 
    category: 'Digital', 
    medium: 'Digital Painting',
    views: 2045, 
    likes: 234,
    featured: true,
    description: 'Cyberpunk cityscape with neon lights and futuristic elements.',
    dimensions: 'Digital Original',
    imageUrl: '/images/artworks/neon-dreams.jpg',
    createdAt: new Date('2024-01-03')
  }
];

// ======================
// Users
// ======================
const users = [
  {
    email: "admin@example.com",
    firstName: "Alice",
    lastName: "Admin",
    role: "ADMIN",
    password: "admin123",
    isVerified: true,
  },
  {
    email: "manager@example.com",
    firstName: "Mark",
    lastName: "Manager",
    role: "MANAGER",
    password: "manager123",
    isVerified: true,
  },
  {
    email: "client@example.com",
    firstName: "Clara",
    lastName: "Client",
    role: "CLIENT",
    password: "client123",
    isVerified: false,
  },
  // Additional user for artwork management
  {
    email: "gallery@example.com",
    firstName: "Gallery",
    lastName: "Manager",
    role: "MANAGER",
    password: "gallery123",
    isVerified: true,
  },
];

// ======================
// Main seeding function
// ======================
async function main() {
  console.log("🌱 Seeding database...");

  // 👉 Seed Categories
  console.log("📁 Seeding categories...");
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
  }

  // 👉 Seed artworks
  console.log("🛍️ Seeding products...");
  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: p,
      create: p,
    });
  }

  // 👉 Seed Artworks (Fixed approach)
  console.log("🎨 Seeding artworks...");
  for (const artwork of artworks) {
    // First, try to find if artwork exists
    const existingArtwork = await prisma.artwork.findFirst({
      where: {
        title: artwork.title,
        artist: artwork.artist
      }
    });

    if (existingArtwork) {
      // Update existing artwork
      await prisma.artwork.update({
        where: { id: existingArtwork.id },
        data: artwork
      });
    } else {
      // Create new artwork
      await prisma.artwork.create({
        data: artwork
      });
    }
  }

  // 👉 Seed Users with hashed passwords
  console.log("👥 Seeding users...");
  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        password: hashedPassword,
        isVerified: u.isVerified,
      },
      create: {
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        password: hashedPassword,
        isVerified: u.isVerified,
      },
    });
  }

  console.log("✅ Seeding finished!");
  console.log(`📊 Summary:`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${products.length} products`);
  console.log(`   - ${artworks.length} artworks`);
  console.log(`   - ${users.length} users`);
}

// Run it
main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });