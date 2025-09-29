import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api";

function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState(null);

  // states for updating
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You need to login to view your profile.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      try {
        const userRes = await userApi.get("/me");
        setCurrentUser(userRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);

        if (err.response?.status === 401) {
          setMessage("Session expired. Redirecting to login...");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 1500);
        } else {
          setMessage("Failed to load profile. Please try again.");
        }
      }
    };
    fetchData();
  }, [navigate]);

  // Update username handler
  const handleUpdateUsername = async () => {
    try {
      const res = await userApi.put("/update-username", {
        username: newUsername,
      });
      setMessage(res.data.message);
      setCurrentUser(res.data.user);
      setNewUsername("");
    } catch (err) {
      console.error("Update username failed:", err);
      setMessage(err.response?.data?.message || "Failed to update username");
    }
  };

  // Update password handler
  const handleUpdatePassword = async () => {
    try {
      const res = await userApi.put("/update-password", {
        oldPassword,
        newPassword,
      });
      setMessage(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Update password failed:", err);
      setMessage(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="lg:ml-64 p-6">
      <div className="flex flex-col items-start gap-6">
        <h2 className="text-xl font-bold text-[#2E1828]">Profile</h2>

        {message && <p className="text-red-600 font-medium">{message}</p>}

        {currentUser ? (
          <div>
            <p className="text-[#2E1828] font-medium">
              Username: {currentUser.username}
            </p>
            <p className="text-[#2E1828] font-medium">
              Email: {currentUser.email}
            </p>
          </div>
        ) : !message ? (
          <p className="text-gray-500 italic">Loading...</p>
        ) : null}

        {/* Update Username */}
        <div>
          <h1 className="font-semibold text-[#2E1828]">Update Username</h1>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter new username"
            className="border rounded p-2 mt-2 mr-2"
          />
          <button
            onClick={handleUpdateUsername}
            className="bg-[#F26B72] text-white px-4 py-2 rounded "
          >
            Update
          </button>
        </div>

        {/* Update Password */}
        <div>
          <h1 className=" font-semibold text-[#2E1828]">Update Password</h1>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
            className="border rounded p-2 mt-2 block"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="border rounded p-2 mt-2 block"
          />
          <button
            onClick={handleUpdatePassword}
            className="bg-[#F26B72] text-white px-4 py-2 rounded mt-2 "
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
