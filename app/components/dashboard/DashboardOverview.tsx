// DashboardOverview.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaShoppingBag,
  FaUserPlus,
  FaPalette,
  FaStar,
  FaEye,
  FaHeart
} from 'react-icons/fa';

interface ThemeStyles {
  cardBg: string;
  borderColor: string;
  mutedText: string;
  linkColor: string;
}

interface DashboardOverviewProps {
  themeStyles: ThemeStyles;
}

/* --- API types --- */
interface Order {
  id: string;
  orderNumber?: string;
  userId?: string;
  status?: string;
  totalAmount: number;
  shippingFullName?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Artwork {
  id: string;
  title: string;
  artist?: string;
  price: number;
  status?: string;
  category?: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt?: string;
}

interface Category {
  id: string;
  name: string;
}

type PercentChange = { percent: number | null; note?: 'new' | 'na' | 'zero' };

const MS_DAY = 24 * 60 * 60 * 1000;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function computePercentChange(current: number, previous: number): PercentChange {
  if (previous === 0) {
    if (current === 0) return { percent: 0, note: 'zero' };
    return { percent: null, note: 'new' };
  }
  const raw = ((current - previous) / previous) * 100;
  return { percent: raw };
}

function formatPercentLabel(chg: PercentChange) {
  if (chg.note === 'na') return 'N/A';
  if (chg.note === 'new') return 'New';
  if (chg.note === 'zero') return '0%';
  if (chg.percent === null) return 'N/A';
  const rounded = Math.abs(Number(chg.percent.toFixed(1)));
  const sign = chg.percent > 0 ? '+' : chg.percent < 0 ? '−' : '';
  return `${sign}${rounded}%`;
}

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function DashboardOverview({ themeStyles }: DashboardOverviewProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [ordersRes, artworksRes, categoriesRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/artworks'),
          fetch('/api/categories'),
        ]);

        if (!ordersRes.ok) throw new Error(`/api/orders returned ${ordersRes.status}`);
        if (!artworksRes.ok) throw new Error(`/api/artworks returned ${artworksRes.status}`);
        if (!categoriesRes.ok) throw new Error(`/api/categories returned ${categoriesRes.status}`);

        const [ordersData, artworksData, categoriesData] = await Promise.all([
          ordersRes.json(),
          artworksRes.json(),
          categoriesRes.json(),
        ]);

