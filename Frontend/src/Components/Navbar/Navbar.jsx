import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { GoHomeFill } from "react-icons/go";
import { BiTransfer } from "react-icons/bi";
import { BsChatDotsFill } from "react-icons/bs";
import { MdEditDocument, MdAdminPanelSettings, MdDashboard, MdMenu, MdClose } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import { RiQuillPenFill } from "react-icons/ri";
import { BiData } from "react-icons/bi";
import { AuthContext } from '../Authentication/AuthProvider';
import Profile from "./Profile";
import BanglaVerseNavLogo from '../Logo/BanglaVerseNavLogo';

const Navbar = () => {
    const { user, logOut, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location]);

    const handleAuthClick = () => {
        if (user) {
            logOut()
                .then(() => {
                    window.location.reload();
                })
                .catch((error) => console.error(error));
        } else {
            navigate("/sign-in");
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const NavItem = ({ to, icon, text, mobile = false }) => (
        <NavLink 
            to={to}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
            className={({ isActive }) => 
                  `nav-link group relative flex items-center ${mobile ? 'gap-3 px-4 py-3' : 'justify-center p-4'} rounded-xl transition-all duration-300 ease-in-out font-exo font-medium overflow-hidden
                ${mobile ? 
                    `hover:bg-gradient-to-r hover:from-green-light hover:to-red-light/20 ${isActive ? 'bg-gradient-to-r from-green-light to-red-light/20 text-green-dark border-l-4 border-green-primary shadow-lg' : 'text-gray-700'}` :
                    `hover:bg-gradient-to-r hover:from-green-light/30 hover:to-red-light/20 hover:shadow-lg hover:scale-110 ${isActive ? 'nav-link-active bg-gradient-to-r from-green-light/50 to-red-light/30 shadow-lg scale-110' : 'text-gray-700'}`
                }`
            }
            title={!mobile ? text : undefined}
        >
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-primary/10 to-green-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            
            <span className={`relative z-10 ${mobile ? 'text-lg' : 'text-2xl'} transition-all duration-300 group-hover:scale-125 group-hover:rotate-6 ${mobile ? '' : 'group-hover:text-green-primary'}`}>
                {icon}
            </span>
            {mobile && (
                <span className={`relative z-10 text-sm font-semibold transition-all duration-300`}>
                    {text}
                </span>
            )}
            
            {/* Active Indicator for Desktop */}
            {!mobile && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-red-primary to-green-primary rounded-full transition-all duration-300 group-hover:w-full"></div>
            )}
        </NavLink>
    );

    return (
        <>
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gradient-to-r from-red-primary/20 via-transparent to-green-primary/20 shadow-2xl">
                {/* Gradient Background Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-primary/5 via-transparent to-green-primary/5"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Enhanced Logo Section - BanglaVerse Branding */}
                        <NavLink to="/" className="group flex items-center transition-all duration-500 hover:scale-105 relative px-4 py-2">
                            {/* Animated Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-primary/10 to-green-primary/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                            
                            <div className="relative">
                                <BanglaVerseNavLogo size={50} />
                                {/* Floating accent dot */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-accent-gold to-red-secondary rounded-full animate-bounce-gentle shadow-lg"></div>
                            </div>
                        </NavLink>

                        {/* Enhanced Desktop Navigation Links - Icon Only */}
                        <div className="hidden md:flex items-center space-x-2">
                            <NavItem 
                                to="/home/banner" 
                                icon={<GoHomeFill />} 
                                text="Home" 
                            />
                            
                            {user && (
                                <>
                                    <NavItem 
                                        to="/home/translate" 
                                        icon={<BiTransfer />} 
                                        text="Translator" 
                                    />
                                    <NavItem 
                                        to="/home/chat" 
                                        icon={<BsChatDotsFill />} 
                                        text="AI Chat" 
                                    />
                                    <NavItem 
                                        to="/home/documents" 
                                        icon={<MdEditDocument />} 
                                        text="Documents" 
                                    />
                                    <NavItem 
                                        to="/home/dataset" 
                                        icon={<BiData />} 
                                        text="Dataset" 
                                    />
                                    <NavItem 
                                        to="/home/stories" 
                                        icon={<IoBookSharp />} 
                                        text="Stories" 
                                    />
                                    <NavItem 
                                        to="/home/writers" 
                                        icon={<RiQuillPenFill />} 
                                        text="Writers" 
                                    />
                                    {user?.email === 'admin@gmail.com' && (
                                        <NavItem 
                                            to="/home/admin-dashboard" 
                                            icon={<MdAdminPanelSettings />} 
                                            text="Admin" 
                                        />
                                    )}
                                    <NavItem 
                                        to="/home/dashboard" 
                                        icon={<MdDashboard />} 
                                        text="Dashboard" 
                                    />
                                </>
                            )}
                        </div>

                        {/* Enhanced User Profile & Auth Section */}
                        <div className="flex items-center gap-4">
                            {user ? (
                                <Profile />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <NavLink
                                        to="/sign-in"
                                        className="group relative px-4 py-2 text-sm font-medium text-green-primary border-2 border-green-primary rounded-xl hover:bg-green-primary hover:text-white transition-all duration-300 overflow-hidden"
                                    >
                                        <span className="relative z-10">Sign In</span>
                                        <div className="absolute inset-0 bg-green-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                    </NavLink>
                                    <NavLink
                                        to="/sign-up"
                                        className="group relative px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-primary to-red-secondary rounded-xl hover:from-red-secondary hover:to-red-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                                    >
                                        <span className="relative z-10">Sign Up</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-secondary to-red-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </NavLink>
                                </div>
                            )}

                            {/* Enhanced Mobile menu button */}
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden relative p-3 rounded-xl text-gray-600 hover:text-white bg-gradient-to-r from-transparent to-transparent hover:from-green-primary hover:to-red-primary transition-all duration-300 hover:shadow-lg group"
                            >
                                <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                                    {isMobileMenuOpen ? <MdClose className="h-6 w-6" /> : <MdMenu className="h-6 w-6" />}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gradient-to-r from-red-primary/20 via-transparent to-green-primary/20 bg-white/95 backdrop-blur-xl shadow-xl">
                        <div className="px-6 py-6 space-y-3">
                            <NavItem 
                                to="/home/banner" 
                                icon={<GoHomeFill />} 
                                text="Home"
                                mobile={true}
                            />
                            
                            {user && (
                                <>
                                    <NavItem 
                                        to="/home/translate" 
                                        icon={<BiTransfer />} 
                                        text="Translator"
                                        mobile={true}
                                    />
                                    <NavItem 
                                        to="/home/chat" 
                                        icon={<BsChatDotsFill />} 
                                        text="AI Chat"
                                        mobile={true}
                                    />
                                    <NavItem 
                                        to="/home/documents" 
                                        icon={<MdEditDocument />} 
                                        text="Documents"
                                        mobile={true}
                                    />
                                    <NavItem 
                                        to="/home/dataset" 
                                        icon={<BiData />} 
                                        text="Dataset"
                                        mobile={true}
                                    />
                                    <NavItem 
                                        to="/home/stories" 
                                        icon={<IoBookSharp />} 
                                        text="Stories"
                                        mobile={true}
                                    />
                                    <NavItem 
                                        to="/home/writers" 
                                        icon={<RiQuillPenFill />} 
                                        text="Writers"
                                        mobile={true}
                                    />
                                    {user?.email === 'admin@gmail.com' && (
                                        <NavItem 
                                            to="/home/admin-dashboard" 
                                            icon={<MdAdminPanelSettings />} 
                                            text="Admin"
                                            mobile={true}
                                        />
                                    )}
                                    <NavItem 
                                        to="/home/dashboard" 
                                        icon={<MdDashboard />} 
                                        text="Dashboard"
                                        mobile={true}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Spacer to prevent content from hiding behind fixed navbar */}
            <div className="h-20"></div>
        </>
    );
};

export default Navbar;