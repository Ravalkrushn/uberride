import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { captainService } from "../../services/captain.service";
import { Avatar } from "../../components/common/Avatar";
import { InputField } from "../../components/common/InputField";
import { Button } from "../../components/common/Button";
import { Divider } from "../../components/common/Divider";
import toast from "react-hot-toast";

export const CaptainProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await captainService.updateProfile(formData);
      updateUser(response.data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Captain Profile</h1>

      {/* Avatar */}
      <div className="text-center mb-6">
        <Avatar src={user.profilePhoto} name={user.fullname} size="xl" />
      </div>

      {/* Personal Details */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <InputField
          label="Full Name"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          disabled={loading}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
        <InputField label="Phone" type="tel" value={formData.phone} disabled />
        <Button type="submit" loading={loading} className="w-full">
          Update Profile
        </Button>
      </form>

      <Divider text="Vehicle & Bank" />

      {/* Vehicle Info */}
      {user.vehicle && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-3">Vehicle Details</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-600">Type:</span>{" "}
              {user.vehicle.vehicleType}
            </p>
            <p>
              <span className="text-gray-600">License Plate:</span>{" "}
              {user.vehicle.licensePlate}
            </p>
            <p>
              <span className="text-gray-600">Manufacturer:</span>{" "}
              {user.vehicle.manufacturer}
            </p>
            <p>
              <span className="text-gray-600">Model:</span> {user.vehicle.model}
            </p>
            <p>
              <span className="text-gray-600">Color:</span> {user.vehicle.color}
            </p>
          </div>
        </div>
      )}

      {/* Bank Account */}
      {user.bankAccount && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-3">Bank Account</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-600">Account Holder:</span>{" "}
              {user.bankAccount.accountHolder}
            </p>
            <p>
              <span className="text-gray-600">Account Number:</span> ****
              {user.bankAccount.accountNumber?.slice(-4)}
            </p>
            <p>
              <span className="text-gray-600">IFSC:</span>{" "}
              {user.bankAccount.ifscCode}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
