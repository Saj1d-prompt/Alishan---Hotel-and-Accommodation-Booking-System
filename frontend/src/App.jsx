import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";
import PublicLayout from "@/layouts/PublicLayout";

import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import AdminPlaceholder from "@/pages/dashboard/AdminPlaceholder";

import About from "@/pages/public/About";
import Booking from "@/pages/public/Booking";
import Contact from "@/pages/public/Contact";
import Home from "@/pages/public/Home";
import LocationDetails from "@/pages/public/LocationDetails";
import Locations from "@/pages/public/Locations";
import NotFound from "@/pages/public/NotFound";
import RoomDetails from "@/pages/public/RoomDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />

          <Route
            path="locations"
            element={<Locations />}
          />

          <Route
            path="locations/:slug"
            element={<LocationDetails />}
          />

          <Route
            path="rooms"
            element={
              <Navigate
                to="/locations"
                replace
              />
            }
          />

          <Route
            path="rooms/:slug"
            element={<RoomDetails />}
          />

          <Route
            path="booking"
            element={<Booking />}
          />

          <Route
            path="about"
            element={<About />}
          />

          <Route
            path="contact"
            element={<Contact />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>

        <Route
          path="/admin/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <Navigate
              to="/admin"
              replace
            />
          }
        />

        <Route
          path="/admin"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="guests"
            element={
              <AdminPlaceholder title="Guests" />
            }
          />

          <Route
            path="properties"
            element={
              <AdminPlaceholder title="Properties" />
            }
          />

          <Route
            path="rooms"
            element={
              <AdminPlaceholder title="Rooms" />
            }
          />

          <Route
            path="bookings"
            element={
              <AdminPlaceholder title="Bookings" />
            }
          />

          <Route
            path="payments"
            element={
              <AdminPlaceholder title="Payments" />
            }
          />

          <Route
            path="reports"
            element={
              <AdminPlaceholder title="Reports" />
            }
          />

          <Route
            path="settings"
            element={
              <AdminPlaceholder title="Settings" />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;