        if (!mounted) return;
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setArtworks(Array.isArray(artworksData) ? artworksData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        if (mounted) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => { mounted = false; };
  }, []);

  // --- date calculations ---
  const now = new Date();
  const startToday = startOfDay(now);
  const startTomorrow = new Date(startToday.getTime() + MS_DAY);
  const startYesterday = new Date(startToday.getTime() - MS_DAY);

  const last7Start = new Date(startToday.getTime() - 6 * MS_DAY);
  const last7EndExclusive = startTomorrow;
  const prev7Start = new Date(startToday.getTime() - 13 * MS_DAY);
  const prev7EndExclusive = new Date(startToday.getTime() - 6 * MS_DAY);

  const within = (iso: string, startIncl: Date, endExcl: Date) => {
    const d = new Date(iso);
    return d >= startIncl && d < endExcl;
  };

  // --- Orders stats ---
  const todayOrders = orders.filter(o => within(o.createdAt, startToday, startTomorrow));
  const yesterdayOrders = orders.filter(o => within(o.createdAt, startYesterday, startToday));

  const todaySales = todayOrders.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
  const yesterdaySales = yesterdayOrders.reduce((s, o) => s + Number(o.totalAmount || 0), 0);

  const ordersCountToday = todayOrders.length;
  const ordersCountYesterday = yesterdayOrders.length;

  const salesChange = computePercentChange(todaySales, yesterdaySales);
  const ordersCountChange = computePercentChange(ordersCountToday, ordersCountYesterday);

  // --- Artworks ---
  const artworksLast7 = artworks.filter(a => within(a.createdAt, last7Start, last7EndExclusive)).length;
  const artworksPrev7 = artworks.filter(a => within(a.createdAt, prev7Start, prev7EndExclusive)).length;
  const artworks7Change = computePercentChange(artworksLast7, artworksPrev7);

  const totalArtworks = artworks.length;
  const totalCategories = categories.length;

  const topArtworks = [...artworks].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  // --- Recent activity ---
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
  const recentArtworks = [...artworks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  const recentActivities = [
    ...recentOrders.map(o => ({
      action: `Order ${o.orderNumber ?? o.id} ${o.status ?? ''}`.trim(),
      user: o.shippingFullName ?? 'Customer',
      time: new Date(o.createdAt).toLocaleString(),
      type: 'order' as const,
      amount: `$${Number(o.totalAmount || 0).toLocaleString()}`,
    })),
    ...recentArtworks.map(a => ({
      action: 'New artwork published',
      user: a.artist ?? 'Unknown',
      // ✅ Include exact hour, minute, and second
      time: new Date(a.createdAt).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      type: 'artwork' as const,
      artwork: a.title,
    })),
  ];

  if (loading) {
    return <div className="py-10 text-center text-gray-500 dark:text-gray-400">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">Error loading dashboard: {error}</div>;
  }

  const stats = [
    {
      label: 'Today Sales',
      value: formatCurrency(todaySales),
      change: salesChange,
      icon: <FaShoppingBag />,
    },
    {
      label: 'Orders Today',
      value: `${ordersCountToday}`,
      change: ordersCountChange,
      icon: <FaUserPlus />,
    },
    {
      label: 'New Artworks (7d)',
      value: `${artworksLast7}`,
      change: artworks7Change,
      icon: <FaPalette />,
    },
    {
      label: 'Total Artworks',
      value: `${totalArtworks}`,
      change: artworks7Change,
      icon: <FaStar />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const labelText = formatPercentLabel(stat.change);
          const isPositive = stat.change.percent !== null && (stat.change.percent ?? 0) > 0;
          const isNegative = stat.change.percent !== null && (stat.change.percent ?? 0) < 0;
          const isNew = stat.change.note === 'new';
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className={`${themeStyles.cardBg} rounded-2xl p-6 border ${themeStyles.borderColor} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${themeStyles.mutedText}`}>{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : themeStyles.mutedText}`}>
                    {isNew ? 'New' : labelText} {stat.change.note === 'na' ? '' : 'from previous period'}
                  </p>
                </div>
                <div className="text-3xl p-3 rounded-xl">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-100 dark:from-amber-200 dark:to-amber-200">
                    {stat.icon}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className={`${themeStyles.cardBg} rounded-2xl p-6 border ${themeStyles.borderColor}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <button className={`text-sm ${themeStyles.linkColor} hover:underline`}>View All</button>
          </div>

          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className={`text-sm ${themeStyles.mutedText}`}>No recent activity.</p>
            ) : (
              recentActivities.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-amber-50/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                    activity.type === 'artwork' ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-green-500 to-emerald-500'
                  }`}>
                    {activity.type === 'artwork' ? <FaPalette /> : <FaShoppingBag />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className={`text-sm ${themeStyles.mutedText}`}>
                      by {activity.user} {('artwork' in activity && activity.artwork) ? `• ${activity.artwork}` : ''} {('amount' in activity && activity.amount) ? `• ${activity.amount}` : ''}
                    </p>
                  </div>
                  <span className={`text-sm ${themeStyles.mutedText}`}>{activity.time}</span>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Top Artworks */}
        <div className={`${themeStyles.cardBg} rounded-2xl p-6 border ${themeStyles.borderColor}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Top Performing Artworks</h3>
            <button className={`text-sm ${themeStyles.linkColor} hover:underline`}>View All</button>
          </div>

          <div className="space-y-4">
            {topArtworks.length === 0 ? (
              <p className={`text-sm ${themeStyles.mutedText}`}>No artworks yet.</p>
            ) : (
              topArtworks.map((art, idx) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-amber-50/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-200 dark:from-amber-200 dark:to-orange-200 rounded-lg flex items-center justify-center">
                    <FaPalette className="text-amber-600 dark:text-amber-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{art.title}</p>
                        <p className={`text-sm ${themeStyles.mutedText}`}>by {art.artist ?? 'Unknown'}</p>
                      </div>
                      <p className="font-bold text-amber-600">${Number(art.price || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1"><FaEye className="text-blue-500" /> {art.views ?? 0}</span>
                      <span className="flex items-center gap-1"><FaHeart className="text-red-500" /> {art.likes ?? 0}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
