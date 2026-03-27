export const rideStatuses = {
  BOOKED: { label: 'Booked', color: 'bg-blue-100 text-blue-800', badge: 'bg-blue-500' },
  SEARCHING: { label: 'Searching for driver', color: 'bg-yellow-100 text-yellow-800', badge: 'bg-yellow-500' },
  ACCEPTED: { label: 'Driver accepted', color: 'bg-green-100 text-green-800', badge: 'bg-green-500' },
  PICKUP_PENDING: { label: 'Going to pickup', color: 'bg-indigo-100 text-indigo-800', badge: 'bg-indigo-500' },
  OTP_PENDING: { label: 'Waiting for OTP', color: 'bg-purple-100 text-purple-800', badge: 'bg-purple-500' },
  STARTED: { label: 'Trip in progress', color: 'bg-green-100 text-green-800', badge: 'bg-green-500' },
  COMPLETED: { label: 'Completed', color: 'bg-gray-100 text-gray-800', badge: 'bg-gray-500' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800', badge: 'bg-red-500' },
};

export const getRideStatus = (status) => {
  return rideStatuses[status] || { label: status, color: 'bg-gray-100 text-gray-800', badge: 'bg-gray-500' };
};

export const isRideActive = (status) => {
  const activeStatuses = ['BOOKED', 'SEARCHING', 'ACCEPTED', 'PICKUP_PENDING', 'OTP_PENDING', 'STARTED'];
  return activeStatuses.includes(status);
};

export const isRideCompleted = (status) => {
  return status === 'COMPLETED';
};

export const isRideCancelled = (status) => {
  return status === 'CANCELLED';
};
