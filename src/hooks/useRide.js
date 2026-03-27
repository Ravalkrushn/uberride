import { useContext } from 'react';
import { RideContext } from '../contexts/RideContext';

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within RideProvider');
  }
  return context;
};
