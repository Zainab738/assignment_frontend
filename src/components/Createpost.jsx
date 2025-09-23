import React, { useState } from "react";
import { postApi } from "../api";

function Createpost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await postApi.post("/create", formData);
      console.log("Post created:", res.data);
      alert("Post created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create post");
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
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 rounded"
          accept="image/*"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}

export default Createpost;
