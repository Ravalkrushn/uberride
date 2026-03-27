import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCar, FaUserTie } from "react-icons/fa";
import { Button } from "../components/common/Button";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Logo/Hero */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mx-auto mb-6">
          <FaCar size={48} className="text-black" />
        </div>
        <h1 className="text-5xl font-bold mb-4">Uber</h1>
        <p className="text-xl text-gray-400">The fastest way to get around</p>
      </div>

      {/* CTA Buttons */}
      <div className="w-full max-w-md space-y-4">
        {/* Rider Button */}
        <button
          onClick={() => navigate("/rider-login")}
          className="w-full bg-white text-black py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
        >
          <FaCar size={20} />
          Get a Ride
        </button>

        {/* Captain Button */}
        <button
          onClick={() => navigate("/captain-login")}
          className="w-full bg-green-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-all flex items-center justify-center gap-3"
        >
          <FaUserTie size={20} />
          Drive with Uber
        </button>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-sm mt-8 text-center">
        Your journey begins here
      </p>
    </div>
  );
};
