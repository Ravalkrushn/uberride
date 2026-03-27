import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";
import { setToken, setUser, setUserType } from "../../utils/storage";
import toast from "react-hot-toast";
import { PhoneInput } from "../../components/common/PhoneInput";
import { OtpInput } from "../../components/common/OtpInput";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";

export const RiderLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState("phone"); // phone or otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const fullPhone = "+91" + phone.replace(/\s/g, "");
      await authService.sendOtp(fullPhone);
      setStep("otp");
      setTimer(60);
      toast.success("OTP sent to your phone");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const fullPhone = "+91" + phone.replace(/\s/g, "");
      const response = await authService.verifyOtp(fullPhone, otp);

      setToken(response.data.token);
      setUser(response.data.user);
      setUserType("rider");

      login(response.data.user, response.data.token, "rider");
      toast.success("Login successful");
      navigate("/rider-home");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
      toast.error(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center p-4">
      <div className="max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Uber</h1>
        <h2 className="text-2xl font-bold mb-6">Sign in as Rider</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <PhoneInput
              label="Phone Number"
              value={phone}
              onChange={setPhone}
              required
              disabled={loading}
            />
            <Button type="submit" loading={loading} className="w-full">
              Send OTP
            </Button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyOtp();
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Enter OTP
              </label>
              <OtpInput length={4} onComplete={setOtp} />
            </div>
            <Button type="submit" loading={loading} className="w-full">
              Verify OTP
            </Button>
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="w-full text-black hover:underline"
            >
              Change phone number
            </button>
            {timer > 0 && (
              <p className="text-center text-sm text-gray-600">
                Resend OTP in {timer}s
              </p>
            )}
            {timer === 0 && (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full text-black hover:underline"
              >
                Resend OTP
              </button>
            )}
          </form>
        )}

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/rider-register"
            className="text-black font-bold hover:underline"
          >
            Sign up
          </Link>
        </p>

        <p className="mt-4 text-center text-gray-600">
          Want to drive?{" "}
          <Link
            to="/captain-login"
            className="text-black font-bold hover:underline"
          >
            Sign in as Captain
          </Link>
        </p>
      </div>
    </div>
  );
};
