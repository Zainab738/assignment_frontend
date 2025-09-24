import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postApi, userApi } from "../api";

function Profile() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [visibleComments, setVisibleComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userRes = await userApi.get("/me");
        setCurrentUserId(userRes.data._id);

        const postsRes = await postApi.get("/all");
        setPosts(postsRes.data.posts);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Toggle Like / Unlike
  const handleLikeToggle = async (postId) => {
    try {
      const res = await postApi.post(`/${postId}/like`); // backend handles toggle
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
      console.error("Comment failed:", err);
    }
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
            onClick={() => navigate("/feed")}
          >
            Feed
          </button>
          <button
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
            onClick={() => navigate("/followers")}
          >
            Followers
          </button>
          <button
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
            onClick={() => navigate("/following")}
          >
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
                  <h3 className="font-bold text-xl mb-2 text-gray-800">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-3 flex-grow">{post.content}</p>

                  {/* Like & Comment buttons */}
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
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
                      type="button"
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

                  {/* Edit / Delete buttons */}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => navigate(`/editpost/${post._id}`)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition flex-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/deletepost/${post._id}`)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Profile;
