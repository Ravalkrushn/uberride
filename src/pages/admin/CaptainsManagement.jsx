import React, { useState, useEffect } from "react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";

export const CaptainsManagement = () => {
  const [captains, setCaptains] = useState([]);

  useEffect(() => {
    // Mock data
    setCaptains([
      {
        _id: "1",
        fullname: "Captain A",
        email: "cap_a@example.com",
        vehicle: "Honda City",
        status: "verified",
        ridesCompleted: 120,
      },
      {
        _id: "2",
        fullname: "Captain B",
        email: "cap_b@example.com",
        vehicle: "Maruti Swift",
        status: "pending",
        ridesCompleted: 0,
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Captains Management</h1>

      <div className="space-y-3">
        {captains.map((captain) => (
          <Card key={captain._id} hover>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{captain.fullname}</p>
                <p className="text-sm text-gray-600">{captain.email}</p>
                <p className="text-sm text-gray-600">{captain.vehicle}</p>
                <div className="mt-2 flex gap-2 items-center">
                  <Badge
                    text={captain.status}
                    variant={
                      captain.status === "verified" ? "success" : "warning"
                    }
                  />
                  <span className="text-xs text-gray-600">
                    Rides: {captain.ridesCompleted}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {captain.status === "pending" && (
                  <>
                    <Button variant="primary" size="sm">
                      Approve
                    </Button>
                    <Button variant="danger" size="sm">
                      Reject
                    </Button>
                  </>
                )}
                {captain.status === "verified" && (
                  <Button variant="danger" size="sm">
                    Suspend
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
