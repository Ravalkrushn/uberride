import { useEffect, useRef, useState } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const useGoogleMaps = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    if (window.google?.maps) {
      setLoaded(true);
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key not configured');
      return;
    }

    const loadScript = async () => {
      try {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          setLoaded(true);
          setError(null);
        };

        script.onerror = () => {
          setError('Failed to load Google Maps');
        };

        document.head.appendChild(script);
        scriptRef.current = script;
      } catch (err) {
        setError(err.message);
      }
    };

    loadScript();

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
    };
  }, []);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    if (!window.google?.maps?.geometry) return 0;
    const from = new window.google.maps.LatLng(lat1, lng1);
    const to = new window.google.maps.LatLng(lat2, lng2);
    return window.google.maps.geometry.spherical.computeDistanceBetween(from, to);
  };

  const calculateDuration = (lat1, lng1, lat2, lng2) => {
    // Rough estimate: 40 km/h average speed in city
    const distance = calculateDistance(lat1, lng1, lat2, lng2);
    const speedMps = (40 * 1000) / 3600; // meters per second
    return Math.ceil(distance / speedMps);
  };

  return {
    loaded,
    error,
    calculateDistance,
    calculateDuration,
  };
};
