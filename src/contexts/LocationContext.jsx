import React, { createContext, useState, useEffect, useCallback } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);
  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const getLocation = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const {
            latitude: lat,
            longitude: lng,
            accuracy: acc,
          } = position.coords;
          setLatitude(lat);
          setLongitude(lng);
          setAccuracy(acc);
          setError(null);
          resolve({ latitude: lat, longitude: lng });
        },
        (err) => {
          setError(err.message);
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    });
  }, []);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    if (watching) return; // Already watching

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const {
          latitude: lat,
          longitude: lng,
          accuracy: acc,
        } = position.coords;
        setLatitude(lat);
        setLongitude(lng);
        setAccuracy(acc);
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );

    setWatchId(id);
    setWatching(true);
  }, [watching]);

  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setWatching(false);
    }
  }, [watchId]);

  const setAddress_ = useCallback((addr) => {
    setAddress(addr);
  }, []);

  const value = {
    latitude,
    longitude,
    address,
    accuracy,
    error,
    watching,
    getLocation,
    startWatching,
    stopWatching,
    setAddress: setAddress_,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
