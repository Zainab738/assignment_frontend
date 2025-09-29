import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postApi } from "../api";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null); // new file if user picks one
  const [previewMedia, setPreviewMedia] = useState(""); // shows preview

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  // fetch existing post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postApi.get(`/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        setPreviewMedia(res.data.image || res.data.video || ""); // updated
      } catch (err) {
        console.error("Fetch Error:", err);
        setIsError(true);
        const backendMsg =
          err.response?.data?.error || err.response?.data?.message;
        setMessage(backendMsg || "Failed to fetch post");
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (media) {
      formData.append("media", media); // supports image or video
    }

    try {
      const res = await postApi.patch(`/update/${id}`, formData);
      setIsError(false);
      setMessage(res.data?.message || "Post updated successfully!");
      setTimeout(() => navigate("/feed"), 1200);
    } catch (err) {
      console.error("Failed to update post:", err);
      setIsError(true);
      setMessage(err.response?.data?.error || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleUpdate} className="flex flex-col gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded"
          rows="4"
          required
        />

        {/* Preview section */}
        {previewMedia && (
          <div className="mb-2">
            <p className="text-gray-600 text-sm mb-1">Preview:</p>
            {previewMedia.endsWith(".mp4") || previewMedia.endsWith(".mov") ? (
              <video
                src={previewMedia}
                controls
                className="w-full h-40 object-cover rounded"
              />
            ) : (
              <img
                src={previewMedia}
                alt="Preview"
                className="w-full h-40 object-cover rounded"
              />
            )}
          </div>
        )}

        {/* File input */}
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            setMedia(file);
            if (file) {
              setPreviewMedia(URL.createObjectURL(file));
            }
          }}
          className="border p-2 rounded"
          accept="image/*,video/*" // support images/videos
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
          {isLoading ? "Updating..." : "Update Post"}
        </button>

        {/* Loader */}
        {isLoading && (
          <div className="flex justify-center mt-2">
            <div className="w-6 h-6 border-4 border-t-transparent border-[#F26B72] rounded-full animate-spin"></div>
          </div>
        )}

        {/* Message */}
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

export default EditPost;
