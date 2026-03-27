import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader } from "../../components/common/Loader";

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setStats({
      totalRiders: 1250,
      totalCaptains: 450,
      totalRides: 5890,
      totalRevenue: 524500,
      revenueData: [
        { name: "Mon", revenue: 45000 },
        { name: "Tue", revenue: 52000 },
        { name: "Wed", revenue: 48000 },
        { name: "Thu", revenue: 61000 },
        { name: "Fri", revenue: 55000 },
      ],
      rideStats: [
        { name: "Completed", value: 5000 },
        { name: "Cancelled", value: 750 },
        { name: "Pending", value: 140 },
      ],
    });
    setLoading(false);
  }, []);

  if (loading) return <Loader fullScreen />;

  const colors = ["#000000", "#ef4444", "#f59e0b"];

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-black text-white p-4 rounded-lg">
          <p className="text-sm text-gray-300">Total Riders</p>
          <p className="text-2xl font-bold">{stats?.totalRiders}</p>
        </div>
        <div className="bg-black text-white p-4 rounded-lg">
          <p className="text-sm text-gray-300">Total Captains</p>
          <p className="text-2xl font-bold">{stats?.totalCaptains}</p>
        </div>
        <div className="bg-green-600 text-white p-4 rounded-lg">
          <p className="text-sm text-gray-100">Total Rides</p>
          <p className="text-2xl font-bold">{stats?.totalRides}</p>
        </div>
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <p className="text-sm text-gray-100">Total Revenue</p>
          <p className="text-2xl font-bold">₹{stats?.totalRevenue}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-4">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.revenueData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ride Status Pie */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-4">Ride Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats?.rideStats || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {colors.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
