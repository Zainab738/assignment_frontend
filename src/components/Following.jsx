import React, { useEffect, useState } from "react";
import { userApi } from "../api";
import { useNavigate } from "react-router-dom";

function Following() {
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  const fetchFollowing = async () => {
    try {
      const res = await userApi.get("/following"); // backend endpoint
      setFollowing(res.data.following);
    } catch (err) {
      console.error("Failed to fetch following:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await userApi.post(`/unfollow/${userId}`);
      setFollowing((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Failed to unfollow:", err);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">People You Follow</h2>
      {following.length === 0 ? (
        <p className="text-gray-500">You're not following anyone yet</p>
      ) : (
        <ul className="space-y-3">
          {following.map((user) => (
            <li
              key={user._id}
              className="flex justify-between items-center p-3 border rounded-lg shadow-sm bg-white"
            >
              <span>{user.email}</span>
              <button
                onClick={() => handleUnfollow(user._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Unfollow
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Following;
