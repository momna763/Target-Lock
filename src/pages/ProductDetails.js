import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  ShoppingCart,
  Heart,
  Share2,
  Package,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Consistent API base URL
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

        // 🔹 Fallback mock product
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
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image Placeholder */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm">
            Product image placeholder
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{product.category}</p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-indigo-600">
                ${product.price?.current || "N/A"}
              </span>
              <span className="text-sm text-gray-500">
                {product.price?.currency || "USD"}
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.availability?.inStock
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.availability?.inStock
                  ? `In Stock (${product.availability?.stockCount || 0})`
                  : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-medium transition flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-xl border-2 transition ${
                isLiked
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button className="p-3 rounded-xl border-2 bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {product.profitabilityScore || 0}%
                </div>
                <div className="text-sm text-gray-600">Profitability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                  <TrendingUp className="w-5 h-5" />
                  {product.trendPercentage || 0}%
                </div>
                <div className="text-sm text-gray-600">Trend</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["overview", "specifications", "tags"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Product Overview</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {product.description || "No description available"}
              </p>
              {product.tags?.length > 0 && (
                <>
                  <h4 className="font-semibold mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="text-gray-900">{product.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Price:</span>
                  <span className="text-gray-900">
                    ${product.price?.current || "N/A"}{" "}
                    {product.price?.currency || "USD"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">
                    Profitability:
                  </span>
                  <span className="text-gray-900">
                    {product.profitabilityScore || 0}%
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Trend:</span>
                  <span className="text-gray-900">
                    +{product.trendPercentage || 0}%
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Stock:</span>
                  <span className="text-gray-900">
                    {product.availability?.stockCount || 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tags" && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Product Tags</h3>
              {product.tags?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tags available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
