import React from "react";
import { Users, Package, Grid } from "lucide-react";

const AdminPanel = () => {
  // Dummy stats
  const stats = [
    { id: 1, title: "Total Users", value: "1,245", icon: <Users className="w-6 h-6 text-indigo-500" /> },
    { id: 2, title: "Products", value: "312", icon: <Package className="w-6 h-6 text-green-500" /> },
    { id: 3, title: "Categories", value: "24", icon: <Grid className="w-6 h-6 text-orange-500" /> },
  ];

  // Dummy users
  const users = [
    { id: 1, name: "Alice Johnson", role: "Admin", status: "Active" },
    { id: 2, name: "Bob Smith", role: "Editor", status: "Active" },
    { id: 3, name: "Charlie Lee", role: "Viewer", status: "Inactive" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Admin Panel</h2>
        <p className="text-gray-600">Manage users, products, and categories.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex items-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <div className="p-3 bg-gray-100 rounded-full mr-4">{stat.icon}</div>
            <div>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="px-6 py-3 font-medium text-gray-800">{user.name}</td>
                <td className="px-6 py-3">{user.role}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <button className="text-indigo-500 hover:text-indigo-700 text-sm mr-3">Edit</button>
                  <button className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
