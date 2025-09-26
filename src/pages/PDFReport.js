import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp, Package, Eye } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PDFReport = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    category: 'all',
    includeCharts: true,
    includeSummary: true
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
        limit: 20
      });

      const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
      const products = await response.json();
      
      // Generate comprehensive report data
      const stats = {
        totalProducts: products.length,
        avgProfitability: products.reduce((sum, p) => sum + (p.profitabilityScore || 0), 0) / products.length || 0,
        topPerformers: products.sort((a, b) => (b.profitabilityScore || 0) - (a.profitabilityScore || 0)).slice(0, 5),
        categoryBreakdown: getCategoryBreakdown(products),
        trendAnalysis: getTrendAnalysis(products)
      };

      setReportData({ products, stats });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBreakdown = (products) => {
    const breakdown = products.reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { count: 0, totalValue: 0, avgProfitability: 0 };
      }
      acc[category].count++;
      acc[category].totalValue += product.price?.current || 0;
      acc[category].avgProfitability += product.profitabilityScore || 0;
      return acc;
    }, {});

    // Calculate averages
    Object.keys(breakdown).forEach(category => {
      breakdown[category].avgProfitability = breakdown[category].avgProfitability / breakdown[category].count;
    });

    return breakdown;
  };

  const getTrendAnalysis = (products) => {
    const trending = products.filter(p => (p.trendPercentage || 0) > 10);
    const declining = products.filter(p => (p.trendPercentage || 0) < -5);
    const stable = products.filter(p => Math.abs(p.trendPercentage || 0) <= 10);

    return {
      trending: trending.length,
      declining: declining.length,
      stable: stable.length,
      avgTrend: products.reduce((sum, p) => sum + (p.trendPercentage || 0), 0) / products.length || 0
    };
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const generatePDFReport = async () => {
    if (!reportData) return;

    setLoading(true);
    try {
      // Save report metadata to backend
      const reportPayload = {
        userId: currentUser.uid,
        type: 'pdf-report',
        title: `PDF Product Analysis Report - ${new Date().toLocaleDateString()}`,
        data: {
          totalRecords: reportData.products.length,
          statistics: reportData.stats,
          filters: filters,
          generatedAt: new Date().toISOString(),
          summary: generateSummaryText()
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

      // Generate actual PDF using jsPDF
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      
      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(79, 70, 229); // Indigo color
      pdf.text('TARGET LOCK', pageWidth / 2, 30, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('Product Analysis Report', pageWidth / 2, 45, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, 55, { align: 'center' });
      
      // Line separator
      pdf.setDrawColor(79, 70, 229);
      pdf.setLineWidth(1);
      pdf.line(20, 65, pageWidth - 20, 65);
      
      let yPosition = 80;
      
      // Executive Summary (if enabled)
      if (filters.includeSummary) {
        pdf.setFontSize(14);
        pdf.setTextColor(79, 70, 229);
        pdf.text('Executive Summary', 20, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        const summaryText = generateSummaryText();
        const splitSummary = pdf.splitTextToSize(summaryText, pageWidth - 40);
        pdf.text(splitSummary, 20, yPosition);
        yPosition += splitSummary.length * 5 + 15;
      }
      
      // Key Statistics
      pdf.setFontSize(14);
      pdf.setTextColor(79, 70, 229);
      pdf.text('Key Statistics', 20, yPosition);
      yPosition += 15;
      
      const stats = [
        ['Total Products', reportData.stats.totalProducts],
        ['Average Profitability', `${Math.round(reportData.stats.avgProfitability)}%`],
        ['Trending Products', reportData.stats.trendAnalysis.trending],
        ['Categories', Object.keys(reportData.stats.categoryBreakdown).length]
      ];
      
      pdf.autoTable({
        startY: yPosition,
        head: [['Metric', 'Value']],
        body: stats,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
        margin: { left: 20, right: 20 }
      });
      
      yPosition = pdf.lastAutoTable.finalY + 20;
      
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 30;
      }
      
      // Top Performing Products
      pdf.setFontSize(14);
      pdf.setTextColor(79, 70, 229);
      pdf.text('Top Performing Products', 20, yPosition);
      yPosition += 10;
      
      const topProductsData = reportData.stats.topPerformers.slice(0, 10).map((product, index) => [
        index + 1,
        product.name.length > 25 ? product.name.substring(0, 25) + '...' : product.name,
        product.category,
        `${product.profitabilityScore || 0}%`,
        `$${product.price?.current || 'N/A'}`
      ]);
      
      pdf.autoTable({
        startY: yPosition,
        head: [['Rank', 'Product Name', 'Category', 'Profitability', 'Price']],
        body: topProductsData,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
        margin: { left: 20, right: 20 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 60 },
          2: { cellWidth: 40 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 }
        }
      });
      
      // Footer
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Target Lock AI Product Hunter Platform', pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
      }
      
      // Save the PDF
      pdf.save(`target-lock-pdf-report-${new Date().toISOString().split('T')[0]}.pdf`);

      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.innerHTML = '✅ PDF report downloaded successfully!';
      document.body.appendChild(successDiv);
      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 4000);

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

  const generateSummaryText = () => {
    if (!reportData) return '';
    
    const { stats } = reportData;
    return `This report analyzes ${stats.totalProducts} products with an average profitability score of ${Math.round(stats.avgProfitability)}%. 
    The analysis shows ${stats.trendAnalysis.trending} trending products, ${stats.trendAnalysis.stable} stable products, and ${stats.trendAnalysis.declining} declining products. 
    Top performing category shows strong market potential with consistent growth patterns.`;
  };

  const generatePDFContent = () => {
    if (!reportData) return '';
    
    return `TARGET LOCK - PRODUCT ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

EXECUTIVE SUMMARY
${generateSummaryText()}

STATISTICS
Total Products: ${reportData.stats.totalProducts}
Average Profitability: ${Math.round(reportData.stats.avgProfitability)}%
Trending Products: ${reportData.stats.trendAnalysis.trending}
Stable Products: ${reportData.stats.trendAnalysis.stable}

TOP PERFORMERS
${reportData.stats.topPerformers.map((product, index) => 
  `${index + 1}. ${product.name} - ${product.profitabilityScore}% profitability`
).join('\n')}

CATEGORY BREAKDOWN
${Object.entries(reportData.stats.categoryBreakdown).map(([category, data]) => 
  `${category}: ${data.count} products, Avg Profitability: ${Math.round(data.avgProfitability)}%`
).join('\n')}
`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/reports')}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Reports
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PDF Report Generator</h1>
                <p className="text-gray-600">Generate professional PDF analysis reports</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={generatePDFReport}
              disabled={loading || !reportData}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <Download className="w-5 h-5" />
              {loading ? 'Generating...' : 'Generate PDF'}
            </button>
          </div>
        </div>

        {!previewMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Configuration Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Report Settings</h2>
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                      Category Focus
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Home">Home & Garden</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Fashion">Fashion</option>
                    </select>
                  </div>

                  {/* Include Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Include in Report</label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.includeCharts}
                          onChange={(e) => handleFilterChange('includeCharts', e.target.checked)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Charts & Graphs</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.includeSummary}
                          onChange={(e) => handleFilterChange('includeSummary', e.target.checked)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Executive Summary</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Report Overview */}
              {reportData && (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Products</p>
                          <p className="text-2xl font-bold text-gray-900">{reportData.stats.totalProducts}</p>
                        </div>
                        <Package className="w-8 h-8 text-red-500" />
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

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Trending</p>
                          <p className="text-2xl font-bold text-gray-900">{reportData.stats.trendAnalysis.trending}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Categories</p>
                          <p className="text-2xl font-bold text-gray-900">{Object.keys(reportData.stats.categoryBreakdown).length}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-yellow-500" />
                      </div>
                    </div>
                  </div>

                  {/* Top Performers */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
                    <div className="space-y-3">
                      {reportData.stats.topPerformers.map((product, index) => (
                        <div key={product._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">{product.profitabilityScore || 0}%</p>
                            <p className="text-sm text-gray-500">Profitability</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(reportData.stats.categoryBreakdown).map(([category, data]) => (
                        <div key={category} className="p-4 border border-gray-200 rounded-lg">
                          <h4 className="font-medium text-gray-900">{category}</h4>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600">{data.count} products</p>
                            <p className="text-sm text-gray-600">Avg Profitability: {Math.round(data.avgProfitability)}%</p>
                            <p className="text-sm text-gray-600">Total Value: ${Math.round(data.totalValue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          /* PDF Preview Mode */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Printer className="w-8 h-8" />
                  <div>
                    <h1 className="text-2xl font-bold">Target Lock Product Analysis Report</h1>
                    <p className="text-red-100">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {filters.includeSummary && reportData && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Executive Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{generateSummaryText()}</p>
                  </div>
                )}

                {reportData && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Key Statistics</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-600">{reportData.stats.totalProducts}</p>
                          <p className="text-sm text-gray-600">Total Products</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{Math.round(reportData.stats.avgProfitability)}%</p>
                          <p className="text-sm text-gray-600">Avg Profitability</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{reportData.stats.trendAnalysis.trending}</p>
                          <p className="text-sm text-gray-600">Trending</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">{Object.keys(reportData.stats.categoryBreakdown).length}</p>
                          <p className="text-sm text-gray-600">Categories</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing Products</h2>
                      <div className="space-y-2">
                        {reportData.stats.topPerformers.map((product, index) => (
                          <div key={product._id || index} className="flex justify-between items-center p-3 border-b border-gray-200">
                            <span className="font-medium">{index + 1}. {product.name}</span>
                            <span className="text-red-600 font-bold">{product.profitabilityScore || 0}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFReport;
