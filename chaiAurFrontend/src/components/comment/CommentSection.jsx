import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentItem from "./CommentItem";

import {
  fetchComments,
  addComment,
  addCommentOptimistic,
  replaceTempComment,
  removeTempComment,
} from "../../features/comment/commentSlice";

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
    <div className="space-y-4">
      <p className="px-2 py-1 text-sm text-zinc-600 dark:text-zinc-400">
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </p>

      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={user ? "Add a comment..." : "Login to comment"}
          disabled={!user}
          rows={3}
          className="w-full rounded-2xl border border-zinc-200 bg-white p-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-700 dark:focus:ring-blue-950/50"
        />
        <button
          onClick={handleAddComment}
          disabled={!content.trim() || !user}
          className="mt-2 rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-500 dark:text-white dark:hover:bg-amber-400"
        >
          Post Comment
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      <div className="space-y-3">
        {loading && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading comments...</p>
        )}
        {!loading && comments.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No comments yet.</p>
        )}
        {comments.map((comment) => (
          <CommentItem key={comment._id} commentId={comment._id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default CommentSection;