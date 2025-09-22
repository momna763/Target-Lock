import React from "react";
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
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  BarChart3,
  Users,
  Package,
} from "lucide-react";

// Dummy data
const lineData = [
  { name: "Jan", products: 30 },
  { name: "Feb", products: 50 },
  { name: "Mar", products: 80 },
  { name: "Apr", products: 65 },
  { name: "May", products: 95 },
];

const pieData = [
  { name: "Electronics", value: 40 },
  { name: "Home", value: 25 },
  { name: "Fitness", value: 20 },
  { name: "Beauty", value: 15 },
];

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ec4899"];

const trendingProducts = [
  { name: "Smart Lamp", category: "Electronics", trend: "+12%" },
  { name: "Eco Bottle", category: "Home", trend: "+8%" },
  { name: "Yoga Mat", category: "Fitness", trend: "+15%" },
  { name: "Face Cream", category: "Beauty", trend: "+10%" },
];

const metrics = [
  {
    label: "Total Products",
    value: "1,234",
    icon: <Package className="w-7 h-7 text-indigo-400" />,
  },
  {
    label: "Profitability",
    value: "87%",
    icon: <TrendingUp className="w-7 h-7 text-green-400" />,
  },
  {
    label: "Customers",
    value: "1,893",
    icon: <Users className="w-7 h-7 text-pink-400" />,
  },
  {
    label: "New Products",
    value: "24",
    icon: <ShoppingBag className="w-7 h-7 text-orange-400" />,
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      {/* Row 1: Metrics + Trending Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 gap-6">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-800 hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                {m.icon}
                <div>
                  <p className="text-gray-400 text-sm">{m.label}</p>
                  <p className="text-2xl font-bold">{m.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trending Products Horizontal Cards */}
        <div className="flex space-x-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
          {trendingProducts.map((p, i) => (
            <div
              key={i}
              className="min-w-[200px] bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl p-5 rounded-2xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-gray-800"
            >
              <div className="h-24 bg-gray-800 rounded-xl mb-3 flex items-center justify-center text-gray-500">
                📦
              </div>
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-gray-400 text-sm">{p.category}</p>
              <span className="text-green-400 font-bold">{p.trend}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-gray-900/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">
            📈 Products Trending Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="products"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-900/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">🥧 Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
