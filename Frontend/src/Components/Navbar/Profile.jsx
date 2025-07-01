import React, { useContext, useState, useRef, useEffect } from "react";
import { RiLogoutBoxRLine, RiUserLine, RiSettings3Line } from "react-icons/ri";
import { AuthContext } from "../Authentication/AuthProvider";
import axios from "axios";

const Profile = () => {
  const { user, logOut, setUser } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUpdateProfilePicture = async () => {
    if (!newImageUrl) return;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}`,
        {
          displayName: user.displayName,
          email: user.email,
          imageUrl: newImageUrl,
        }
      );
      setUser(response.data);
      setNewImageUrl("");
      setIsModalOpen(false);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture");
    }
  };

  const handleLogout = () => {
    logOut()
      .then(() => {
        setIsDropdownOpen(false);
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button - Icon Only */}
      <button
        onClick={toggleDropdown}
        className="flex items-center p-2 rounded-xl hover:bg-green-light hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-primary/50"
        title={user?.displayName || user?.name || "User Profile"}
      >
        <div className="relative">
          <img
            src={user?.photoURL || user?.imageUrl || "https://i.ibb.co/hV2QhsG/default-avatar.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-green-primary/20 hover:border-green-primary transition-colors duration-300 shadow-lg hover:shadow-xl"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-primary rounded-full border-2 border-white animate-pulse"></div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in">
          {/* Profile Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src={user?.photoURL || user?.imageUrl || "https://i.ibb.co/hV2QhsG/default-avatar.png"}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-green-primary/20"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 font-exo">
                  {user?.displayName || user?.name || "User"}
                </h3>
                <p className="text-sm text-gray-500 font-poppins">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-green-light rounded-lg transition-colors duration-200"
            >
              <RiSettings3Line className="text-lg text-green-primary" />
              <span className="font-medium">Update Profile Picture</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-light rounded-lg transition-colors duration-200"
            >
              <RiLogoutBoxRLine className="text-lg" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Update Profile Picture Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-800 mb-4 font-exo">
              Update Profile Picture
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Image URL
                </label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Enter new image URL"
                  className="input-field w-full"
                />
              </div>

              {newImageUrl && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-green-primary/20"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewImageUrl("");
                  }}
                  className="btn-outline-gray flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfilePicture}
                  disabled={!newImageUrl}
                  className="btn-green-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;