import React, { useState } from "react";
import ForumPost from "../components/Forumpost";
import "../styles/Forum.css"; // Assuming you have a CSS file for styling
const Forum = () => {
  const [posts, setPosts] = useState([
    { username: "Gayathri", title: "My Hibiscus Plant is Drooping!", content: "Any idea why this is happening?" }
  ]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePost = (e) => {
    e.preventDefault();
    const newPost = {
      username: "Anonymous", // Replace with logged-in user in future
      title,
      content,
    };
    setPosts([newPost, ...posts]); // Add new post to top
    setTitle("");
    setContent("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🌿 Community Forum</h1>

      <form onSubmit={handlePost}>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="What's your question or experience?"
          className="border p-2 w-full mb-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          Post
        </button>
      </form>

      <div className="mt-6">
        {posts.map((post, index) => (
          <ForumPost key={index} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Forum;