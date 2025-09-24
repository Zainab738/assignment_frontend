import React, { useEffect, useState } from "react";
import { userApi } from "../api";
import { useNavigate } from "react-router-dom";

function Followers() {
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await userApi.get("/followers"); // backend endpoint
        setFollowers(res.data.followers);
      } catch (err) {
        console.error("Failed to fetch followers:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchFollowers();
  }, [navigate]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Followers</h2>
      {followers.length === 0 ? (
        <p className="text-gray-500">No followers yet</p>
      ) : (
        <ul className="space-y-3">
          {followers.map((user) => (
            <li
              key={user._id}
              className="flex justify-between items-center p-3 border rounded-lg shadow-sm bg-white"
            >
              <span>{user.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Followers;
