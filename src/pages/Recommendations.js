import React from "react";
import { Sparkles } from "lucide-react";

const Recommendations = () => {
  const recommendations = [
    {
      id: 1,
      name: "Portable Projector",
      category: "Gadgets",
      relevance: "High",
      reason: "Popular among startups",
    },
    {
      id: 2,
      name: "Noise Cancelling Headphones",
      category: "Audio",
      relevance: "Medium",
      reason: "Trending in remote work setups",
    },
    {
      id: 3,
      name: "Fitness Tracker",
      category: "Wearables",
      relevance: "High",
      reason: "Growing health awareness",
    },
    {
      id: 4,
      name: "Smart Home Hub",
      category: "Electronics",
      relevance: "Low",
      reason: "Emerging category in home automation",
    },
  ];

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
            key={rec.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-5"
          >
            {/* Image Placeholder */}
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gray-400">Image</span>
            </div>

            {/* Product Info */}
            <h3 className="text-lg font-semibold text-gray-800">{rec.name}</h3>
            <p className="text-sm text-gray-500">{rec.category}</p>

            {/* Reason */}
            <p className="text-xs text-gray-400 italic mt-2">
              {rec.reason}
            </p>

            {/* Badges */}
            <div className="flex gap-2 mt-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  rec.relevance === "High"
                    ? "bg-green-100 text-green-700"
                    : rec.relevance === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {rec.relevance} Relevance
              </span>
            </div>

            {/* Button */}
            <button className="w-full py-2 rounded-lg bg-pink-50 text-pink-600 font-medium hover:bg-pink-100 transition">
              View Recommendation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
