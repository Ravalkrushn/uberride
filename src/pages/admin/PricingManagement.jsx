import React, { useState } from "react";
import { InputField } from "../../components/common/InputField";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import toast from "react-hot-toast";

export const PricingManagement = () => {
  const [pricing, setPricing] = useState({
    base: 50,
    perKm: 15,
    perMin: 2,
    surgeMultiplier: 1.5,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPricing((prev) => ({
      ...prev,
      [e.target.name]: parseFloat(e.target.value),
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call would go here
      toast.success("Pricing updated successfully");
    } catch (err) {
      toast.error("Failed to update pricing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Pricing Management</h1>

      <Card>
        <div className="space-y-4">
          <InputField
            label="Base Fare (₹)"
            name="base"
            type="number"
            value={pricing.base}
            onChange={handleChange}
          />
          <InputField
            label="Per KM (₹)"
            name="perKm"
            type="number"
            value={pricing.perKm}
            onChange={handleChange}
          />
          <InputField
            label="Per Minute (₹)"
            name="perMin"
            type="number"
            value={pricing.perMin}
            onChange={handleChange}
          />
          <InputField
            label="Surge Multiplier"
            name="surgeMultiplier"
            type="number"
            step="0.1"
            value={pricing.surgeMultiplier}
            onChange={handleChange}
          />
          <Button onClick={handleSave} loading={loading} className="w-full">
            Save Pricing
          </Button>
        </div>
      </Card>
    </div>
  );
};
