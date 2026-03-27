import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const Analytics = () => {
  const ridesData = [
    { date: "Jan 1", rides: 120, revenue: 5500 },
    { date: "Jan 2", rides: 145, revenue: 6800 },
    { date: "Jan 3", rides: 130, revenue: 6200 },
    { date: "Jan 4", rides: 180, revenue: 8500 },
  ];

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Rides Over Time */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-bold mb-4">Rides Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ridesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="rides" stroke="#000000" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Over Time */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold mb-4">Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ridesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
