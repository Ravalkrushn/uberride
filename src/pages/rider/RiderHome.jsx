import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { useLocation } from "../../hooks/useLocation";
import { useAuth } from "../../hooks/useAuth";
import { rideService } from "../../services/ride.service";
import { mapsService } from "../../services/maps.service";
import toast from "react-hot-toast";
import { MapContainer } from "../../components/common/MapContainer";
import { InputField } from "../../components/common/InputField";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";

export const RiderHome = () => {
  const navigate = useNavigate();
  const { latitude, longitude, getLocation, startWatching } = useLocation();
  const { user, logout } = useAuth();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 28.7041, lng: 77.1025 });

  useEffect(() => {
    getLocation()
      .then(() => {
        startWatching();
      })
      .catch(() => {
        toast.error("Unable to get your location");
      });
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  const handlePickupChange = (e) => {
    const value = e.target.value;
    setPickup(value);

    if (value.length > 2) {
      fetchSuggestions(value).then((results) => {
        setSuggestions(results.map((r, i) => ({ id: i, text: r })));
      });
    }
  };

  const fetchSuggestions = async (input) => {
    try {
      const response = await mapsService.autocomplete(input);
      return response.data || [];
    } catch (err) {
      return [];
    }
  };

  const handleBookRide = async () => {
    if (!pickup || !dropoff) {
      toast.error("Please enter both pickup and dropoff locations");
      return;
    }

    if (!latitude || !longitude) {
      toast.error("Please enable location services");
      return;
    }

    setLoading(true);
    try {
      // Get coordinates for dropoff
      const dropoffCoords = await mapsService.geocode(dropoff);

      const response = await rideService.requestRide(
        latitude,
        longitude,
        dropoffCoords.data.latitude,
        dropoffCoords.data.longitude,
        pickup,
        dropoff,
        "economy",
      );

      navigate("/waiting-for-driver", { state: { rideId: response.data._id } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Uber</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/rider-profile")}
            className="text-sm hover:underline"
          >
            {user?.fullname}
          </button>
          <button onClick={logout} className="text-sm hover:underline">
            Logout
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {latitude && longitude ? (
          <MapContainer
            center={{ lat: latitude, lng: longitude }}
            zoom={15}
            markers={[
              { lat: latitude, lng: longitude, title: "Your Location" },
            ]}
          />
        ) : (
          <Loader fullScreen />
        )}
      </div>

      {/* Booking Panel */}
      <div className="bg-white border-t p-4 space-y-3">
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
          <InputField
            name="pickup"
            value={pickup}
            onChange={handlePickupChange}
            placeholder="Pickup location"
            icon={FaMapMarkerAlt}
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 z-10">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setPickup(s.text);
                    setSuggestions([]);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  {s.text}
                </button>
              ))}
            </div>
          )}
        </div>

        <InputField
          name="dropoff"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          placeholder="Where to?"
        />

        <Button onClick={handleBookRide} loading={loading} className="w-full">
          Book Ride
        </Button>
      </div>
    </div>
  );
};
