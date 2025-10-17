import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { TrendingUp, Eye } from "lucide-react";

const TrendingProducts = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ API base URL (make sure you have REACT_APP_API_URL in your .env)
  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // Fetch trending products from API
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/products/trending`);

        if (!response.ok) {
          // 👀 log the actual status for debugging
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // ✅ Ensure it's always an array (prevents rendering errors)
        if (Array.isArray(data)) {
          setTrendingProducts(data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching trending products:", err);
        setError("Failed to load trending products");

        // ✅ Optional: fallback mock data
        setTrendingProducts([
          {
            _id: "1",
            name: "Smart LED Desk Lamp",
            category: "Electronics",
            profitabilityScore: 85,
            trendPercentage: 12,
          },
          {
            _id: "2",
            name: "Eco-Friendly Water Bottle",
            category: "Home & Kitchen",
            profitabilityScore: 90,
            trendPercentage: 15,
          },
          {
            _id: "3",
            name: "Smart Fitness Tracker",
            category: "Wearables",
            profitabilityScore: 82,
            trendPercentage: 10,
          },
          {
            _id: "4",
            name: "Yoga Mat Premium",
            category: "Sports & Outdoors",
            profitabilityScore: 92,
            trendPercentage: 22,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, [API_BASE_URL]); // 👈 dependency added

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getProfitabilityLevel = (score) => {
    if (score >= 85) return "High";
    if (score >= 70) return "Medium";
    return "Low";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2">Loading trending products...</span>
        </div>
      </div>
    );
  }

  if (error && trendingProducts.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Hero Header */}
      <div className={`relative overflow-hidden rounded-3xl mb-8 ${isDark ? 'bg-gradient-to-r from-orange-900 via-red-900 to-pink-900' : 'bg-gradient-to-r from-orange-600 via-red-600 to-pink-600'}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <TrendingUp className="w-8 h-8" />
                </div>
                Trending Products
              </h1>
              <p className="text-white/80 text-lg">Discover the hottest products with highest growth potential</p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingProducts.map((product) => (
          <div
            key={product._id}
            className={`rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 p-6 border ${
              isDark 
                ? 'bg-gray-900/80 border-gray-700/50 hover:bg-gray-800/80' 
                : 'bg-white/80 border-gray-200/50 hover:bg-white'
            } backdrop-blur-xl`}
          >
            {/* Product Image */}
            <div className={`w-full h-32 rounded-2xl overflow-hidden mb-4 ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              {(product.image || product.imageUrl) ? (
                <img
                  src={product.image || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full rounded-2xl flex items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`} style={{display: (product.image || product.imageUrl) ? 'none' : 'flex'}}>
                <span className={`text-2xl ${
                  isDark ? 'text-gray-600' : 'text-gray-400'
                }`}>📱</span>
              </div>
            </div>

            {/* Product Info */}
            <h3 className={`text-lg font-semibold line-clamp-2 mb-2 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              {product.name}
            </h3>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>{product.category}</p>
              {product.price?.current && (
                <span className={`text-sm font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.price.currency} {product.price.current.toLocaleString()}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isDark 
                  ? 'bg-green-900/50 text-green-400' 
                  : 'bg-green-100 text-green-700'
              }`}>
                +{product.trendPercentage}% trend
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  getProfitabilityLevel(product.profitabilityScore) === "High"
                    ? isDark ? "bg-indigo-900/50 text-indigo-400" : "bg-indigo-100 text-indigo-700"
                    : getProfitabilityLevel(product.profitabilityScore) === "Medium"
                    ? isDark ? "bg-yellow-900/50 text-yellow-400" : "bg-yellow-100 text-yellow-700"
                    : isDark ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-700"
                }`}
              >
                {product.profitabilityScore}% profit
              </span>
              {product.tags?.[0] && product.tags[0] !== 'Mobile' && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isDark 
                    ? 'bg-gray-800 text-gray-300' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {product.tags[0]}
                </span>
              )}
            </div>

            {/* Button */}
            <button
              onClick={() => handleViewDetails(product._id)}
              className={`w-full py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 ${
                isDark 
                  ? 'bg-indigo-900/50 text-indigo-400 hover:bg-indigo-800/50' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;
