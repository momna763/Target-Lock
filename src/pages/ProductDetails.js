import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Star, ShoppingCart, Heart, Share2, Eye } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock product data - in real app, fetch from API
  useEffect(() => {
    const mockProduct = {
      id: id || 1,
      name: 'Smart Fitness Watch Pro',
      category: 'Wearables',
      price: 299.99,
      currency: 'USD',
      originalPrice: 399.99,
      rating: 4.5,
      reviewCount: 1247,
      inStock: true,
      stockCount: 45,
      profitabilityScore: 87,
      trendPercentage: 15.3,
      trendDirection: 'up',
      description: 'Advanced fitness tracking smartwatch with GPS, heart rate monitoring, and 7-day battery life. Perfect for fitness enthusiasts and professionals.',
      features: [
        'GPS Tracking',
        'Heart Rate Monitor',
        'Sleep Tracking',
        '7-Day Battery Life',
        'Water Resistant (50m)',
        'Smart Notifications'
      ],
      specifications: {
        'Display': '1.4" AMOLED',
        'Battery': '300mAh',
        'Connectivity': 'Bluetooth 5.0',
        'Sensors': 'GPS, Heart Rate, Accelerometer',
        'Compatibility': 'iOS 12+, Android 8+'
      },
      images: [
        '/api/placeholder/400/400',
        '/api/placeholder/400/400',
        '/api/placeholder/400/400',
        '/api/placeholder/400/400'
      ],
      reviews: [
        {
          id: 1,
          user: 'John D.',
          rating: 5,
          date: '2024-01-15',
          comment: 'Excellent build quality and accurate tracking!'
        },
        {
          id: 2,
          user: 'Sarah M.',
          rating: 4,
          date: '2024-01-10',
          comment: 'Great battery life, could have more watch faces.'
        }
      ]
    };
    setProduct(mockProduct);
  }, [id]);

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading product...</h2>
        </div>
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
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(1).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 2}`}
                className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
              />
            ))}
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
                ${product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.inStock ? `In Stock (${product.stockCount})` : 'Out of Stock'}
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
              className={`p-3 rounded-xl border-2 transition ${isLiked ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
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
                <div className="text-2xl font-bold text-indigo-600">{product.profitabilityScore}%</div>
                <div className="text-sm text-gray-600">Profitability</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${product.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {product.trendDirection === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  {product.trendPercentage}%
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
            {['overview', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition ${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Product Overview</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
              <h4 className="font-semibold mb-2">Key Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{review.user}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{review.date}</p>
                    <p className="text-gray-700 mt-1">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
