import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/user.service";
import { Avatar } from "../../components/common/Avatar";
import { InputField } from "../../components/common/InputField";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import toast from "react-hot-toast";

export const RiderProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
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
      const response = await userService.updateProfile(formData);
      updateUser(response.data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="text-center mb-6">
        <Avatar src={user.profilePhoto} name={user.fullname} size="xl" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
        <InputField label="Phone" type="tel" value={user.phone} disabled />
        <Button type="submit" loading={loading} className="w-full">
          Update Profile
        </Button>
      </form>
    </div>
  );
};
