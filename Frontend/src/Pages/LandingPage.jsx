import Banner from "../Components/Banner/Banner";
import Navbar from "../Components/Navbar/Navbar";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-light via-white to-red-light">
            <div className="flex">
                <Navbar />
                <Banner />
            </div>
        </div>
    );
};

export default LandingPage;