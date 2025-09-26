import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Eye } from "lucide-react";

const Recommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fixed: Always points to /api correctly
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // Fetch all products and generate recommendations
  useEffect(() => {
    const generateRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products for recommendations");
        }
        const products = await response.json();

        // Generate recommendations based on profitability and trends
        const scoredProducts = products.map((product) => {
          let score = 0;
          let reason = "";

          // High profitability products get higher scores
          if (product.profitabilityScore >= 85) {
            score += 40;
            reason = "High profitability potential";
          } else if (product.profitabilityScore >= 75) {
            score += 25;
            reason = "Good profitability potential";
          }

          // Trending products get bonus points
          if (product.trendPercentage >= 15) {
            score += 30;
            reason += reason ? " and trending up" : "Strong upward trend";
          } else if (product.trendPercentage >= 10) {
            score += 20;
            reason += reason ? " with positive trend" : "Positive trend";
          }

          // In-stock products get preference
          if (product.availability?.inStock) {
            score += 10;
            reason += reason ? ", in stock" : "In stock";
          }

          return {
            ...product,
            recommendationScore: score,
            reason: reason || "Available product",
          };
        });

        // Sort by recommendation score and take top 8
        const topRecommendations = scoredProducts
          .sort((a, b) => b.recommendationScore - a.recommendationScore)
          .slice(0, 8);

        setRecommendations(topRecommendations);
      } catch (err) {
        console.error("Error generating recommendations:", err);
        setError("Failed to load recommendations");

        // Fallback to mock data
        setRecommendations([
          {
            _id: "1",
            name: "Smart LED Desk Lamp",
            category: "Electronics",
            profitabilityScore: 85,
            trendPercentage: 12,
            reason: "High profitability potential and trending up",
            recommendationScore: 70,
          },
          {
            _id: "2",
            name: "Yoga Mat Premium",
            category: "Sports & Outdoors",
            profitabilityScore: 92,
            trendPercentage: 22,
            reason: "High profitability potential and strong upward trend",
            recommendationScore: 85,
          },
          {
            _id: "3",
            name: "Eco-Friendly Water Bottle",
            category: "Home & Kitchen",
            profitabilityScore: 90,
            trendPercentage: 15,
            reason: "High profitability potential and positive trend",
            recommendationScore: 75,
          },
          {
            _id: "4",
            name: "Smart Fitness Tracker",
            category: "Wearables",
            profitabilityScore: 82,
            trendPercentage: 10,
            reason: "Good profitability potential with positive trend",
            recommendationScore: 60,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, []);

  const handleViewRecommendation = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getRelevanceLevel = (score) => {
    if (score >= 70) return "High";
    if (score >= 50) return "Medium";
    return "Low";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <span className="ml-2">Generating recommendations...</span>
        </div>
      </div>
    );
  }

  if (error) {
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
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-pink-500" />
        Recommendations
      </h2>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((rec) => (
          <div
            key={rec._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-5"
          >
            {/* Image Placeholder */}
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gray-400">📦</span>
            </div>

            {/* Product Info */}
            <h3 className="text-lg font-semibold text-gray-800">{rec.name}</h3>
            <p className="text-sm text-gray-500">{rec.category}</p>

            {/* Reason */}
            <p className="text-xs text-gray-400 italic mt-2">{rec.reason}</p>

            {/* Badges */}
            <div className="flex gap-2 mt-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  getRelevanceLevel(rec.recommendationScore) === "High"
                    ? "bg-green-100 text-green-700"
                    : getRelevanceLevel(rec.recommendationScore) === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {getRelevanceLevel(rec.recommendationScore)} Relevance
              </span>
            </div>

            {/* Button */}
            <button
              onClick={() => handleViewRecommendation(rec._id)}
              className="w-full py-2 rounded-lg bg-pink-50 text-pink-600 font-medium hover:bg-pink-100 transition flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Recommendation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
