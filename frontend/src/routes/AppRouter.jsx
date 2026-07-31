import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import DashboardLayout from "@/layouts/DashboardLayout";

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">
        Welcome to Alishan Accommodation
      </h1>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Layout (authentication will come later) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Future Routes */}
          {/* <Route path="/guests" element={<Guests />} /> */}
          {/* <Route path="/properties" element={<Properties />} /> */}
          {/* <Route path="/rooms" element={<Rooms />} /> */}
          {/* <Route path="/bookings" element={<Bookings />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}