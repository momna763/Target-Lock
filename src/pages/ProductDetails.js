import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [product, setProduct] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header with Back Button */}
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden mb-8">
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
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-sm font-medium capitalize shadow-lg">
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
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
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
                  <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.sellerName && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <User className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Seller</p>
                            <p className="font-semibold text-gray-900">{product.sellerName}</p>
                          </div>
                        </div>
                      )}
                      
                      {product.review && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Star className="w-5 h-5 text-yellow-600 fill-current" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Reviews</p>
                            <p className="font-semibold text-gray-900">{product.review} reviews</p>
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
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-4 rounded-2xl border-2 transition transform hover:scale-105 ${
                      isLiked
                        ? "bg-red-50 border-red-200 text-red-600 shadow-lg"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 shadow-md hover:shadow-lg"
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
                  </button>
                  
                  <button className="p-4 rounded-2xl border-2 bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:shadow-lg transition transform hover:scale-105 shadow-md">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profitability Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8 text-center transform hover:scale-105 transition">
            <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl mb-4 inline-block">
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Profitability Score</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {product.profitabilityScore || 0}%
            </p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${product.profitabilityScore || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Trend Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8 text-center transform hover:scale-105 transition">
            <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl mb-4 inline-block">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Trend Growth</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              +{product.trendPercentage || 0}%
            </p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(product.trendPercentage || 0, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Source Info Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8 text-center transform hover:scale-105 transition">
            <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl mb-4 inline-block">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Data Source</h3>
            <p className="text-xl font-bold text-blue-600 mb-2">
              {product.source || "Daraz.pk"}
            </p>
            {product.scrapedAt && (
              <p className="text-sm text-gray-600">
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
