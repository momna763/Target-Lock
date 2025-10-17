import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { Heart, Eye, Package, Star, User, Trash2, Search } from "lucide-react";

const Favourites = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [favourites, setFavourites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFavourites, setFilteredFavourites] = useState([]);

  // Load favourites from localStorage
  useEffect(() => {
    const savedFavourites = localStorage.getItem('favouriteProducts');
    if (savedFavourites) {
      const favs = JSON.parse(savedFavourites);
      setFavourites(favs);
      setFilteredFavourites(favs);
    }
  }, []);

  // Filter favourites based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = favourites.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFavourites(filtered);
    } else {
      setFilteredFavourites(favourites);
    }
  }, [searchTerm, favourites]);

  const removeFavourite = (productId) => {
    const updatedFavourites = favourites.filter(fav => fav._id !== productId);
    setFavourites(updatedFavourites);
    localStorage.setItem('favouriteProducts', JSON.stringify(updatedFavourites));
  };

  const clearAllFavourites = () => {
    setFavourites([]);
    localStorage.removeItem('favouriteProducts');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Hero Header */}
      <div className={`relative overflow-hidden rounded-3xl mb-8 ${isDark ? 'bg-gradient-to-r from-pink-900 via-red-900 to-rose-900' : 'bg-gradient-to-r from-pink-600 via-red-600 to-rose-600'}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                My Favourites
              </h1>
              <p className="text-white/80 text-lg">Your saved products for quick access</p>
            </div>
            {favourites.length > 0 && (
              <button
                onClick={clearAllFavourites}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 border border-white/20"
              >
                <Trash2 className="w-5 h-5" />
                Clear All
              </button>
            )}
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Search Bar */}
      {favourites.length > 0 && (
        <div className="mb-8">
          <div className={`${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white/70 border-gray-200/50'} backdrop-blur-xl rounded-3xl shadow-2xl border p-6`}>
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search your favourite products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500/20' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500/20'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Favourites Grid */}
      {filteredFavourites.length === 0 ? (
        <div className={`${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white/70 border-gray-200/50'} backdrop-blur-xl rounded-3xl shadow-2xl border p-12 text-center`}>
          <div className={`p-8 rounded-3xl mb-6 inline-block ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
            <Heart className={`w-16 h-16 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          </div>
          <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {favourites.length === 0 ? 'No Favourites Yet' : 'No Results Found'}
          </h3>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {favourites.length === 0 
              ? 'Start adding products to your favourites by clicking the heart icon on any product'
              : 'Try adjusting your search terms'
            }
          </p>
          {favourites.length === 0 && (
            <button
              onClick={() => navigate('/search')}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Browse Products
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavourites.map((product) => (
            <div
              key={product._id}
              className={`group relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                isDark 
                  ? 'bg-gray-900/50 border border-gray-700/50 hover:bg-gray-800/50' 
                  : 'bg-white/80 border border-gray-200/50 hover:bg-white'
              } backdrop-blur-xl shadow-xl`}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                {(product.image || product.imageUrl) ? (
                  <img
                    src={product.image || product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
                  style={{display: (product.image || product.imageUrl) ? 'none' : 'flex'}}
                >
                  <Package className={`w-16 h-16 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>

                {/* Remove from Favourites Button */}
                <button
                  onClick={() => removeFavourite(product._id)}
                  className="absolute top-4 right-4 p-2 bg-red-500/90 hover:bg-red-600 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize backdrop-blur-sm ${
                    isDark ? 'bg-gray-900/80 text-gray-200' : 'bg-white/90 text-gray-700'
                  } shadow-lg`}>
                    {product.category}
                  </span>
                </div>

                {/* Rating Badge */}
                {product.ratingScore && (
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-white rounded-full text-sm font-medium shadow-lg">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{parseFloat(product.ratingScore).toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    PKR {typeof product.price === 'string' ? 
                      parseInt(product.price.replace(/,/g, '')).toLocaleString() : 
                      product.price?.toLocaleString() || 'N/A'
                    }
                  </span>
                </div>

                {/* Profitability Score */}
                {product.profitabilityScore && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Profitability
                      </span>
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {product.profitabilityScore}%
                      </span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${product.profitabilityScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Seller Info */}
                {product.sellerName && (
                  <div className="flex items-center gap-2 mb-4">
                    <User className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {product.sellerName}
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Eye className="w-5 h-5" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
