import React from "react";
import { Search } from "lucide-react";

const ProductSearch = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Search Section */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Product Search & Discovery
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition">
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((id) => (
          <div
            key={id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-5"
          >
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gray-400">Image</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Product #{id}
            </h3>
            <p className="text-sm text-gray-500">Category: Example</p>
            <p className="text-sm text-gray-500 mb-3">Price: $99</p>
            <button className="w-full py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSearch;
