import React, { useState } from "react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { formatCurrency } from "../../utils/formatCurrency";

export const PayoutsManagement = () => {
  const [payouts] = useState([
    {
      _id: "1",
      captain: "Captain A",
      amount: 2500,
      status: "completed",
      date: "2024-01-15",
    },
    {
      _id: "2",
      captain: "Captain B",
      amount: 1800,
      status: "pending",
      date: "2024-01-14",
    },
  ]);

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Payouts Management</h1>

      <div className="space-y-3">
        {payouts.map((payout) => (
          <Card key={payout._id} hover>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{payout.captain}</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(payout.amount)}
                </p>
                <p className="text-xs text-gray-500">{payout.date}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Badge
                  text={payout.status}
                  variant={
                    payout.status === "completed" ? "success" : "warning"
                  }
                />
                {payout.status === "pending" && (
                  <Button size="sm">Process</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
