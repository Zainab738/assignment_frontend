import React, { useEffect, useState } from "react";
import { postApi, userApi } from "../api";
import { useNavigate } from "react-router-dom";

function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [visibleComments, setVisibleComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await userApi.get("/me");
        setCurrentUserId(userRes.data._id);
        setFollowedUsers(userRes.data.following.map((u) => u.toString()));

        const feedRes = await postApi.get("/feed");
        setPosts(feedRes.data.posts);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [navigate]);

  // Search users
  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim() === "") return setUsers([]);

    try {
      const res = await userApi.get(`/search?q=${e.target.value}`);
      setUsers(res.data.users);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  // Follow / Unfollow
  const handleFollow = async (userId) => {
    try {
      await userApi.post(`/follow/${userId}`);
      setFollowedUsers((prev) => [...prev, userId]);
    } catch (err) {
      console.error("Follow failed:", err);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await userApi.post(`/unfollow/${userId}`);
      setFollowedUsers((prev) => prev.filter((id) => id !== userId));
    } catch (err) {
      console.error("Unfollow failed:", err);
    }
  };

  // Toggle Like / Unlike
  const handleLikeToggle = async (postId) => {
    try {
      const res = await postApi.post(`/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: res.data.likes } : p
        )
      );
    } catch (err) {
      console.error("Like toggle failed:", err);
    }
  };

  // Add comment
  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    try {
      const res = await postApi.post(`/${postId}/comment`, { text });
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: res.data.comments } : p
        )
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Add comment failed:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top Buttons */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-2">
        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Profile
        </button>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={handleSearch}
        className="w-full p-3 border rounded-lg mb-6"
      />

      {/* Search results */}
      {users.length > 0 && (
        <div className="mb-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center p-2 border-b"
            >
              <span>{user.email}</span>
              {followedUsers.includes(user._id) ? (
                <button
                  onClick={() => handleUnfollow(user._id)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => handleFollow(user._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  Follow
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Feed posts */}
      <h2 className="text-2xl font-bold mb-4">Your Feed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const liked = post.likes?.includes(currentUserId);
          return (
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
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-3 flex-grow">{post.content}</p>
                <p className="text-sm text-gray-400 mb-2">
                  By: {post.user?.email || "Unknown"}
                </p>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => handleLikeToggle(post._id)}
                    className={`px-3 py-1 rounded flex-1 transition ${
                      liked
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : " bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {liked ? "Unlike" : "Like"} ({post.likes?.length || 0})
                  </button>
                  <button
                    onClick={() =>
                      setVisibleComments((prev) => ({
                        ...prev,
                        [post._id]: !prev[post._id],
                      }))
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition flex-1"
                  >
                    Comment ({post.comments?.length || 0})
                  </button>
                </div>

                {/* Comments section */}
                {visibleComments[post._id] && (
                  <div className="mt-2 border-t pt-2">
                    {post.comments?.map((c) => (
                      <p key={c._id} className="text-sm text-gray-600">
                        {c.text} — by {c.user?.email || "Unknown"}
                      </p>
                    ))}
                    <form onSubmit={(e) => handleAddComment(e, post._id)}>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInputs[post._id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post._id]: e.target.value,
                          }))
                        }
                        className="border p-1 rounded w-full mt-1"
                      />
                    </form>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Feed;
