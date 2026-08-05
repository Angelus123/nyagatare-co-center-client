// app/dashboard/page.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaDownload, 
  FaSyncAlt, 
  FaEye, 
  FaCheck, 
  FaTimes,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChartBar,
  FaShoppingBag,
  FaUserPlus
} from "react-icons/fa";
import { MetricsCard } from "../components/dashboard/MetricsCard";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Header from "../components/dashboard/EditorHeader";
import { useAuth } from "../context/AuthContext";
import Sidebar, { MenuItem } from "../components/dashboard/Sidebar";

// Import different dashboard components
import DashboardOverview from "../components/dashboard/DashboardOverview";
import OrdersManagement from "../components/dashboard/OrdersManagement";
import CategoriesDashboard from "../components/dashboard/CategoriesDashboard";
import ArtworksManagement from "../components/dashboard/ArtworksManagement";
import CollectionsManagement from "../components/dashboard/CollectionsManagement";
import AnalyticsDashboard from "../components/dashboard/AnalyticsDashboard";
import ComingSoon from "../components/dashboard/ComingSoon";

// Define types for API responses
interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  shippingFee: number;
  taxAmount: number;
  status: string;
  // Add other order fields as needed
}

interface Artwork {
  id: string;
  artistId?: string;
  artist?: {
    id: string;
  };
  // Add other artwork fields as needed
}

interface OrdersResponse {
  total?: number;
  totalRevenue?: number;
  data?: Order[];
}

interface ArtworksResponse {
  total?: number;
  totalArtists?: number;
  data?: Artwork[];
}

interface CategoriesResponse {
  total?: number;
  data?: { id: string; name: string }[];
}

function DashboardContent() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [statsData, setStatsData] = useState({
    totalArtworks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalArtists: 0,
    featuredCollections: 12,
    activeExhibitions: 8,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const themeStyles = useMemo(
    () => ({
      bgColor: theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20",
      textColor: theme === "dark" ? "text-white" : "text-gray-800",
      secondaryBg: theme === "dark" ? "bg-gray-800" : "bg-white",
      borderColor: theme === "dark" ? "border-gray-700" : "border-amber-200",
      cardBg: theme === "dark" ? "bg-gray-800" : "bg-white",
      inputBg: theme === "dark" ? "bg-gray-700" : "bg-amber-50",
      inputBorder: theme === "dark" ? "border-gray-600" : "border-amber-200",
      navbarBg: theme === "dark" ? "bg-gray-800" : "bg-gradient-to-r from-amber-600 to-orange-600",
      buttonBg: theme === "dark" ? "bg-gradient-to-r from-amber-600 to-orange-600" : "bg-gradient-to-r from-amber-500 to-orange-600",
      linkColor: theme === "dark" ? "text-amber-400" : "text-amber-600",
      mutedText: theme === "dark" ? "text-gray-400" : "text-gray-600",
      tableHeaderBg: theme === "dark" ? "bg-gray-700" : "bg-amber-50",
      tableRowHover: theme === "dark" ? "hover:bg-gray-700" : "hover:bg-amber-50/50",
    }),
    [theme]
  );

  const fetchStats = async () => {
    setLoadingStats(true);
    setError(null);
    try {
      const token = await getToken();
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      const [ordersRes, artworksRes, categoriesRes] = await Promise.all([
        fetch('/api/orders', { headers }),
        fetch('/api/artworks', { headers }),
        fetch('/api/categories', { headers }),
      ]);

      if (!ordersRes.ok || !artworksRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data from APIs');
      }

      const ordersData: OrdersResponse | Order[] = await ordersRes.json();
      const artworksData: ArtworksResponse | Artwork[] = await artworksRes.json();
      const categoriesData: CategoriesResponse = await categoriesRes.json();

      // Calculate totals based on response structure
      const totalOrders = Array.isArray(ordersData) ? ordersData.length : (ordersData.total || 0);
      const totalArtworks = Array.isArray(artworksData) ? artworksData.length : (artworksData.total || 0);
      
      // For totalRevenue - use totalAmount from orders
      const totalRevenue = Array.isArray(ordersData)
        ? ordersData.reduce((sum: number, order: Order) => sum + (order.totalAmount || 0), 0)
        : (ordersData.totalRevenue || 0);

      // For totalArtists - get unique count from artistId or artist.id
      const totalArtists = Array.isArray(artworksData)
        ? new Set(artworksData.map((artwork: Artwork) => artwork.artistId || artwork.artist?.id).filter(Boolean)).size
        : (artworksData.totalArtists || 0);

      setStatsData({
        totalArtworks,
        totalOrders,
        totalRevenue,
        totalArtists,
        featuredCollections: 12, // Keep hardcoded as no API provided
        activeExhibitions: 8, // Keep hardcoded as no API provided
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching stats');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchStats();
      setMounted(true);
    };
    loadData();
  }, []);

  const renderActiveTab = () => {
    const tabComponents = {
      dashboard: <DashboardOverview  themeStyles={themeStyles} />,
      orders: <OrdersManagement  themeStyles={themeStyles} />,
      artworks: <ArtworksManagement  themeStyles={themeStyles} />,
      collections: <CollectionsManagement  themeStyles={themeStyles} />,
      analytics: <AnalyticsDashboard  themeStyles={themeStyles} />,
      categories: <CategoriesDashboard  themeStyles={themeStyles} />,
      exhibitions: <ComingSoon />,
      notifications: <ComingSoon />,
      settings: <ComingSoon />,
    };

    return tabComponents[activeTab as keyof typeof tabComponents] || tabComponents.dashboard;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50/30 to-orange-50/20">
        <div className="animate-pulse text-lg text-amber-600">Loading Dashboard...</div>
      </div>
    );
  }

  if (loadingStats) {
    return (
      <div className={`min-h-screen ${themeStyles.bgColor} ${themeStyles.textColor} font-sans flex items-center justify-center`}>
        <div className="text-center">
          <FaSyncAlt className="animate-spin mx-auto mb-4 text-4xl text-amber-600" />
          <p className="text-lg">Loading dashboard stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${themeStyles.bgColor} ${themeStyles.textColor} font-sans flex items-center justify-center`}>
        <div className="text-center">
          <FaTimes className="mx-auto mb-4 text-4xl text-red-500" />
          <p className="text-lg mb-2">Error loading stats: {error}</p>
          <button
            onClick={fetchStats}
            className={`${themeStyles.buttonBg} text-white px-4 py-2 rounded hover:opacity-90`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeStyles.bgColor} ${themeStyles.textColor} font-sans`}>
      <Head>
        <title>Insight Art Space - Dashboard</title>
      </Head>

      <Header theme={theme as "light" | "dark"} setTheme={setTheme} />

      <div className="flex min-h-[calc(100vh-80px)]">
        <Sidebar 
          theme={theme as "light" | "dark"} 
          themeStyles={themeStyles}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "dashboard" && (
                <MetricsCard
                  theme={theme as "light" | "dark"}
                  total={statsData.totalArtworks}
                  flagged={statsData.totalOrders}
                  unverified={statsData.totalRevenue}
                  users={statsData.totalArtists}
                  suspicious={statsData.featuredCollections}
                  pending={statsData.activeExhibitions}
                />
              )}
              
              {renderActiveTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function GalleryDashboard() {
  return (
    <AuthProvider>
      <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN']}>
        <DashboardContent />
      </ProtectedRoute> 
    </AuthProvider>
  );
}