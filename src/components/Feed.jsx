import React, { useEffect, useState, useRef } from "react";
import { postApi, userApi } from "../api";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Trash2, Pencil } from "lucide-react";
import Following from "./Following";

function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [visibleComments, setVisibleComments] = useState({});
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);

  const dropdownRef = useRef(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await userApi.get("/me");
        setCurrentUserId(userRes.data._id);
        setFollowedUsers(userRes.data.following.map((u) => u.toString()));

        const feedRes = await postApi.get("/feed");
        setPosts(feedRes.data.posts);

        const myPostsRes = await postApi.get("/all");
        setMyPosts(
          myPostsRes.data.posts.filter((p) => p.user?._id === userRes.data._id)
        );
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUsers([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleLikeToggle = async (postId) => {
    try {
      const res = await postApi.post(`/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: res.data.likes } : p
        )
      );
      setMyPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: res.data.likes } : p
        )
      );
    } catch (err) {
      console.error("Like toggle failed:", err);
    }
  };

  const handleDeletePost = (postId) => navigate(`/deletepost/${postId}`);
  const handleEditPost = (postId) => navigate(`/editpost/${postId}`);

  const PostCard = ({ post, isMyPost }) => {
    const liked = post.likes?.includes(currentUserId);
    const [commentText, setCommentText] = useState("");

    const handleAddComment = async (e) => {
      e.preventDefault();
      if (!commentText.trim()) return;

      try {
        const res = await postApi.post(`/${post._id}/comment`, {
          text: commentText,
        });

        setPosts((prev) =>
          prev.map((p) =>
            p._id === post._id ? { ...p, comments: res.data.comments } : p
          )
        );
        setMyPosts((prev) =>
          prev.map((p) =>
            p._id === post._id ? { ...p, comments: res.data.comments } : p
          )
        );

        setCommentText(""); // clears input but keeps focus
      } catch (err) {
        console.error("Add comment failed:", err);
      }
    };

    return (
      <div className="rounded-2xl bg-[#fff5d7] shadow-md hover:shadow-xl transition border border-[#2E1828] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-b-[#2E1828]">
          <span className="font-semibold text-[#2E1828]">
            {post.user?.username || "Unknown"}
          </span>
          {isMyPost && (
            <div className="flex gap-3">
              <button
                onClick={() => handleEditPost(post._id)}
                className="text-[#2E1828] hover:text-blue-700 flex items-center gap-1"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDeletePost(post._id)}
                className="text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
        {/* media */}
        {post.media &&
          (post.mediaType === "video" ? (
            <video
              src={
                post.media.startsWith("http")
                  ? post.media
                  : `http://localhost:5000${post.media}`
              }
              controls
              className="w-full max-h-[500px] object-contain bg-black"
            />
          ) : (
            <img
              src={
                post.media.startsWith("http")
                  ? post.media
                  : `http://localhost:5000${post.media}`
              }
              alt={post.title}
              className="w-full max-h-[500px] object-contain bg-black"
            />
          ))}

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-lg text-[#2E1828] mb-2">
            {post.title}
          </h3>
          <p className="text-[#2E1828] mb-4">{post.content}</p>

          {/* Actions */}
          <div className="flex gap-6 mb-4 border-t border-t-[#2E1828] pt-3">
            <button
              onClick={() => handleLikeToggle(post._id)}
              className="flex items-center gap-2 text-[#2E1828] hover:text-red-500 transition"
            >
              <Heart
                size={22}
                className={liked ? "fill-red-500 text-red-500" : ""}
              />
              <span className="text-sm">{post.likes?.length || 0}</span>
            </button>

            <button
              onClick={() =>
                setVisibleComments((prev) => ({
                  ...prev,
                  [post._id]: !prev[post._id],
                }))
              }
              className="flex items-center gap-2 text-[#2E1828] hover:text-yellow-500 transition"
            >
              <MessageCircle size={22} />
              <span className="text-sm">{post.comments?.length || 0}</span>
            </button>
          </div>

          {/* Comments */}
          {visibleComments[post._id] && (
            <div className="mt-3 pt-3 space-y-2 rounded-lg p-3 border-t border-t-[#2E1828] bg-[#fff5d7]">
              {post.comments?.map((c) => (
                <p key={c._id} className="text-sm text-[#2E1828]">
                  <span className="font-semibold">
                    {c.user?.username || "Unknown"}
                  </span>
                  : {c.text}
                </p>
              ))}

              <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="border border-[#2E1828] rounded-full px-4 py-2 text-sm flex-1 
               focus:outline-none focus:ring-2 focus:ring-[#2E1828]"
                />

                {/* Submit button */}
                <button
                  type="submit"
                  className="bg-[#F26B72] text-white px-4 py-2 rounded-full text-sm hover:opacity-90 transition"
                >
                  Enter
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 lg:ml-64 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Center posts */}
      <div className="lg:col-span-2 space-y-12 max-w-2xl mx-auto lg:mx-0 w-full">
        {/* Mobile search on top */}
        <div className="lg:hidden mb-4 relative">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={handleSearch}
            className="w-full border border-[#2E1828] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E1828]"
          />
          {users.length > 0 && (
            <div
              ref={dropdownRef}
              className="bg-[#fff5d7] absolute top-full left-0 right-0 mt-1 border border-[#2E1828] rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
            >
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <span>{user.username}</span>
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
                      className="bg-[#F26B72] text-white px-3 py-1 rounded "
                    >
                      Follow
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Heading, button, search (desktop) */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3 relative">
          <h2 className="text-2xl font-bold text-[#2E1828] flex-shrink-0">
            My Posts
          </h2>
          <button
            onClick={() => navigate("/createpost")}
            className="bg-[#F26B72] text-white px-6 py-2 rounded-full shadow-md hover:opacity-90 transition flex-shrink-0"
          >
            + Create Post
          </button>
          <div className="hidden lg:block flex-1 relative">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={handleSearch}
              className="w-full border border-[#2E1828] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E1828]"
            />
            {users.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 border border-[#2E1828] rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
              >
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center p-2  cursor-pointer"
                  >
                    <span>{user.username}</span>
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
                        className="bg-[#F26B72] text-white px-3 py-1 rounded "
                      >
                        Follow
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My posts */}
        {myPosts.length === 0 ? (
          <p className="text-[#2E1828] italic">
            You haven’t posted anything yet.
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            {myPosts.map((post) => (
              <PostCard key={post._id} post={post} isMyPost />
            ))}
          </div>
        )}

        {/* Feed posts */}
        <h2 className="text-2xl font-bold text-[#2E1828] mt-12 mb-4">
          Your Feed
        </h2>
        <div className="flex flex-col gap-10">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
      {/* rightside */}
      <div className="hidden [@media(min-width:1124px)]:block [@media(min-width:1124px)]:col-span-1 [&>div]:p-0">
        <Following />
      </div>
    </div>
  );
}

export default Feed;
