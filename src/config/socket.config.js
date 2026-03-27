import io from 'socket.io-client';
import { getToken } from '../utils/storage';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initSocket = () => {
  const token = getToken();

  if (!token) {
    console.warn('No token available for socket connection');
    return null;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
      userId: localStorage.getItem('userId'),
      userType: localStorage.getItem('userType'),
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export default socket;
