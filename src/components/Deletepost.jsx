import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postApi } from "../api";

function DeletePost() {
  const { id } = useParams(); // get post id from URL
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await postApi.delete(`/delete/${id}`);
      alert("Post deleted successfully!");
      navigate("/profile"); // go back to profile after delete
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post");
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
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeletePost;
