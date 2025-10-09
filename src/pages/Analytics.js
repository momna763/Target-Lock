import React, { useState, useEffect } from "react";
import { TrendingUp, PieChart as PieIcon, BarChart3, Smartphone, Laptop, Tablet, Watch } from "lucide-react";
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
    <div className="p-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Analytics & Insights
      </h2>
      <p className="text-gray-600 mb-6">
        Explore product trends, performance, and market distribution.
      </p>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`bg-gradient-to-br ${metric.color} rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1`}
          >
            <div className="mb-4">{metric.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">
              {metric.name}
            </h3>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profitability by Category Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Profitability by Category
          </h3>
          {analytics.loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.profitabilityTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
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
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics.categoryData.map((category, index) => (
              <div key={category.category} className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{borderLeftColor: COLORS[index % COLORS.length]}}>
                <div className="flex items-center justify-between mb-2">
                  {categoryIcons[category.category] || <PieIcon className="w-8 h-8 text-gray-500" />}
                  <span className="text-2xl font-bold text-gray-900">{category.value}</span>
                </div>
                <h4 className="font-semibold text-gray-800">{category.name}</h4>
                <p className="text-sm text-gray-600">Products available</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
