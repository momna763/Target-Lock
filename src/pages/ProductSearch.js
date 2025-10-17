import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { Search, Filter, Eye, Package, Star, User } from "lucide-react";
import CategoryBrowser from "../components/CategoryBrowser";

const ProductSearch = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minProfitability, setMinProfitability] = useState("");
  const [sortBy, setSortBy] = useState("-scrapedAt");
  const [categories, setCategories] = useState([]);

  // API base URL
  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let url = `${API_BASE_URL}/products`;
        const params = new URLSearchParams();
        
        if (selectedCategory !== "all") {
          url = `${API_BASE_URL}/products/category/${selectedCategory}`;
        }
        
        params.append('sort', sortBy);
        params.append('limit', '100');
        if (minProfitability) params.append('minProfitability', minProfitability);
        
        const response = await fetch(`${url}?${params}`);
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
        
        // Note: Brand filtering removed as scraped data doesn't have consistent brand tags
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
  }, [API_BASE_URL, selectedCategory, sortBy, minProfitability]);

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
    
    // Brand filtering removed - not available in scraped data

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
    setSortBy("-scrapedAt");
  };
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchTerm(""); // Clear search when switching categories
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
    <div className={`min-h-screen space-y-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Hero Header */}
      <div className={`relative overflow-hidden rounded-3xl p-8 text-white ${isDark ? 'bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Search className="w-8 h-8" />
            </div>
            Product Search & Discovery
          </h1>
          <p className="text-white/80 text-lg">Browse 200+ products across 4 categories with real-time data from Daraz</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
      </div>
      
      {/* Category Browser */}
      <CategoryBrowser 
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      {/* Search + Filters */}
      <div className={`${isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-xl shadow-2xl rounded-3xl p-8 border`}>
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
              className={`flex-1 px-4 py-3 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="-scrapedAt">Latest Added</option>
                <option value="-profitabilityScore">Highest Profit</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Min Profitability (%)
              </label>
              <input
                type="number"
                placeholder="70"
                value={minProfitability}
                onChange={(e) => setMinProfitability(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                min="0"
                max="100"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
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
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className={`group backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 p-6 border ${
              isDark 
                ? 'bg-gray-900/80 border-gray-700/50 hover:bg-gray-800/80' 
                : 'bg-white/80 border-gray-200/50 hover:bg-white'
            }`}
          >
            <div className={`w-full h-40 rounded-2xl overflow-hidden mb-4 transition-all duration-300 ${
              isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-700 group-hover:from-indigo-900/50 group-hover:to-purple-900/50' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-indigo-100 group-hover:to-purple-100'
            }`}>
              {(product.image || product.imageUrl) ? (
                <img
                  src={product.image || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isDark 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-700 group-hover:from-indigo-900/50 group-hover:to-purple-900/50' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-indigo-100 group-hover:to-purple-100'
              }`} style={{display: (product.image || product.imageUrl) ? 'none' : 'flex'}}>
                <Package className={`w-16 h-16 transition-colors duration-300 ${
                  isDark 
                    ? 'text-gray-600 group-hover:text-indigo-400' 
                    : 'text-gray-400 group-hover:text-indigo-500'
                }`} />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className={`text-lg font-bold transition-colors duration-300 line-clamp-2 ${
                isDark 
                  ? 'text-white group-hover:text-indigo-400' 
                  : 'text-gray-900 group-hover:text-indigo-600'
              }`}>
                {product.name}
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  isDark 
                    ? 'bg-gray-800 text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {product.category}
                </span>
                <span className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.price ? 
                    `PKR ${typeof product.price === 'string' ? product.price.replace(/,/g, '') : product.price}` : 
                    product.price?.current ? 
                      `${product.price.currency} ${product.price.current.toLocaleString()}` : 
                      "Price N/A"
                  }
                </span>
              </div>
              
              {/* Rating and Seller Info */}
              {(product.ratingScore || product.sellerName) && (
                <div className={`flex items-center justify-between mb-2 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {product.ratingScore && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{product.ratingScore}</span>
                      {product.review && <span>({product.review})</span>}
                    </div>
                  )}
                  {product.sellerName && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="truncate max-w-24">{product.sellerName}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Profitability</span>
                <div className="flex items-center gap-2">
                  <div className={`w-16 h-2 rounded-full overflow-hidden ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(product.profitabilityScore || 0, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">
                    {product.profitabilityScore || 0}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(product._id)}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Eye className="w-4 h-4" />
                  Details
                </button>
                {product.productUrl && (
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-2xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    Daraz
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-lg ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No products found matching your criteria.
          </p>
          <p className={`mt-2 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
