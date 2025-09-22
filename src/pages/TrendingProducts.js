import React from "react";
import { TrendingUp } from "lucide-react";

const TrendingProducts = () => {
  const products = [
    {
      id: 1,
      name: "Smart Watch",
      category: "Wearables",
      trend: "+24%",
      profitability: "High",
    },
    {
      id: 2,
      name: "Wireless Earbuds",
      category: "Audio",
      trend: "+18%",
      profitability: "Medium",
    },
    {
      id: 3,
      name: "Standing Desk",
      category: "Furniture",
      trend: "+31%",
      profitability: "High",
    },
    {
      id: 4,
      name: "Gaming Mouse",
      category: "Electronics",
      trend: "+12%",
      profitability: "Low",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-indigo-600" />
        Trending Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-5"
          >
            {/* Image placeholder */}
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gray-400">Image</span>
            </div>

            {/* Product Info */}
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>

            {/* Badges */}
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {product.trend}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.profitability === "High"
                    ? "bg-indigo-100 text-indigo-700"
                    : product.profitability === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.profitability}
              </span>
            </div>

            {/* Button */}
            <button className="w-full py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;
