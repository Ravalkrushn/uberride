import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import { RideProvider } from "./contexts/RideContext";
import { LocationProvider } from "./contexts/LocationContext";
import { Toast } from "./components/common/Toast";
import { AppRouter } from "./router/AppRouter";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <RideProvider>
            <LocationProvider>
              <Toast />
              <AppRouter />
            </LocationProvider>
          </RideProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
