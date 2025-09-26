import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Eye } from "lucide-react";

const TrendingProducts = () => {
  const navigate = useNavigate();
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
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-indigo-600" />
        Trending Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-5"
          >
            {/* Image placeholder */}
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gray-400">📦</span>
            </div>

            {/* Product Info */}
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>

            {/* Badges */}
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                +{product.trendPercentage}%
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  getProfitabilityLevel(product.profitabilityScore) === "High"
                    ? "bg-indigo-100 text-indigo-700"
                    : getProfitabilityLevel(product.profitabilityScore) === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {getProfitabilityLevel(product.profitabilityScore)} Profitability
              </span>
            </div>

            {/* Button */}
            <button
              onClick={() => handleViewDetails(product._id)}
              className="w-full py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition flex items-center justify-center gap-2"
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
