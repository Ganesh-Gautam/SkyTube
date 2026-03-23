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
    <div
      className={`p-3 ${
        comment.isTemp ? "opacity-50" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-2">
        <img
          src={comment.owner?.avatar}
          alt={comment.owner?.userName}
          width="35"
          className="rounded-full"
        />

        <div>
          <strong>{comment.owner?.userName}</strong>
          <p className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>

        {comment.isTemp && (
          <span className="ml-auto text-xs text-gray-400">
            Posting...
          </span>
        )}
      </div>

      <button
        onClick={handleLike}
        className="flex items-center space-x-1 text-sm hover:text-red-500"
      >
        <span>{comment.isLiked ? "❤️" : "🤍"}</span>
        <span>{comment.likeCount || 0}</span>
      </button>

      {/* Edit Mode */}
      {editingCommentId === comment._id ? (
        <div className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full border p-2 rounded"
            rows="3"
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEditComment}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>

            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-2 text-gray-800">{comment.content}</p>

          {user?._id === comment.owner?._id && !comment.isTemp && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleStartEdit}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>

              <button
                onClick={handleDeleteComment}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CommentItem;