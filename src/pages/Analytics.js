import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { TrendingUp, PieChart as PieIcon, BarChart3, Smartphone, Laptop, Tablet, Watch, Package } from "lucide-react";
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
  Legend,
  BarChart,
  Bar,
} from "recharts";

const Analytics = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    avgProfitability: 0,
    topCategory: "N/A",
    categoryData: [],
    profitabilityTrends: [],
    loading: true
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch metrics
        const metricsResponse = await fetch(`${API_BASE_URL}/metrics`);
        const metricsData = await metricsResponse.json();

        // Fetch categories
        const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
        const categoriesData = await categoriesResponse.json();

        // Fetch all products for profitability analysis
        const productsResponse = await fetch(`${API_BASE_URL}/products?limit=200`);
        const productsData = await productsResponse.json();

        // Process category data for pie chart
        const categoryChartData = categoriesData.stats.map(cat => ({
          name: cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
          value: cat.count,
          category: cat._id
        }));

        // Process profitability trends by category
        const profitabilityByCategory = categoriesData.stats.map(cat => {
          const categoryProducts = productsData.filter(p => p.category === cat._id);
          const avgProfit = categoryProducts.length > 0 
            ? Math.round(categoryProducts.reduce((sum, p) => sum + (p.profitabilityScore || 0), 0) / categoryProducts.length)
            : 0;
          
          return {
            category: cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
            profitability: avgProfit,
            count: cat.count
          };
        });

        setAnalytics({
          totalProducts: metricsData.totalProducts,
          avgProfitability: metricsData.avgProfitability,
          topCategory: metricsData.topCategory,
          categoryData: categoryChartData,
          profitabilityTrends: profitabilityByCategory,
          loading: false
        });

      } catch (error) {
        console.error('Error fetching analytics:', error);
        setAnalytics(prev => ({ ...prev, loading: false }));
      }
    };

    fetchAnalytics();
  }, [API_BASE_URL]);

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

  const categoryIcons = {
    smartphones: <Smartphone className="w-8 h-8 text-indigo-500" />,
    laptops: <Laptop className="w-8 h-8 text-green-500" />,
    tablets: <Tablet className="w-8 h-8 text-orange-500" />,
    smartwatches: <Watch className="w-8 h-8 text-purple-500" />
  };

  const metrics = [
    {
      id: 1,
      name: "Total Products Tracked",
      value: analytics.loading ? "Loading..." : analytics.totalProducts.toLocaleString(),
      icon: <TrendingUp className="w-8 h-8 text-indigo-500" />,
      color: "from-indigo-50 to-indigo-100",
    },
    {
      id: 2,
      name: "Avg Profitability Score",
      value: analytics.loading ? "Loading..." : `${analytics.avgProfitability}%`,
      icon: <BarChart3 className="w-8 h-8 text-green-500" />,
      color: "from-green-50 to-green-100",
    },
    {
      id: 3,
      name: "Top Category",
      value: analytics.loading ? "Loading..." : analytics.topCategory.charAt(0).toUpperCase() + analytics.topCategory.slice(1),
      icon: categoryIcons[analytics.topCategory] || <PieIcon className="w-8 h-8 text-orange-500" />,
      color: "from-orange-50 to-orange-100",
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Hero Header */}
      <div className={`relative overflow-hidden rounded-3xl mb-8 ${isDark ? 'bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <BarChart3 className="w-8 h-8" />
                </div>
                Analytics & Insights
              </h1>
              <p className="text-white/80 text-lg">Explore product trends, performance, and market distribution</p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDark 
                ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50' 
                : `bg-gradient-to-br ${metric.color} border border-gray-200/50`
            } backdrop-blur-xl shadow-xl`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="mb-4">{metric.icon}</div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {metric.name}
              </h3>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profitability by Category Bar Chart */}
        <div className={`${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white/70 border-gray-200/50'} backdrop-blur-xl rounded-3xl shadow-2xl border p-8`}>
          <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <div className={`p-2 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <BarChart3 className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            Profitability by Category
          </h3>
          {analytics.loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.profitabilityTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="category" stroke={isDark ? "#9ca3af" : "#6b7280"} />
                <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'profitability' ? `${value}%` : value,
                    name === 'profitability' ? 'Avg Profitability' : 'Product Count'
                  ]}
                />
                <Bar dataKey="profitability" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Distribution Pie Chart */}
        <div className={`${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white/70 border-gray-200/50'} backdrop-blur-xl rounded-3xl shadow-2xl border p-8`}>
          <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <PieIcon className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            Category Distribution
          </h3>
          {analytics.loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category Details Cards */}
      {!analytics.loading && (
        <div className="mt-8">
          <div className={`${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white/70 border-gray-200/50'} backdrop-blur-xl rounded-3xl shadow-2xl border p-8`}>
            <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <div className={`p-2 rounded-xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                <Package className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
              Category Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analytics.categoryData.map((category, index) => (
                <div 
                  key={category.category} 
                  className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    isDark 
                      ? 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50' 
                      : 'bg-white/80 border border-gray-200/50 hover:bg-white'
                  } backdrop-blur-sm shadow-xl border-l-4`}
                  style={{borderLeftColor: COLORS[index % COLORS.length]}}
                >
                  <div className="flex items-center justify-between mb-4">
                    {categoryIcons[category.category] || <PieIcon className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />}
                    <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{category.value}</span>
                  </div>
                  <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{category.name}</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Products available</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
