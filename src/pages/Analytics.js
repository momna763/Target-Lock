import React from "react";
import { TrendingUp, PieChart as PieIcon, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Analytics = () => {
  // Dummy data
  const lineData = [
    { month: "Jan", products: 200 },
    { month: "Feb", products: 300 },
    { month: "Mar", products: 250 },
    { month: "Apr", products: 400 },
    { month: "May", products: 380 },
    { month: "Jun", products: 500 },
  ];

  const pieData = [
    { name: "Electronics", value: 35 },
    { name: "Fashion", value: 25 },
    { name: "Home", value: 20 },
    { name: "Sports", value: 15 },
    { name: "Other", value: 5 },
  ];

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

  const metrics = [
    {
      id: 1,
      name: "Total Products Tracked",
      value: "12,340",
      icon: <TrendingUp className="w-8 h-8 text-indigo-500" />,
      color: "from-indigo-50 to-indigo-100",
    },
    {
      id: 2,
      name: "Avg Profitability Score",
      value: "82%",
      icon: <BarChart3 className="w-8 h-8 text-green-500" />,
      color: "from-green-50 to-green-100",
    },
    {
      id: 3,
      name: "Top Category",
      value: "Electronics",
      icon: <PieIcon className="w-8 h-8 text-orange-500" />,
      color: "from-orange-50 to-orange-100",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Analytics & Insights
      </h2>
      <p className="text-gray-600 mb-6">
        Explore product trends, performance, and market distribution.
      </p>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`bg-gradient-to-br ${metric.color} rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1`}
          >
            <div className="mb-4">{metric.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">
              {metric.name}
            </h3>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Products Trending Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="products"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Category Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
