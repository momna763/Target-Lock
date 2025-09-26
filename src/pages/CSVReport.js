import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Download, 
  FileBarChart2, 
  Calendar, 
  Filter,
  TrendingUp,
  Package,
  Database,
  CheckCircle,
  Settings
} from 'lucide-react';

const CSVReport = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    category: 'all',
    fields: {
      name: true,
      category: true,
      price: true,
      profitabilityScore: true,
      trendPercentage: true,
      stockCount: true,
      lastUpdated: true
    },
    sortBy: 'profitabilityScore',
    sortOrder: 'desc'
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  const availableFields = [
    { key: 'name', label: 'Product Name', description: 'Full product name' },
    { key: 'category', label: 'Category', description: 'Product category' },
    { key: 'price', label: 'Price', description: 'Current price in USD' },
    { key: 'profitabilityScore', label: 'Profitability Score', description: 'Profitability percentage (0-100)' },
    { key: 'trendPercentage', label: 'Trend Percentage', description: 'Market trend percentage' },
    { key: 'stockCount', label: 'Stock Count', description: 'Available inventory' },
    { key: 'lastUpdated', label: 'Last Updated', description: 'Last data update timestamp' }
  ];

  useEffect(() => {
    fetchReportData();
  }, [filters.category, filters.sortBy, filters.sortOrder]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        category: filters.category !== 'all' ? filters.category : '',
        limit: 1000 // CSV can handle large datasets
      });

      const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
      let products = await response.json();
      
      // Sort products based on selected criteria
      products = products.sort((a, b) => {
        const aVal = a[filters.sortBy] || 0;
        const bVal = b[filters.sortBy] || 0;
        return filters.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });

      const stats = {
        totalProducts: products.length,
        selectedFields: Object.keys(filters.fields).filter(key => filters.fields[key]).length,
        estimatedFileSize: calculateFileSize(products),
        categories: [...new Set(products.map(p => p.category))].length
      };

      setReportData({ products, stats });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFileSize = (products) => {
    const selectedFields = Object.keys(filters.fields).filter(key => filters.fields[key]);
    const avgRowSize = selectedFields.length * 15; // Rough estimate: 15 chars per field
    const totalSize = products.length * avgRowSize;
    return totalSize < 1024 ? `${totalSize} B` : 
           totalSize < 1024 * 1024 ? `${Math.round(totalSize / 1024)} KB` : 
           `${Math.round(totalSize / (1024 * 1024))} MB`;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFieldToggle = (fieldKey) => {
    setFilters(prev => ({
      ...prev,
      fields: { ...prev.fields, [fieldKey]: !prev.fields[fieldKey] }
    }));
  };

  const generateCSVContent = () => {
    if (!reportData) return '';

    const selectedFields = Object.keys(filters.fields).filter(key => filters.fields[key]);
    const headers = selectedFields.map(field => 
      availableFields.find(f => f.key === field)?.label || field
    );

    const rows = reportData.products.map(product => 
      selectedFields.map(field => {
        let value = product[field];
        if (field === 'price') value = product.price?.current || 0;
        if (field === 'stockCount') value = product.availability?.stockCount || 0;
        if (field === 'lastUpdated') value = product.lastUpdated ? new Date(product.lastUpdated).toLocaleDateString() : 'N/A';
        return `"${value || ''}"`;
      }).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  };

  const generateCSVReport = async () => {
    if (!reportData) return;

    setLoading(true);
    try {
      // Save report metadata to backend
      const reportPayload = {
        userId: currentUser.uid,
        type: 'csv-export',
        title: `CSV Product Export - ${new Date().toLocaleDateString()}`,
        data: {
          totalRecords: reportData.products.length,
          fields: Object.keys(filters.fields).filter(key => filters.fields[key]),
          filters: filters,
          generatedAt: new Date().toISOString()
        },
        filters: {
          dateRange: { start: new Date(Date.now() - 30*24*60*60*1000), end: new Date() },
          categories: filters.category !== 'all' ? [filters.category] : []
        }
      };

      // Save to backend (optional)
      fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportPayload)
      }).catch(err => console.log('Backend save failed:', err));

      // Generate and download actual CSV file
      const csvContent = generateCSVContent();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `target-lock-csv-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.innerHTML = '✅ CSV file downloaded successfully!';
      document.body.appendChild(successDiv);
      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 3000);

    } catch (error) {
      console.error('Error generating report:', error);
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.innerHTML = '❌ Failed to generate CSV. Please try again.';
      document.body.appendChild(errorDiv);
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/reports')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Reports
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileBarChart2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CSV Export Tool</h1>
                <p className="text-gray-600">Export product data in lightweight CSV format</p>
              </div>
            </div>
          </div>
          <button
            onClick={generateCSVReport}
            disabled={loading || !reportData || Object.values(filters.fields).every(v => !v)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            <Download className="w-5 h-5" />
            {loading ? 'Generating...' : 'Export CSV'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Data Filters</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="last7days">Last 7 days</option>
                    <option value="last30days">Last 30 days</option>
                    <option value="last90days">Last 90 days</option>
                    <option value="lastyear">Last year</option>
                    <option value="all">All time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="w-4 h-4 inline mr-1" />
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home">Home & Garden</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Sort Options</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="profitabilityScore">Profitability Score</option>
                    <option value="trendPercentage">Trend Percentage</option>
                    <option value="name">Product Name</option>
                    <option value="category">Category</option>
                    <option value="price">Price</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFilterChange('sortOrder', 'desc')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                        filters.sortOrder === 'desc'
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      High to Low
                    </button>
                    <button
                      onClick={() => handleFilterChange('sortOrder', 'asc')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                        filters.sortOrder === 'asc'
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      Low to High
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Info */}
            {reportData && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Export Info</h2>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Records:</span>
                    <span className="font-medium">{reportData.stats.totalProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Fields:</span>
                    <span className="font-medium">{reportData.stats.selectedFields}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. File Size:</span>
                    <span className="font-medium">{reportData.stats.estimatedFileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categories:</span>
                    <span className="font-medium">{reportData.stats.categories}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Field Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Select Fields to Export</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const allTrue = Object.fromEntries(Object.keys(filters.fields).map(key => [key, true]));
                      setFilters(prev => ({ ...prev, fields: allTrue }));
                    }}
                    className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => {
                      const allFalse = Object.fromEntries(Object.keys(filters.fields).map(key => [key, false]));
                      setFilters(prev => ({ ...prev, fields: allFalse }));
                    }}
                    className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFields.map((field) => (
                  <div key={field.key} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <input
                      type="checkbox"
                      id={field.key}
                      checked={filters.fields[field.key]}
                      onChange={() => handleFieldToggle(field.key)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <label htmlFor={field.key} className="block font-medium text-gray-900 cursor-pointer">
                        {field.label}
                        {filters.fields[field.key] && <CheckCircle className="w-4 h-4 text-green-500 inline ml-2" />}
                      </label>
                      <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Preview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">Data Preview</h3>
                <p className="text-blue-100 text-sm">Preview of your CSV export data</p>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading data...</span>
                  </div>
                ) : reportData && Object.values(filters.fields).some(v => v) ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          {Object.keys(filters.fields)
                            .filter(key => filters.fields[key])
                            .map(key => (
                              <th key={key} className="text-left py-3 px-4 font-semibold text-gray-700">
                                {availableFields.find(f => f.key === key)?.label || key}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.products.slice(0, 10).map((product, index) => (
                          <tr key={product._id || index} className="border-b border-gray-100 hover:bg-gray-50">
                            {Object.keys(filters.fields)
                              .filter(key => filters.fields[key])
                              .map(key => (
                                <td key={key} className="py-3 px-4 text-gray-900">
                                  {key === 'price' ? `$${product.price?.current || 'N/A'}` :
                                   key === 'stockCount' ? product.availability?.stockCount || 0 :
                                   key === 'lastUpdated' ? (product.lastUpdated ? new Date(product.lastUpdated).toLocaleDateString() : 'N/A') :
                                   key === 'profitabilityScore' ? `${product[key] || 0}%` :
                                   key === 'trendPercentage' ? `${product[key] || 0}%` :
                                   product[key] || 'N/A'}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {reportData.products.length > 10 && (
                      <div className="text-center py-4 text-gray-500">
                        ... and {reportData.products.length - 10} more records will be exported
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    {Object.values(filters.fields).every(v => !v) 
                      ? "Please select at least one field to export"
                      : "No data available. Please adjust your filters."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVReport;
