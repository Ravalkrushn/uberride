import React, { useState, useEffect } from "react";
import { captainService } from "../../services/captain.service";
import { Tabs } from "../../components/common/Tabs";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";

export const Earnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("day");

  useEffect(() => {
    fetchEarnings();
  }, [period]);

  const fetchEarnings = async () => {
    try {
      const response = await captainService.getEarnings(period);
      setEarnings(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  const tabs = [
    {
      label: "Day",
      content: (
        <div className="space-y-3">
          <div className="bg-black text-white p-4 rounded-lg text-center">
            <p className="text-gray-300">Today's Earnings</p>
            <p className="text-3xl font-bold">
              {formatCurrency(earnings?.total || 0)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 p-3 rounded text-center">
              <p className="text-xs text-gray-600">Rides</p>
              <p className="font-bold">{earnings?.ridesCompleted || 0}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded text-center">
              <p className="text-xs text-gray-600">Distance</p>
              <p className="font-bold">{earnings?.totalDistance || 0} km</p>
            </div>
            <div className="bg-gray-50 p-3 rounded text-center">
              <p className="text-xs text-gray-600">Hours</p>
              <p className="font-bold">{earnings?.hoursActive || 0} h</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Week",
      content: (
        <div className="bg-black text-white p-4 rounded-lg text-center">
          <p className="text-gray-300">This Week's Earnings</p>
          <p className="text-3xl font-bold">
            {formatCurrency(earnings?.weeklyTotal || 0)}
          </p>
        </div>
      ),
    },
    {
      label: "Month",
      content: (
        <div className="bg-black text-white p-4 rounded-lg text-center">
          <p className="text-gray-300">This Month's Earnings</p>
          <p className="text-3xl font-bold">
            {formatCurrency(earnings?.monthlyTotal || 0)}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Earnings</h1>
      <Tabs tabs={tabs} onChange={() => {}} />
    </div>
  );
};
