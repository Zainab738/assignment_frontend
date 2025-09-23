import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postApi } from "../api";

function Profile() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await postApi.get("/all");
        setPosts(res.data.posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        if (error.response && error.response.status === 401) {
          alert("Session expired, please log in again");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchPosts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top Buttons */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-2">
        <button
          onClick={() => navigate("/createpost")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          + Create Post
        </button>
        <div className="flex gap-2 flex-wrap">
          <button
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
            onClick={() => {
              navigate("/feed");
            }}
          >
            Feed
          </button>
          <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition">
            Followers
          </button>
          <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition">
            Following
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">
          No posts yet. Create your first post!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition bg-white flex flex-col"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-xl mb-2 text-gray-800">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">{post.content}</p>
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => navigate(`/deletepost/${post._id}`)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition flex-1"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/editpost/${post._id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition flex-1"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
