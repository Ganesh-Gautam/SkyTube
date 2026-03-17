import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentItem from "./CommentItem";

import {
  fetchComments,
  addComment,
  addCommentOptimistic,
  replaceTempComment,
  removeTempComment,
} from "../features/comment/commentSlice";

function CommentSection({ videoId }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.user?.user);
  const comments = useSelector((state) => state.comments.items);
  const loading = useSelector((state) => state.comments.loading);
  const error = useSelector((state) => state.comments.error);

  const [content, setContent] = useState("");

  useEffect(() => {
    if (videoId) {
      dispatch(fetchComments(videoId));
    }
  }, [videoId, dispatch]);

  const handleAddComment = async () => {
    if (!content.trim() || !user) return;

    const optimisticAction = dispatch(
      addCommentOptimistic({
        content,
        user,
      })
    );

    const tempId = optimisticAction.payload._id;

    try {
      const newComment = await dispatch(
        addComment({
          videoId,
          content,
          parent: null,
        })
      ).unwrap();
      dispatch(replaceTempComment({ tempId, newComment }))

      setContent("");
    } catch (error) {
      dispatch(removeTempComment(tempId));
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="comment-section max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <p className="text-gray-700 px-2 py-1">{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</p>
      {/* Add Comment */}
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={user ? "Add a comment..." : "Login to comment"}
          disabled={!user}
          rows={3}
          className="w-full p-3 border rounded"
        />

        <button
          onClick={handleAddComment}
          disabled={!content.trim() || !user}
          className="mt-2 px-4 py-2 bg-amber-300 rounded"
        >
          Post Comment
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">

        {loading && <p>Loading comments...</p>}

        {!loading && comments.length === 0 && (
          <p>No comments yet</p>
        )}

        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            commentId={comment._id}
            user={user}
          />
        ))}

      </div>
    </div>
  );
}

export default CommentSection;