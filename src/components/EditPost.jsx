import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postApi } from "../api";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // new file if user picks one
  const [previewImage, setPreviewImage] = useState(""); // shows preview

  // fetch existing post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postApi.get(`/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        setPreviewImage(res.data.image);
      } catch (err) {
        console.error("Failed to load post:", err);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image); // only add if new image is selected
    }

    try {
      await postApi.patch(`/update/${id}`, formData);
      alert("Post updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Failed to update post:", err);
      alert("Update failed");
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

        {/* preview section */}
        {previewImage && (
          <div className="mb-2">
            <p className="text-gray-600 text-sm mb-1">Preview:</p>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-40 object-cover rounded"
            />
          </div>
        )}

        {/* file input */}
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);
            if (file) {
              setPreviewImage(URL.createObjectURL(file)); // new preview
            }
          }}
          className="border p-2 rounded"
          accept="image/*"
        />

        <button
          type="submit"
          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;
