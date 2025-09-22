import React, { useEffect, useState } from "react";
import { userApi, postApi } from "../api";

// Users
userApi
  .get("/users")
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));

// Posts
postApi
  .get("/")
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));

function Profile() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/posts", {
        headers: { Authorization: `Bearer ${token}` }, // send token
      })
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-white">Loading posts...</p>;

  return (
    <div className="flex flex-col items-center justify-start bg-gray-800 w-1/2 space-y-4 p-4 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-white mb-4">All Posts</h2>

      {posts.length === 0 ? (
        <p className="text-gray-300">No posts available</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="flex flex-col items-center bg-gray-600 p-4 rounded-lg w-full space-y-2"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-40 h-40 object-cover rounded-md"
            />
            <div className="text-lg font-semibold text-white">{post.title}</div>
            <div className="text-gray-200">{post.content}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;
