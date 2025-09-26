import React from "react";
import { useNavigate } from "react-router-dom";
import { FileSpreadsheet, FileText, FileBarChart2 } from "lucide-react";

const Reports = () => {
  const navigate = useNavigate();

  const reportOptions = [
    {
      id: 1,
      name: "Excel Report",
      description: "Detailed structured data in .xlsx format",
      icon: <FileSpreadsheet className="w-8 h-8 text-green-500" />,
      color: "from-green-50 to-green-100",
      btnColor: "bg-green-500 hover:bg-green-600",
      route: "/reports/excel",
    },
    {
      id: 2,
      name: "PDF Report",
      description: "Formatted summary reports in .pdf format",
      icon: <FileText className="w-8 h-8 text-red-500" />,
      color: "from-red-50 to-red-100",
      btnColor: "bg-red-500 hover:bg-red-600",
      route: "/reports/pdf",
    },
    {
      id: 3,
      name: "CSV Report",
      description: "Quick lightweight export in .csv format",
      icon: <FileBarChart2 className="w-8 h-8 text-blue-500" />,
      color: "from-blue-50 to-blue-100",
      btnColor: "bg-blue-500 hover:bg-blue-600",
      route: "/reports/csv",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Reports & Export
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportOptions.map((report) => (
          <div
            key={report.id}
            className={`bg-gradient-to-br ${report.color} rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6`}
          >
            {/* Icon */}
            <div className="mb-4">{report.icon}</div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800">
              {report.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{report.description}</p>

            {/* Action Button */}
            <button
              onClick={() => navigate(report.route)}
              className={`${report.btnColor} text-white px-4 py-2 rounded-lg font-medium transition w-full`}
            >
              Generate & Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
