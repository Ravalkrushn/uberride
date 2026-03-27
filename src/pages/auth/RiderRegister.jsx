import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";
import { setToken, setUser, setUserType } from "../../utils/storage";
import toast from "react-hot-toast";
import { PhoneInput } from "../../components/common/PhoneInput";
import { InputField } from "../../components/common/InputField";
import { Button } from "../../components/common/Button";

export const RiderRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullname.trim()) newErrors.fullname = "Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phone || formData.phone.length < 10)
      newErrors.phone = "Valid phone is required";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.registerRider({
        fullname: formData.fullname,
        email: formData.email,
        phone: "+91" + formData.phone.replace(/\s/g, ""),
        password: formData.password,
      });

      setToken(response.data.token);
      setUser(response.data.user);
      setUserType("rider");
      login(response.data.user, response.data.token, "rider");
      toast.success("Registration successful");
      navigate("/rider-home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center p-4">
      <div className="max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Uber</h1>
        <h2 className="text-2xl font-bold mb-6">Sign up as Rider</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            error={errors.fullname}
            required
            disabled={loading}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            disabled={loading}
          />
          <PhoneInput
            label="Phone Number"
            value={formData.phone}
            onChange={(val) =>
              handleChange({ target: { name: "phone", value: val } })
            }
            error={errors.phone}
            required
            disabled={loading}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            disabled={loading}
          />
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            disabled={loading}
          />
          <Button type="submit" loading={loading} className="w-full">
            Sign Up
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/rider-login"
            className="text-black font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-center text-gray-600">
          Want to drive?{" "}
          <Link
            to="/captain-register"
            className="text-black font-bold hover:underline"
          >
            Sign up as Captain
          </Link>
        </p>
      </div>
    </div>
  );
};
