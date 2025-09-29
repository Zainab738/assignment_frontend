import React, { useState } from "react";
import { postApi } from "../api";
import { useNavigate } from "react-router-dom";

function Createpost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null); // image or video
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // success/error
  const [isError, setIsError] = useState(false); // track error or success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (media) {
      formData.append("media", media); // updated to media
    }

    try {
      const res = await postApi.post("/create", formData);
      console.log("Post created:", res.data);
      setIsError(false);
      setMessage(res.data.message || "Post created successfully!");
      setTitle(""); // clear fields
      setContent("");
      setMedia(null);
      // delay so message can show
      setTimeout(() => navigate("/feed"), 1200);
    } catch (err) {
      console.error("Post creation error:", err);
      setIsError(true);
      const backendMsg =
        err.response?.data?.error || err.response?.data?.message;
      setMessage(backendMsg || "Post creation failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded"
          rows="4"
          required
        />
        <input
          type="file"
          onChange={(e) => setMedia(e.target.files[0])}
          className="border p-2 rounded"
          accept="image/*,video/*" // supports images and videos
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`p-2 rounded text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#F26B72] hover:bg-[#e55a61]"
          }`}
        >
          {isLoading ? "Creating..." : "Create Post"}
        </button>

        {/* Loader */}
        {isLoading && (
          <div className="flex justify-center mt-2">
            <div className="w-6 h-6 border-4 border-t-transparent border-[#F26B72] rounded-full animate-spin"></div>
          </div>
        )}

        {/* Message area */}
        {message && (
          <p
            className={`mt-2 text-center font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Createpost;
