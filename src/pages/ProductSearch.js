import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, Package } from "lucide-react";

const ProductSearch = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minProfitability, setMinProfitability] = useState("");
  const [categories, setCategories] = useState([]);

  // API base URL
  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        setProducts(data);
        setFilteredProducts(data);

        // extract unique categories
        const uniqueCategories = [
          ...new Set(data.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");

        // fallback mock data
        const mockProducts = [
          {
            _id: "1",
            name: "Smart LED Desk Lamp",
            category: "Electronics",
            profitabilityScore: 85,
            price: { current: 89.99, currency: "USD" },
          },
          {
            _id: "2",
            name: "Eco-Friendly Water Bottle",
            category: "Home & Kitchen",
            profitabilityScore: 90,
            price: { current: 34.99, currency: "USD" },
          },
          {
            _id: "3",
            name: "Yoga Mat Premium",
            category: "Sports & Outdoors",
            profitabilityScore: 92,
            price: { current: 79.99, currency: "USD" },
          },
          {
            _id: "4",
            name: "Smart Fitness Tracker",
            category: "Wearables",
            profitabilityScore: 82,
            price: { current: 299.99, currency: "USD" },
          },
        ];
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setCategories([
          "Electronics",
          "Home & Kitchen",
          "Sports & Outdoors",
          "Wearables",
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_BASE_URL]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Profitability filter
    if (minProfitability) {
      filtered = filtered.filter(
        (product) =>
          product.profitabilityScore >= parseInt(minProfitability, 10)
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, minProfitability]);

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setMinProfitability("");
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Search + Filters */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Product Search & Discovery
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="space-y-4"
        >
          {/* Search Input */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Profitability (%)
              </label>
              <input
                type="number"
                placeholder="70"
                value={minProfitability}
                onChange={(e) => setMinProfitability(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="0"
                max="100"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-5"
          >
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-sm text-gray-500 mb-2">
              ${product.price?.current || "N/A"}{" "}
              {product.price?.currency || "USD"}
            </p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-indigo-600">
                {product.profitabilityScore || 0}% profitability
              </span>
            </div>
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

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found matching your criteria.
          </p>
          <p className="text-gray-400 mt-2">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
