import { Outlet } from "react-router-dom";
import Navbar from "../components/public/Navbar";

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default PublicLayout;