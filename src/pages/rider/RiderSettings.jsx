import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/user.service";
import { InputField } from "../../components/common/InputField";
import { Button } from "../../components/common/Button";
import { Divider } from "../../components/common/Divider";
import toast from "react-hot-toast";

export const RiderSettings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword(oldPassword, newPassword);
      toast.success("Password changed");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    const password = prompt("Enter your password to confirm:");
    if (!password) return;

    setLoading(true);
    try {
      await userService.deleteAccount(password);
      logout();
      navigate("/");
      toast.success("Account deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Change Password */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <InputField
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={loading}
          />
          <InputField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" loading={loading} className="w-full">
            Change Password
          </Button>
        </form>
      </div>

      <Divider />

      {/* Logout */}
      <div className="mb-6">
        <Button variant="secondary" onClick={handleLogout} className="w-full">
          Logout
        </Button>
      </div>

      <Divider />

      {/* Delete Account */}
      <div>
        <Button
          variant="danger"
          onClick={handleDeleteAccount}
          disabled={loading}
          className="w-full"
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
};
