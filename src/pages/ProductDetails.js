import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import {
  ArrowLeft,
  TrendingUp,
  Heart,
  Share2,
  Package,
  Star,
  User,
  ExternalLink,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [product, setProduct] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareMessage, setShareMessage] = useState("");

  // API base URL
  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        
        // Check if product is in favourites
        const favourites = JSON.parse(localStorage.getItem('favouriteProducts') || '[]');
        setIsLiked(favourites.some(fav => fav._id === data._id));
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");

        // Fallback mock product
        setProduct({
          _id: id,
          name: "Smart LED Desk Lamp",
          category: "Electronics",
          price: { current: 89.99, currency: "USD" },
          profitabilityScore: 85,
          trendPercentage: 12,
          description:
            "Voice-controlled smart lamp with adjustable brightness and color temperature",
          availability: { inStock: true, stockCount: 45 },
          tags: ["smart-home", "led", "voice-control"],
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, API_BASE_URL]);

  // Handle favourite toggle
  const handleFavouriteToggle = () => {
    const favourites = JSON.parse(localStorage.getItem('favouriteProducts') || '[]');
    
    if (isLiked) {
      // Remove from favourites
      const updatedFavourites = favourites.filter(fav => fav._id !== product._id);
      localStorage.setItem('favouriteProducts', JSON.stringify(updatedFavourites));
      setIsLiked(false);
    } else {
      // Add to favourites
      const updatedFavourites = [...favourites, product];
      localStorage.setItem('favouriteProducts', JSON.stringify(updatedFavourites));
      setIsLiked(true);
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this product: ${product.name} - PKR ${typeof product.price === 'string' ? parseInt(product.price.replace(/,/g, '')).toLocaleString() : product.price?.toLocaleString() || 'N/A'}`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setShareMessage("Product shared successfully!");
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.title} - ${shareData.text} - ${shareData.url}`);
        setShareMessage("Product link copied to clipboard!");
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setShareMessage(""), 3000);
    } catch (error) {
      console.error('Error sharing:', error);
      setShareMessage("Failed to share product");
      setTimeout(() => setShareMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-950 to-indigo-950' : 'bg-gradient-to-br from-gray-50 to-indigo-50'}`}>
      {/* Header with Back Button */}
      <div className={`${isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-xl shadow-sm border-b sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 transition font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className={`${isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden mb-8`}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {(product.image || product.imageUrl) ? (
                  <img
                    src={product.image || product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{display: (product.image || product.imageUrl) ? 'none' : 'flex'}}>
                  <Package className="w-24 h-24 text-gray-400" />
                </div>
              </div>
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm font-medium capitalize shadow-lg ${isDark ? 'bg-gray-800/90 text-gray-200' : 'bg-white/90 text-gray-700'}`}>
                  {product.category}
                </span>
              </div>
              
              {/* Rating Badge */}
              {product.ratingScore && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 px-3 py-2 bg-yellow-500/90 backdrop-blur-sm text-white rounded-full text-sm font-medium shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{parseFloat(product.ratingScore).toFixed(1)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12">
              <div className="space-y-6">
                {/* Title and Price */}
                <div>
                  <h1 className={`text-3xl lg:text-4xl font-bold mb-4 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {product.price ? 
                        `PKR ${typeof product.price === 'string' ? parseInt(product.price.replace(/,/g, '')).toLocaleString() : product.price.toLocaleString()}` : 
                        product.price?.current ? 
                          `${product.price.currency} ${product.price.current.toLocaleString()}` : 
                          "Price N/A"
                      }
                    </span>
                  </div>
                </div>

                {/* Seller and Reviews */}
                {(product.sellerName || product.review) && (
                  <div className={`rounded-2xl p-6 ${isDark ? 'bg-gradient-to-r from-gray-800/50 to-indigo-900/50' : 'bg-gradient-to-r from-gray-50 to-indigo-50'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.sellerName && (
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isDark ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                            <User className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Seller</p>
                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.sellerName}</p>
                          </div>
                        </div>
                      )}
                      
                      {product.review && (
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isDark ? 'bg-yellow-900/50' : 'bg-yellow-100'}`}>
                            <Star className={`w-5 h-5 fill-current ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Reviews</p>
                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.review} reviews</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {(product.productUrl || product.metadata?.url) && (
                    <a
                      href={product.productUrl || product.metadata?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <ExternalLink className="w-5 h-5" />
                      View on Daraz
                    </a>
                  )}
                  
                  <button
                    onClick={handleFavouriteToggle}
                    className={`p-4 rounded-2xl border-2 transition transform hover:scale-105 ${
                      isLiked
                        ? "bg-red-50 border-red-200 text-red-600 shadow-lg"
                        : isDark 
                          ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-red-900/20 hover:border-red-500 hover:text-red-400 shadow-md hover:shadow-lg"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 shadow-md hover:shadow-lg"
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
                  </button>
                  
                  <button 
                    onClick={handleShare}
                    className={`p-4 rounded-2xl border-2 transition transform hover:scale-105 shadow-md hover:shadow-lg ${
                      isDark 
                        ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Message */}
        {shareMessage && (
          <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
            {shareMessage}
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profitability Card */}
          <div className={`${isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-xl rounded-3xl shadow-xl border p-8 text-center transform hover:scale-105 transition`}>
            <div className={`p-4 rounded-2xl mb-4 inline-block ${isDark ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50' : 'bg-gradient-to-r from-indigo-100 to-purple-100'}`}>
              <TrendingUp className={`w-8 h-8 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Profitability Score</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {product.profitabilityScore || 0}%
            </p>
            <div className={`mt-4 w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${product.profitabilityScore || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Trend Card */}
          <div className={`${isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-xl rounded-3xl shadow-xl border p-8 text-center transform hover:scale-105 transition`}>
            <div className={`p-4 rounded-2xl mb-4 inline-block ${isDark ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50' : 'bg-gradient-to-r from-green-100 to-emerald-100'}`}>
              <TrendingUp className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Trend Growth</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              +{product.trendPercentage || 0}%
            </p>
            <div className={`mt-4 w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(product.trendPercentage || 0, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Source Info Card */}
          <div className={`${isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-xl rounded-3xl shadow-xl border p-8 text-center transform hover:scale-105 transition`}>
            <div className={`p-4 rounded-2xl mb-4 inline-block ${isDark ? 'bg-gradient-to-r from-blue-900/50 to-cyan-900/50' : 'bg-gradient-to-r from-blue-100 to-cyan-100'}`}>
              <Package className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Data Source</h3>
            <p className={`text-xl font-bold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {product.source || "Daraz.pk"}
            </p>
            {product.scrapedAt && (
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Updated: {new Date(product.scrapedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
