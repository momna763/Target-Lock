import React, { useState, useEffect } from 'react';
import { Smartphone, Laptop, Tablet, Watch, Package } from 'lucide-react';

const CategoryBrowser = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // Category icons mapping
  const categoryIcons = {
    smartphones: Smartphone,
    laptops: Laptop,
    tablets: Tablet,
    smartwatches: Watch,
  };

  // Category display names
  const categoryNames = {
    smartphones: 'Smartphones',
    laptops: 'Laptops', 
    tablets: 'Tablets',
    smartwatches: 'Smartwatches',
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        setCategories(data.stats || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback categories
        setCategories([
          { _id: 'smartphones', count: 50 },
          { _id: 'laptops', count: 50 },
          { _id: 'tablets', count: 50 },
          { _id: 'smartwatches', count: 50 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-gray-200/50 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Browse by Category
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* All Categories Option */}
        <button
          onClick={() => onCategorySelect('all')}
          className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg scale-105'
              : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:shadow-md hover:scale-102'
          }`}
        >
          <div className="flex flex-col items-center space-y-3">
            <Package className="w-8 h-8" />
            <span className="font-semibold">All Products</span>
            <span className="text-sm opacity-80">
              {categories.reduce((sum, cat) => sum + cat.count, 0)} items
            </span>
          </div>
        </button>

        {/* Individual Categories */}
        {categories.map((category) => {
          const IconComponent = categoryIcons[category._id] || Package;
          const displayName = categoryNames[category._id] || category._id;
          
          return (
            <button
              key={category._id}
              onClick={() => onCategorySelect(category._id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedCategory === category._id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg scale-105'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:shadow-md hover:scale-102'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <IconComponent className="w-8 h-8" />
                <span className="font-semibold">{displayName}</span>
                <span className="text-sm opacity-80">
                  {category.count} items
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBrowser;
