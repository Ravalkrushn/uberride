import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";
import { setToken, setUser, setUserType } from "../../utils/storage";
import toast from "react-hot-toast";
import { PhoneInput } from "../../components/common/PhoneInput";
import { InputField } from "../../components/common/InputField";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { Tabs } from "../../components/common/Tabs";

export const CaptainRegister = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [personalData, setPersonalData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [vehicleData, setVehicleData] = useState({
    vehicleType: "", // economy, premium, etc.
    licensePlate: "",
    registrationNumber: "",
    manufacturer: "",
    model: "",
    color: "",
  });
  const [bankData, setBankData] = useState({
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validatePersonal = () => {
    const newErrors = {};
    if (!personalData.fullname.trim()) newErrors.fullname = "Name is required";
    if (!personalData.email.trim() || !/\S+@\S+\.\S+/.test(personalData.email))
      newErrors.email = "Valid email is required";
    if (!personalData.phone || personalData.phone.length < 10)
      newErrors.phone = "Valid phone is required";
    if (!personalData.password || personalData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (personalData.password !== personalData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const validateVehicle = () => {
    const newErrors = {};
    if (!vehicleData.vehicleType)
      newErrors.vehicleType = "Vehicle type is required";
    if (!vehicleData.licensePlate.trim())
      newErrors.licensePlate = "License plate is required";
    if (!vehicleData.manufacturer.trim())
      newErrors.manufacturer = "Manufacturer is required";
    if (!vehicleData.model.trim()) newErrors.model = "Model is required";
    return newErrors;
  };

  const validateBank = () => {
    const newErrors = {};
    if (!bankData.accountHolder.trim())
      newErrors.accountHolder = "Account holder name is required";
    if (!bankData.accountNumber.trim())
      newErrors.accountNumber = "Account number is required";
    if (!bankData.ifscCode.trim()) newErrors.ifscCode = "IFSC code is required";
    return newErrors;
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const personalErrors = validatePersonal();
    const vehicleErrors = validateVehicle();
    const bankErrors = validateBank();

    if (Object.keys(personalErrors).length > 0) {
      setErrors(personalErrors);
      setActiveTab(0);
      return;
    }

    if (Object.keys(vehicleErrors).length > 0) {
      setErrors(vehicleErrors);
      setActiveTab(1);
      return;
    }

    if (Object.keys(bankErrors).length > 0) {
      setErrors(bankErrors);
      setActiveTab(2);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.registerCaptain({
        fullname: personalData.fullname,
        email: personalData.email,
        phone: "+91" + personalData.phone.replace(/\s/g, ""),
        password: personalData.password,
        vehicle: vehicleData,
        bankAccount: bankData,
      });

      setToken(response.data.token);
      setUser(response.data.captain);
      setUserType("captain");

      navigate("/captain-avatar-upload");
      toast.success("Registration successful");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      label: "Personal",
      content: (
        <form className="space-y-4">
          <InputField
            label="Full Name"
            name="fullname"
            value={personalData.fullname}
            onChange={handlePersonalChange}
            error={errors.fullname}
            required
            disabled={loading}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={personalData.email}
            onChange={handlePersonalChange}
            error={errors.email}
            required
            disabled={loading}
          />
          <PhoneInput
            label="Phone Number"
            value={personalData.phone}
            onChange={(val) =>
              handlePersonalChange({ target: { name: "phone", value: val } })
            }
            error={errors.phone}
            required
            disabled={loading}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={personalData.password}
            onChange={handlePersonalChange}
            error={errors.password}
            required
            disabled={loading}
          />
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={personalData.confirmPassword}
            onChange={handlePersonalChange}
            error={errors.confirmPassword}
            required
            disabled={loading}
          />
        </form>
      ),
    },
    {
      label: "Vehicle",
      content: (
        <form className="space-y-4">
          <Select
            label="Vehicle Type"
            name="vehicleType"
            value={vehicleData.vehicleType}
            onChange={handleVehicleChange}
            options={[
              { value: "economy", label: "Economy" },
              { value: "premium", label: "Premium" },
              { value: "xl", label: "XL" },
            ]}
            error={errors.vehicleType}
            required
            disabled={loading}
          />
          <InputField
            label="License Plate"
            name="licensePlate"
            value={vehicleData.licensePlate}
            onChange={handleVehicleChange}
            error={errors.licensePlate}
            required
            disabled={loading}
          />
          <InputField
            label="Registration Number"
            name="registrationNumber"
            value={vehicleData.registrationNumber}
            onChange={handleVehicleChange}
            disabled={loading}
          />
          <InputField
            label="Manufacturer"
            name="manufacturer"
            value={vehicleData.manufacturer}
            onChange={handleVehicleChange}
            error={errors.manufacturer}
            required
            disabled={loading}
          />
          <InputField
            label="Model"
            name="model"
            value={vehicleData.model}
            onChange={handleVehicleChange}
            error={errors.model}
            required
            disabled={loading}
          />
          <InputField
            label="Color"
            name="color"
            value={vehicleData.color}
            onChange={handleVehicleChange}
            disabled={loading}
          />
        </form>
      ),
    },
    {
      label: "Bank Account",
      content: (
        <form className="space-y-4">
          <InputField
            label="Account Holder Name"
            name="accountHolder"
            value={bankData.accountHolder}
            onChange={handleBankChange}
            error={errors.accountHolder}
            required
            disabled={loading}
          />
          <InputField
            label="Account Number"
            name="accountNumber"
            value={bankData.accountNumber}
            onChange={handleBankChange}
            error={errors.accountNumber}
            required
            disabled={loading}
          />
          <InputField
            label="IFSC Code"
            name="ifscCode"
            value={bankData.ifscCode}
            onChange={handleBankChange}
            error={errors.ifscCode}
            required
            disabled={loading}
          />
        </form>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center p-4">
      <div className="max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Uber</h1>
        <h2 className="text-2xl font-bold mb-6">Sign up as Captain</h2>

        <form onSubmit={handleSubmit}>
          <Tabs tabs={tabs} defaultTab={activeTab} onChange={setActiveTab} />
          <Button type="submit" loading={loading} className="w-full mt-6">
            {activeTab === 2 ? "Complete Registration" : "Next"}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/captain-login"
            className="text-black font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
