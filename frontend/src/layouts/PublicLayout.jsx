import {
  Outlet,
} from "react-router-dom";

import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import ScrollToTop from "@/components/public/ScrollToTop";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />

      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;