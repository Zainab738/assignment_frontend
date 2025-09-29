import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postApi } from "../api";

function DeletePost() {
  const { id } = useParams(); // get post id from URL
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); //err success msgs
  const [isError, setIsError] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await postApi.delete(`/delete/${id}`);
      setIsError(false);
      setMessage(res.data?.message || "Post deleted successfully!");
      setTimeout(() => navigate("/feed"), 1200); // delay so msgg can show
    } catch (err) {
      console.error("Login Error:", err);
      setIsError(true);
      // Try to pull message from backend first
      const backendMsg =
        err.response?.data?.error || err.response?.data?.message;

      setMessage(backendMsg || "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-xl font-bold">
        Are you sure you want to delete this post?
      </h2>
      <div className="space-x-4">
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className={`px-4 py-2 rounded text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#F26B72] hover:bg-[#e55a61]"
          }`}
        >
          {isLoading ? "Deleting..." : "Yes, Delete"}
        </button>
        <button
          onClick={() => navigate("/feed")}
          disabled={isLoading}
          className={`px-4 py-2 rounded ${
            isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Cancel
        </button>
      </div>

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
    </div>
  );
}

export default DeletePost;
