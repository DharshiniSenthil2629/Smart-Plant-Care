import React, { useState } from "react";
import "../styles/Forum.css"; // Assuming you have a CSS file for styling
const ForumPost = ({ post }) => {
  const [replies, setReplies] = useState([]);
  const [replyInput, setReplyInput] = useState("");

  const handleReply = () => {
    if (replyInput.trim() !== "") {
      setReplies([...replies, replyInput]);
      setReplyInput("");
    }
  };

  return (
    <div className="border rounded p-4 mb-4 bg-white shadow-md">
      <h2 className="font-bold text-lg">{post.title}</h2>
      <p className="text-gray-700">{post.content}</p>
      <p className="text-sm text-gray-500 mt-1">Posted by: {post.username}</p>

      {/* Replies Section */}
      <div className="mt-4">
        <input
          className="border p-1 w-full mb-2"
          placeholder="Type your reply..."
          value={replyInput}
          onChange={(e) => setReplyInput(e.target.value)}
        />
        <button
          onClick={handleReply}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Reply
        </button>

        {replies.length > 0 && (
          <div className="mt-3">
            <p className="font-semibold">Replies:</p>
            {replies.map((reply, index) => (
              <div key={index} className="border-l-2 pl-2 text-gray-800 mt-1">
                👉 {reply}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPost;