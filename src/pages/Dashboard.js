import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  BarChart3,
  Users,
  Package,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export default function Dashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    avgProfitability: 0,
    trendingThisWeek: 0,
    topCategory: "N/A",
    marketsCovered: 0,
  });
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ec4899"];

  // API helper functions
  const apiCall = async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    return response.json();
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [metricsData, productsData, trendsData] = await Promise.all([
        apiCall('/metrics').catch(() => ({})),
        apiCall('/products?limit=20').catch(() => []),
        apiCall('/products/trending').catch(() => []),
      ]);

      // Update metrics
      setMetrics({
        totalProducts: metricsData.totalProducts || 0,
        avgProfitability: metricsData.avgProfitability || 0,
        trendingThisWeek: metricsData.trendingThisWeek || 0,
        topCategory: metricsData.topCategory || "N/A",
        marketsCovered: metricsData.marketsCovered || 0,
      });

      // Update trending products
      setTrendingProducts(
        productsData.slice(0, 4).map((product) => ({
          name: product.name,
          category: product.category,
          trend: `+${Math.floor(Math.random() * 20)}%`, // You can calculate this from trend data
          profitabilityScore: product.profitabilityScore,
        }))
      );

      // Generate chart data from products (group by category)
      const categoryMap = {};
      productsData.forEach((product) => {
        if (!categoryMap[product.category]) {
          categoryMap[product.category] = 0;
        }
        categoryMap[product.category] += 1;
      });

      setCategoryData(
        Object.entries(categoryMap).map(([name, value]) => ({
          name,
          value,
        }))
      );

      // Generate line chart data (mock time series - you can enhance this)
      setChartData([
        { name: "Jan", products: Math.floor(metricsData.totalProducts * 0.3) },
        { name: "Feb", products: Math.floor(metricsData.totalProducts * 0.4) },
        { name: "Mar", products: Math.floor(metricsData.totalProducts * 0.6) },
        { name: "Apr", products: Math.floor(metricsData.totalProducts * 0.7) },
        { name: "May", products: metricsData.totalProducts },
      ]);

    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
      <span className="ml-2 text-gray-400">Loading dashboard...</span>
    </div>
  );

  const ErrorMessage = () => (
    <div className="flex items-center justify-center p-8 text-red-400">
      <AlertCircle className="w-6 h-6 mr-2" />
      <span>{error}</span>
    </div>
  );

  if (loading) {
    return (
      <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
        <ErrorMessage />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Hero Header */}
      <div className={`relative overflow-hidden rounded-3xl mb-8 ${isDark ? 'bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900' : 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600'}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <BarChart3 className="w-8 h-8" />
                </div>
                Dashboard
              </h1>
              <p className="text-white/80 text-lg">AI-powered insights for your product hunting journey</p>
            </div>
            <button
              onClick={handleRefresh}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 border border-white/20"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Data
            </button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Row 1: Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products Card */}
        <div className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isDark ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/20' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                <Package className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
              <TrendingUp className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
            </div>
            <div className="space-y-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Products</p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{metrics.totalProducts}</p>
            </div>
          </div>
        </div>

        {/* Average Profitability Card */}
        <div className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isDark ? 'bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border border-emerald-500/20' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <BarChart3 className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <TrendingUp className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
            </div>
            <div className="space-y-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Profitability</p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{metrics.avgProfitability}%</p>
            </div>
          </div>
        </div>

        {/* Trending This Week Card */}
        <div className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isDark ? 'bg-gradient-to-br from-orange-900/50 to-red-900/50 border border-orange-500/20' : 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                <TrendingUp className={`w-6 h-6 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <TrendingUp className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
            </div>
            <div className="space-y-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Trending This Week</p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{metrics.trendingThisWeek}</p>
            </div>
          </div>
        </div>

        {/* Top Category Card */}
        <div className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isDark ? 'bg-gradient-to-br from-pink-900/50 to-purple-900/50 border border-pink-500/20' : 'bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${isDark ? 'bg-pink-500/20' : 'bg-pink-100'}`}>
                <ShoppingBag className={`w-6 h-6 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
              </div>
              <TrendingUp className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
            </div>
            <div className="space-y-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Top Category</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{metrics.topCategory}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Trending Products */}
      <div className="mb-8">
        <div className={`rounded-3xl p-8 ${isDark ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50' : 'bg-white/70 border border-gray-200/50'} backdrop-blur-xl shadow-2xl`}>
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <TrendingUp className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            🔥 Trending Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingProducts.map((product, index) => (
              <div
                key={index}
                className={`group p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50' : 'bg-white/80 hover:bg-white border border-gray-200/50'} backdrop-blur-sm shadow-lg hover:shadow-xl`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full">
                    {product.trend}
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{product.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className={`${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white/70 border-gray-200/50'} backdrop-blur-xl p-8 rounded-3xl shadow-2xl border`}>
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <div className={`p-2 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <BarChart3 className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            📈 Products Trending Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
              <XAxis dataKey="name" stroke={isDark ? "#9ca3af" : "#6b7280"} />
              <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="products"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className={`${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white/70 border-gray-200/50'} backdrop-blur-xl p-8 rounded-3xl shadow-2xl border`}>
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <Package className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            🥧 Category Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
