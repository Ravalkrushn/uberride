import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/common/ProtectedRoute";

// Auth
import { Landing } from "../pages/auth/Landing";
import { RiderLogin } from "../pages/auth/RiderLogin";
import { RiderRegister } from "../pages/auth/RiderRegister";
import { CaptainLogin } from "../pages/auth/CaptainLogin";
import { CaptainRegister } from "../pages/auth/CaptainRegister";
import { CaptainAvatarUpload } from "../pages/auth/CaptainAvatarUpload";

// Rider
import { RiderHome } from "../pages/rider/RiderHome";
import { RideBooking } from "../pages/rider/RideBooking";
import { WaitingForDriver } from "../pages/rider/WaitingForDriver";
import { DriverOtw } from "../pages/rider/DriverOtw";
import { TripInProgress } from "../pages/rider/TripInProgress";
import { TripCompleted } from "../pages/rider/TripCompleted";
import { RideHistory } from "../pages/rider/RideHistory";
import { RideDetail } from "../pages/rider/RideDetail";
import { Wallet } from "../pages/rider/Wallet";
import { RiderProfile } from "../pages/rider/RiderProfile";
import { RiderSettings } from "../pages/rider/RiderSettings";

// Captain
import { CaptainHome } from "../pages/captain/CaptainHome";
import { IncomingRide } from "../pages/captain/IncomingRide";
import { GoToPickup } from "../pages/captain/GoToPickup";
import { CaptainTripInProgress } from "../pages/captain/CaptainTripInProgress";
import { CaptainTripCompleted } from "../pages/captain/CaptainTripCompleted";
import { Earnings } from "../pages/captain/Earnings";
import { Performance } from "../pages/captain/Performance";
import { Documents } from "../pages/captain/Documents";
import { CaptainProfile } from "../pages/captain/CaptainProfile";

// Admin
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { UsersManagement } from "../pages/admin/UsersManagement";
import { CaptainsManagement } from "../pages/admin/CaptainsManagement";
import { RidesManagement } from "../pages/admin/RidesManagement";
import { PricingManagement } from "../pages/admin/PricingManagement";
import { PayoutsManagement } from "../pages/admin/PayoutsManagement";
import { Analytics } from "../pages/admin/Analytics";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/rider-login" element={<RiderLogin />} />
      <Route path="/rider-register" element={<RiderRegister />} />
      <Route path="/captain-login" element={<CaptainLogin />} />
      <Route path="/captain-register" element={<CaptainRegister />} />

      {/* Rider Routes */}
      <Route
        path="/rider-home"
        element={
          <ProtectedRoute requiredRole="rider">
            <RiderHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ride-booking"
        element={
          <ProtectedRoute requiredRole="rider">
            <RideBooking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/waiting-for-driver"
        element={
          <ProtectedRoute requiredRole="rider">
            <WaitingForDriver />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver-otw"
        element={
          <ProtectedRoute requiredRole="rider">
            <DriverOtw />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trip-in-progress"
        element={
          <ProtectedRoute requiredRole="rider">
            <TripInProgress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trip-completed"
        element={
          <ProtectedRoute requiredRole="rider">
            <TripCompleted />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ride-history"
        element={
          <ProtectedRoute requiredRole="rider">
            <RideHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ride/:rideId"
        element={
          <ProtectedRoute requiredRole="rider">
            <RideDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute requiredRole="rider">
            <Wallet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rider-profile"
        element={
          <ProtectedRoute requiredRole="rider">
            <RiderProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rider-settings"
        element={
          <ProtectedRoute requiredRole="rider">
            <RiderSettings />
          </ProtectedRoute>
        }
      />

      {/* Captain Routes */}
      <Route path="/captain-avatar-upload" element={<CaptainAvatarUpload />} />
      <Route
        path="/captain-home"
        element={
          <ProtectedRoute requiredRole="captain">
            <CaptainHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incoming-ride"
        element={
          <ProtectedRoute requiredRole="captain">
            <IncomingRide />
          </ProtectedRoute>
        }
      />
      <Route
        path="/go-to-pickup"
        element={
          <ProtectedRoute requiredRole="captain">
            <GoToPickup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trip-in-progress-captain"
        element={
          <ProtectedRoute requiredRole="captain">
            <CaptainTripInProgress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trip-completed-captain"
        element={
          <ProtectedRoute requiredRole="captain">
            <CaptainTripCompleted />
          </ProtectedRoute>
        }
      />
      <Route
        path="/earnings"
        element={
          <ProtectedRoute requiredRole="captain">
            <Earnings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/performance"
        element={
          <ProtectedRoute requiredRole="captain">
            <Performance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute requiredRole="captain">
            <Documents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/captain-profile"
        element={
          <ProtectedRoute requiredRole="captain">
            <CaptainProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <UsersManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/captains"
        element={
          <ProtectedRoute requiredRole="admin">
            <CaptainsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rides"
        element={
          <ProtectedRoute requiredRole="admin">
            <RidesManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pricing"
        element={
          <ProtectedRoute requiredRole="admin">
            <PricingManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payouts"
        element={
          <ProtectedRoute requiredRole="admin">
            <PayoutsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute requiredRole="admin">
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
