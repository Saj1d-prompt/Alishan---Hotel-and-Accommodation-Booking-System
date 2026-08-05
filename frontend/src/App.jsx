import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";
import PublicLayout from "@/layouts/PublicLayout";

/*
 * Public pages
 */
import About from "@/pages/public/About";
import Booking from "@/pages/public/Booking";
import BookingStatus from "@/pages/public/BookingStatus";
import Contact from "@/pages/public/Contact";
import Home from "@/pages/public/Home";
import LocationDetails from "@/pages/public/LocationDetails";
import Locations from "@/pages/public/Locations";
import NotFound from "@/pages/public/NotFound";
import RoomDetails from "@/pages/public/RoomDetails";

/*
 * Authentication
 */
import Login from "@/pages/auth/Login";

/*
 * Admin pages
 */
import AdminPlaceholder from "@/pages/dashboard/AdminPlaceholder";
import Dashboard from "@/pages/dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*
         * Public website routes.
         *
         * PublicLayout renders:
         * - Navbar
         * - Outlet
         * - Footer
         */}
        <Route element={<PublicLayout />}>
          <Route
            index
            element={<Home />}
          />

          <Route
            path="locations"
            element={<Locations />}
          />

          <Route
            path="locations/:slug"
            element={<LocationDetails />}
          />

          {/*
           * The website uses a location-first flow.
           * A context-free Rooms page is therefore
           * redirected to Locations.
           */}
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

          {/*
           * Customer information and passport
           * submission page.
           */}
          <Route
            path="booking"
            element={<Booking />}
          />

          {/*
           * Secure no-login booking-status page.
           *
           * Example:
           * /booking/status/ALI-2026-ABC123
           *   ?token=secure-access-token
           */}
          <Route
            path="booking/status/:reference"
            element={<BookingStatus />}
          />

          <Route
            path="about"
            element={<About />}
          />

          <Route
            path="contact"
            element={<Contact />}
          />

          {/*
           * Public 404 page.
           * Keep this route last inside PublicLayout.
           */}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>

        {/*
         * Admin login.
         * This remains outside DashboardLayout.
         */}
        <Route
          path="/admin/login"
          element={<Login />}
        />

        {/*
         * Redirect the old dashboard URL.
         */}
        <Route
          path="/dashboard"
          element={
            <Navigate
              to="/admin"
              replace
            />
          }
        />

        {/*
         * Admin dashboard routes.
         *
         * Authentication protection will be added
         * when the Sanctum Admin login workflow is
         * connected.
         */}
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
              <AdminPlaceholder
                title="Guests"
              />
            }
          />

          <Route
            path="properties"
            element={
              <AdminPlaceholder
                title="Properties"
              />
            }
          />

          <Route
            path="rooms"
            element={
              <AdminPlaceholder
                title="Rooms"
              />
            }
          />

          <Route
            path="bookings"
            element={
              <AdminPlaceholder
                title="Bookings"
              />
            }
          />

          <Route
            path="payments"
            element={
              <AdminPlaceholder
                title="Payments"
              />
            }
          />

          <Route
            path="reports"
            element={
              <AdminPlaceholder
                title="Reports"
              />
            }
          />

          <Route
            path="settings"
            element={
              <AdminPlaceholder
                title="Settings"
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;