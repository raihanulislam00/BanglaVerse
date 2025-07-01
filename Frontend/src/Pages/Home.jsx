import { Outlet } from "react-router";
import Navbar from "../Components/Navbar/Navbar";

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-light/30 via-white to-red-light/30">
            <Navbar />
            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default Home;