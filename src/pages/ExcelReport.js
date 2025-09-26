import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  Filter,
  TrendingUp,
  Package,
  DollarSign,
  BarChart3
} from 'lucide-react';

const ExcelReport = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    category: 'all',
    minProfitability: 0
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  useEffect(() => {
    fetchReportData();
  }, [filters]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        category: filters.category !== 'all' ? filters.category : '',
        minProfitability: filters.minProfitability
      });

      const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
      const products = await response.json();
      
      // Generate report statistics
      const stats = {
        totalProducts: products.length,
        avgProfitability: products.reduce((sum, p) => sum + (p.profitabilityScore || 0), 0) / products.length || 0,
        topCategory: getMostCommonCategory(products),
        totalValue: products.reduce((sum, p) => sum + (p.price?.current || 0), 0)
      };

      setReportData({ products, stats });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMostCommonCategory = (products) => {
    const categories = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b, 'N/A');
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const generateExcelContent = () => {
    if (!reportData) return '';

    const selectedFields = ['name', 'category', 'price', 'profitabilityScore', 'trendPercentage', 'stockCount'];
    const headers = ['Product Name', 'Category', 'Price (USD)', 'Profitability (%)', 'Trend (%)', 'Stock Count'];
    
    // Create CSV content (Excel can open CSV files)
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    reportData.products.forEach(product => {
      const row = [
        `"${product.name || ''}"`,
        `"${product.category || ''}"`,
        product.price?.current || 0,
        product.profitabilityScore || 0,
        product.trendPercentage || 0,
        product.availability?.stockCount || 0
      ];
      csvRows.push(row.join(','));
    });
    
    // Add summary statistics at the end
    csvRows.push('');
    csvRows.push('SUMMARY STATISTICS');
    csvRows.push(`Total Products,${reportData.stats.totalProducts}`);
    csvRows.push(`Average Profitability,${Math.round(reportData.stats.avgProfitability)}%`);
    csvRows.push(`Top Category,${reportData.stats.topCategory}`);
    csvRows.push(`Total Value,$${Math.round(reportData.stats.totalValue)}`);
    csvRows.push(`Generated At,${new Date().toLocaleString()}`);
    
    return csvRows.join('\n');
  };

  const generateExcelReport = async () => {
    if (!reportData) return;

    setLoading(true);
    try {
      // Save report metadata to backend
      const reportPayload = {
        userId: currentUser.uid,
        type: 'excel-export',
        title: `Excel Product Report - ${new Date().toLocaleDateString()}`,
        data: {
          totalRecords: reportData.products.length,
          statistics: reportData.stats,
          filters: filters,
          generatedAt: new Date().toISOString()
        },
        filters: {
          dateRange: { start: new Date(Date.now() - 30*24*60*60*1000), end: new Date() },
          categories: filters.category !== 'all' ? [filters.category] : [],
          minProfitability: filters.minProfitability
        }
      };

      // Save to backend (optional)
      fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportPayload)
      }).catch(err => console.log('Backend save failed:', err));

      // Generate and download actual Excel-compatible CSV file
      const excelContent = generateExcelContent();
      const blob = new Blob([excelContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `target-lock-excel-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.innerHTML = '✅ Excel report downloaded successfully!';
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
      errorDiv.innerHTML = '❌ Failed to generate report. Please try again.';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/reports')}
              className="flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Reports
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Excel Report Generator</h1>
                <p className="text-gray-600">Generate detailed product analysis in Excel format</p>
              </div>
            </div>
          </div>
          <button
            onClick={generateExcelReport}
            disabled={loading || !reportData}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            <Download className="w-5 h-5" />
            {loading ? 'Generating...' : 'Generate Excel'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="last7days">Last 7 days</option>
                    <option value="last30days">Last 30 days</option>
                    <option value="last90days">Last 90 days</option>
                    <option value="lastyear">Last year</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="w-4 h-4 inline mr-1" />
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home">Home & Garden</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>

                {/* Min Profitability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Min Profitability: {filters.minProfitability}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.minProfitability}
                    onChange={(e) => handleFilterChange('minProfitability', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Statistics Cards */}
            {reportData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData.stats.totalProducts}</p>
                    </div>
                    <Package className="w-8 h-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Profitability</p>
                      <p className="text-2xl font-bold text-gray-900">{Math.round(reportData.stats.avgProfitability)}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Top Category</p>
                      <p className="text-lg font-bold text-gray-900">{reportData.stats.topCategory}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900">${Math.round(reportData.stats.totalValue)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Data Preview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">Data Preview</h3>
                <p className="text-green-100 text-sm">Preview of data that will be included in your Excel report</p>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-3 text-gray-600">Loading report data...</span>
                  </div>
                ) : reportData ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Profitability</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.products.slice(0, 10).map((product, index) => (
                          <tr key={product._id || index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                            <td className="py-3 px-4 text-gray-600">{product.category}</td>
                            <td className="py-3 px-4 text-gray-900">${product.price?.current || 'N/A'}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                {product.profitabilityScore || 0}%
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                +{product.trendPercentage || 0}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {reportData.products.length > 10 && (
                      <div className="text-center py-4 text-gray-500">
                        ... and {reportData.products.length - 10} more products
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No data available. Please adjust your filters.
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

export default ExcelReport;
