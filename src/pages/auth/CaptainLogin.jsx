import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";
import { setToken, setUser, setUserType } from "../../utils/storage";
import toast from "react-hot-toast";
import { PhoneInput } from "../../components/common/PhoneInput";
import { InputField } from "../../components/common/InputField";
import { Button } from "../../components/common/Button";

export const CaptainLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone || formData.phone.length < 10)
      newErrors.phone = "Valid phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
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
      const response = await authService.captainLogin(
        "+91" + formData.phone.replace(/\s/g, ""),
        formData.password,
      );

      setToken(response.data.token);
      setUser(response.data.captain);
      setUserType("captain");
      login(response.data.captain, response.data.token, "captain");
      toast.success("Login successful");
      navigate("/captain-home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center p-4">
      <div className="max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Uber</h1>
        <h2 className="text-2xl font-bold mb-6">Sign in as Captain</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/captain-register"
            className="text-black font-bold hover:underline"
          >
            Sign up
          </Link>
        </p>

        <p className="mt-4 text-center text-gray-600">
          Want to ride?{" "}
          <Link
            to="/rider-login"
            className="text-black font-bold hover:underline"
          >
            Sign in as Rider
          </Link>
        </p>
      </div>
    </div>
  );
};
