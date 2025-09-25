import React, { useState, useEffect } from "react";
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
      <div className="p-6 bg-gray-950 min-h-screen text-white">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-950 min-h-screen text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleRefresh}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
        <ErrorMessage />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Row 1: Metrics + Trending Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-800 hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <Package className="w-7 h-7 text-indigo-400" />
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-2xl font-bold">{metrics.totalProducts.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-800 hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <TrendingUp className="w-7 h-7 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Avg Profitability</p>
                <p className="text-2xl font-bold">{metrics.avgProfitability}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-800 hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <Users className="w-7 h-7 text-pink-400" />
              <div>
                <p className="text-gray-400 text-sm">Trending This Week</p>
                <p className="text-2xl font-bold">{metrics.trendingThisWeek}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-800 hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <ShoppingBag className="w-7 h-7 text-orange-400" />
              <div>
                <p className="text-gray-400 text-sm">Top Category</p>
                <p className="text-2xl font-bold">{metrics.topCategory}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Products Horizontal Cards */}
        <div className="flex space-x-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
          {trendingProducts.map((product, i) => (
            <div
              key={i}
              className="min-w-[200px] bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl p-5 rounded-2xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-gray-800"
            >
              <div className="h-24 bg-gray-800 rounded-xl mb-3 flex items-center justify-center text-gray-500">
                📦
              </div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-400 text-sm">{product.category}</p>
              <span className="text-green-400 font-bold">{product.trend}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-gray-900/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">
            📈 Products Trending Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
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
        <div className="bg-gray-900/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">🥧 Category Distribution</h2>
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
}
