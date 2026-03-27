import React, { useState } from "react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { formatCurrency } from "../../utils/formatCurrency";

export const RidesManagement = () => {
  const [rides] = useState([
    {
      _id: "1",
      rider: "John Doe",
      captain: "Captain A",
      fare: 250,
      status: "completed",
    },
    {
      _id: "2",
      rider: "Jane Smith",
      captain: "Captain B",
      fare: 180,
      status: "cancelled",
    },
  ]);

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Rides Management</h1>

      <div className="space-y-3">
        {rides.map((ride) => (
          <Card key={ride._id} hover>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{ride.rider}</p>
                <p className="text-sm text-gray-600">Captain: {ride.captain}</p>
                <p className="text-sm text-gray-600">
                  Fare: {formatCurrency(ride.fare)}
                </p>
                <div className="mt-2">
                  <Badge
                    text={ride.status}
                    variant={ride.status === "completed" ? "success" : "error"}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
