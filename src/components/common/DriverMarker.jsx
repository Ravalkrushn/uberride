import React from "react";
import { FaCar } from "react-icons/fa";

export const DriverMarker = ({
  lat,
  lng,
  heading = 0,
  isAnimated = false,
  onClick,
  driverName = "Driver",
}) => {
  const markerStyle = {
    transform: `rotate(${heading}deg)`,
    transition: isAnimated ? "all 1s linear" : "none",
  };

  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={onClick}
      style={{ width: "40px", height: "40px" }}
    >
      <div
        className="bg-black text-white rounded-full p-2 flex items-center justify-center shadow-lg"
        style={markerStyle}
      >
        <FaCar size={20} className="text-green-400" />
      </div>
      <div className="text-xs font-semibold bg-white px-2 py-1 rounded mt-1 shadow whitespace-nowrap">
        {driverName}
      </div>
    </div>
  );
};
