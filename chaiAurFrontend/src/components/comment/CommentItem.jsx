import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Add useSelector

import {
  updateComment,
  deleteComment,
  toggleCommentLike,
  toggleLikeOptimistic,
} from "../../features/comment/commentSlice";

function CommentItem({ commentId, user }) { 

  const dispatch = useDispatch();
  
  const comment = useSelector(state => 
    state.comments.items.find(c => c._id === commentId)
  );

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  if (!comment) return null;

  const handleStartEdit = () => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleEditComment = async () => {
    if (!editContent.trim()) return;

    try {
      await dispatch(
        updateComment({
          commentId: comment._id,
          content: editContent,
        })
      ).unwrap();

      setEditingCommentId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async () => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await dispatch(deleteComment(comment._id)).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = () => {
    dispatch(toggleLikeOptimistic(comment._id));
    dispatch(toggleCommentLike(comment._id));
  };

  return (
    <div className={`rounded-2xl border border-zinc-100 bg-zinc-50 p-4 transition dark:border-zinc-800 dark:bg-zinc-800/50 ${comment.isTemp ? "opacity-50" : ""}`}>

      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <img
          src={comment.owner?.avatar}
          alt={comment.owner?.userName}
          width="35"
          height="35"
          className="rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {comment.owner?.userName}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
        {comment.isTemp && (
          <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
            Posting...
          </span>
        )}
      </div>

      {/* Edit mode */}
      {editingCommentId === comment._id ? (
        <div className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-zinc-200 bg-white p-2 text-sm text-zinc-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleEditComment}
              className="rounded-full bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-600 dark:hover:bg-blue-400"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="rounded-full border border-zinc-300 bg-white px-4 py-1.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-1 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
            {comment.content}
          </p>

          <div className="mt-3 flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm transition ${
                comment.isLiked
                  ? "text-rose-500 dark:text-rose-400"
                  : "text-zinc-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400"
              }`}
            >
              <span>{comment.isLiked ? "❤️" : "🤍"}</span>
              <span>{comment.likeCount || 0}</span>
            </button>

            {/* Edit / Delete — owner only */}
            {user?._id === comment.owner?._id && !comment.isTemp && (
              <>
                <button
                  onClick={handleStartEdit}
                  className="text-sm font-medium text-blue-600 transition hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteComment}
                  className="text-sm font-medium text-red-500 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CommentItem;