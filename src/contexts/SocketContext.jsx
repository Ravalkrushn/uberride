import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  initSocket,
  disconnectSocket,
  getSocket,
} from "../config/socket.config";
import { useAuth } from "../hooks/useAuth";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [listeners, setListeners] = useState({});
  const auth = useAuth();

  // Initialize socket when authenticated
  useEffect(() => {
    if (auth.isAuthenticated && !socket) {
      const socketInstance = initSocket();
      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        setConnected(true);
        console.log("Socket connected");
      });

      socketInstance.on("disconnect", () => {
        setConnected(false);
        console.log("Socket disconnected");
      });

      socketInstance.on("error", (error) => {
        console.error("Socket error:", error);
      });

      return () => {
        // Don't disconnect on unmount - only on logout
      };
    }
  }, [auth.isAuthenticated, socket]);

  // Disconnect on logout
  useEffect(() => {
    if (!auth.isAuthenticated && socket && connected) {
      disconnectSocket();
      setSocket(null);
      setConnected(false);
    }
  }, [auth.isAuthenticated, socket, connected]);

  const emit = useCallback(
    (event, data) => {
      const socketInstance = getSocket();
      if (socketInstance && connected) {
        socketInstance.emit(event, data);
      }
    },
    [connected],
  );

  const on = useCallback((event, callback) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.on(event, callback);
      setListeners((prev) => ({ ...prev, [event]: callback }));
    }
  }, []);

  const off = useCallback(
    (event) => {
      const socketInstance = getSocket();
      if (socketInstance) {
        const callback = listeners[event];
        if (callback) {
          socketInstance.off(event, callback);
          setListeners((prev) => {
            const updated = { ...prev };
            delete updated[event];
            return updated;
          });
        }
      }
    },
    [listeners],
  );

  const value = {
    socket,
    connected,
    emit,
    on,
    off,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
