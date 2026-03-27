import React, { createContext, useState, useCallback } from "react";

export const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [activeRide, setActiveRide] = useState(null);
  const [driver, setDriver] = useState(null);
  const [fare, setFare] = useState(null);
  const [rideStatus, setRideStatus] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [eta, setEta] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);

  const initializeRide = useCallback((rideData) => {
    setActiveRide(rideData);
    setRideStatus(rideData.status);
    setPickupLocation(rideData.pickup);
    setDropLocation(rideData.dropoff);
    if (rideData.captain) {
      setDriver(rideData.captain);
    }
  }, []);

  const updateRideStatus = useCallback((status) => {
    setRideStatus(status);
  }, []);

  const updateDriverLocation = useCallback((location) => {
    setDriverLocation(location);
  }, []);

  const updateEta = useCallback((newEta) => {
    setEta(newEta);
  }, []);

  const setRideFare = useCallback((fareData) => {
    setFare(fareData);
  }, []);

  const setRideDriver = useCallback((driverData) => {
    setDriver(driverData);
  }, []);

  const addToHistory = useCallback((ride) => {
    setRideHistory((prev) => [ride, ...prev]);
  }, []);

  const clearRide = useCallback(() => {
    setActiveRide(null);
    setDriver(null);
    setFare(null);
    setRideStatus(null);
    setPickupLocation(null);
    setDropLocation(null);
    setDriverLocation(null);
    setEta(null);
  }, []);

  const value = {
    activeRide,
    driver,
    fare,
    rideStatus,
    pickupLocation,
    dropLocation,
    driverLocation,
    eta,
    rideHistory,
    initializeRide,
    updateRideStatus,
    updateDriverLocation,
    updateEta,
    setRideFare,
    setRideDriver,
    addToHistory,
    clearRide,
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};
