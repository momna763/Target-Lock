import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  ShoppingCart,
  Target,
  Package,
  BarChart3,
  PieChart,
  Activity,
  Users,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  ShoppingCart,
  Target,
  Package,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Search,
  Sparkles,
  FileText,
  Bot,
  Star
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

// Target-Lock specific Dashboard Data
const quickStats = [
  { title: "Total Products", value: "1,247", change: "+18%", trend: "up", icon: Package },
  { title: "Avg Profitability", value: "84%", change: "+5%", trend: "up", icon: DollarSign },
  { title: "Trending Now", value: "156", change: "+12%", trend: "up", icon: TrendingUp },
  { title: "Markets Covered", value: "24", change: "+3", trend: "up", icon: Target }
];

const recentProducts = [
  { id: 1, name: "Smart Fitness Watch Pro", category: "Wearables", profitability: 92, trend: "+24%", status: "hot" },
  { id: 2, name: "Wireless Noise-Cancelling Headphones", category: "Audio", profitability: 89, trend: "+18%", status: "trending" },
  { id: 3, name: "Ergonomic Standing Desk Converter", category: "Furniture", profitability: 91, trend: "+31%", status: "hot" },
  { id: 4, name: "Smart Home Security Camera 4K", category: "Electronics", profitability: 78, trend: "+12%", status: "new" },
  { id: 5, name: "Portable Power Bank 20000mAh", category: "Electronics", profitability: 85, trend: "+8%", status: "stable" }
];

const categoryDistribution = [
  { name: 'Electronics', value: 35, color: '#4F46E5' },
  { name: 'Fashion', value: 25, color: '#10B981' },
  { name: 'Home & Garden', value: 20, color: '#F59E0B' },
  { name: 'Sports & Fitness', value: 15, color: '#EF4444' },
  { name: 'Other', value: 5, color: '#3B82F6' }
];

const profitabilityTrend = [
  { month: 'Aug', profitability: 78, products: 1200 },
  { month: 'Sep', profitability: 82, products: 1350 },
  { month: 'Oct', profitability: 85, products: 1450 },
  { month: 'Nov', profitability: 84, products: 1520 },
  { month: 'Dec', profitability: 87, products: 1680 },
  { month: 'Jan', profitability: 84, products: 1750 }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900")}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Target-Lock Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            AI-powered product discovery and market intelligence platform
          </p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="border-l-4 border-l-indigo-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {stat.value}
                      </p>
                      <div className={`inline-flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {stat.change} from last month
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
                      <IconComponent className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Recent Products - Left Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Recent Products
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <div key={product.id} className="px-6 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {product.category}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-indigo-600">
                              {product.profitability}% Profit
                            </span>
                            <span className={`text-xs font-medium flex items-center gap-1 ${product.trend.startsWith('+') ? 'text-green-600' : 'text-gray-600'}`}>
                              <TrendingUp className="w-3 h-3" />
                              {product.trend}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profitability Trend Chart - Center */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Profitability Trends
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monthly profitability scores and product count growth
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profitabilityTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="profitability"
                        stroke="#10B981"
                        strokeWidth={3}
                        name="Avg Profitability %"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="products"
                        stroke="#4F46E5"
                        strokeWidth={3}
                        name="Products Tracked"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Distribution - Right Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Market Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {categoryDistribution.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Jump into key features of the platform
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={() => navigate('/search')}
                  className="h-auto p-4 flex flex-col items-center gap-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200"
                >
                  <Search className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold">Product Search</div>
                    <div className="text-xs">Discover new opportunities</div>
                  </div>
                </Button>

                <Button
                  onClick={() => navigate('/trending')}
                  className="h-auto p-4 flex flex-col items-center gap-3 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                >
                  <TrendingUp className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold">Trending Products</div>
                    <div className="text-xs">See what's hot now</div>
                  </div>
                </Button>

                <Button
                  onClick={() => navigate('/recommendations')}
                  className="h-auto p-4 flex flex-col items-center gap-3 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200"
                >
                  <Sparkles className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold">AI Recommendations</div>
                    <div className="text-xs">Personalized suggestions</div>
                  </div>
                </Button>

                <Button
                  onClick={() => navigate('/analytics')}
                  className="h-auto p-4 flex flex-col items-center gap-3 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200"
                >
                  <BarChart3 className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold">Analytics</div>
                    <div className="text-xs">Deep market insights</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <Button
            onClick={() => navigate('/reports')}
            className="h-auto p-4 flex flex-col items-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
          >
            <FileText className="w-6 h-6" />
            <div className="text-center">
              <div className="font-semibold">Reports & Export</div>
              <div className="text-xs">Generate detailed reports</div>
            </div>
          </Button>

          <Button
            onClick={() => navigate('/chatbot')}
            className="h-auto p-4 flex flex-col items-center gap-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
          >
            <Bot className="w-6 h-6" />
            <div className="text-center">
              <div className="font-semibold">AI Assistant</div>
              <div className="text-xs">Get instant help</div>
            </div>
          </Button>

          <Button
            onClick={() => navigate('/profile')}
            className="h-auto p-4 flex flex-col items-center gap-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
          >
            <Users className="w-6 h-6" />
            <div className="text-center">
              <div className="font-semibold">User Profile</div>
              <div className="text-xs">Manage your account</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
