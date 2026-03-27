import { useCallback, useRef, useState } from 'react';
import axiosInstance from '../config/axios.config';

export const useFare = () => {
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimerRef = useRef(null);

  const estimateFare = useCallback(
    async (pickupLat, pickupLng, dropLat, dropLng, vehicleType = 'economy') => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.post('/rides/estimate-fare', {
          pickupLocation: {
            latitude: pickupLat,
            longitude: pickupLng,
          },
          dropoffLocation: {
            latitude: dropLat,
            longitude: dropLng,
          },
          vehicleType,
        });

        setFare(response.data.data);
        return response.data.data;
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const estimateFareDebounced = useCallback(
    (pickupLat, pickupLng, dropLat, dropLng, vehicleType, delay = 800) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        estimateFare(pickupLat, pickupLng, dropLat, dropLng, vehicleType);
      }, delay);

      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    },
    [estimateFare]
  );

  const clearFare = useCallback(() => {
    setFare(null);
    setError(null);
  }, []);

  return {
    fare,
    loading,
    error,
    estimateFare,
    estimateFareDebounced,
    clearFare,
  };
};
