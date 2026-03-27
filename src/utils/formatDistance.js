export const formatDistance = (meters) => {
  if (!meters) return '0 m';

  if (meters >= 1000) {
    const km = (meters / 1000).toFixed(1);
    return `${km} km`;
  }

  return `${Math.round(meters)} m`;
};

export const formatDistanceInKm = (meters) => {
  return (meters / 1000).toFixed(1);
};

export const formatDistanceInMeters = (km) => {
  return Math.round(km * 1000);
};
