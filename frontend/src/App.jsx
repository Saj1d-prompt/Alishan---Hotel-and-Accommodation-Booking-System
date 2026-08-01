import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";

import Home from "./pages/public/Home";
import Locations from "@/pages/public/Locations";
import LocationDetails from "@/pages/public/LocationDetails";
import Rooms from "@/pages/public/Rooms";
import RoomDetails from "@/pages/public/RoomDetails";
import Booking from "@/pages/public/Booking";
import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";
function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route element={<PublicLayout />}>

                    <Route path="/" element={<Home />} />

                    <Route path="/locations" element={<Locations />} />

                    <Route path="/locations/:slug" element={<LocationDetails />} />

                    <Route path="/rooms" element={<Rooms />} />

                    <Route path="/rooms/:id" element={<RoomDetails />} />

                    <Route path="/booking" element={<Booking />} />

                    <Route path="/about" element={<About />} />

                    <Route path="/contact" element={<Contact />} />

                    <Route
                        path="/rooms"
                        element={<Rooms />}
                    />

                    <Route
                        path="/rooms/:slug"
                        element={<RoomDetails />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;