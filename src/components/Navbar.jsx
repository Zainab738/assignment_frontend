import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icons

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      {/* Top Bar (Mobile Only) */}
      <div className="lg:hidden flex justify-between items-center bg-[#fff5d7] p-4 shadow-md">
        <h1
          onClick={() => navigate("/feed")}
          className="font-bold text-xl tracking-wide cursor-pointer"
        >
          Social Media
        </h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <nav
        className={`fixed top-0 left-0 h-screen w-64 bg-[#fff5d7] text-[#2E1828] shadow-lg p-6 transform z-50 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        {/* Top Section */}
        <div>
          <h1
            onClick={() => navigate("/feed")}
            className="hidden lg:block font-bold text-2xl tracking-wide cursor-pointer mb-10"
          >
            Social Media
          </h1>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-6">
            <button
              onClick={() => navigate("/profile")}
              className="hover:text-[#F26B72] transition duration-200 font-medium text-left"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/feed")}
              className="hover:text-[#F26B72] transition duration-200 font-medium text-left"
            >
              Feed
            </button>
            <button
              onClick={() => navigate("/followers")}
              className="hover:text-[#F26B72] transition duration-200 font-medium text-left"
            >
              Followers
            </button>
            <button
              onClick={() => navigate("/following")}
              className="hover:text-[#F26B72] transition duration-200 font-medium text-left"
            >
              Following
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#F26B72] w-full py-2 rounded-lg shadow font-semibold text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
