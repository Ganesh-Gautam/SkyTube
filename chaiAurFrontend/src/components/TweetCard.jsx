import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTweet, toggleTweetLike, selectDeletingId, selectLikingId } from "../features/tweet/tweetSlice";
import TweetComposer from "./TweetComposer";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TweetCard({ tweet, currentUserId }) {
  const dispatch   = useDispatch();
  const deletingId = useSelector(selectDeletingId);
  const likingId   = useSelector(selectLikingId);

  const [isEditing,      setIsEditing]      = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isOwner    = tweet.owner?._id === currentUserId || tweet.owner === currentUserId;
  const isDeleting = deletingId === tweet._id;
  const isLiking   = likingId   === tweet._id;

  const handleDelete = async () => {
    dispatch(deleteTweet(tweet._id));
    setShowDeleteModal(false);
  };

  const handleLike = () => {
    if (!isLiking) dispatch(toggleTweetLike(tweet._id));
  };

  if (isEditing) {
    return (
      <TweetComposer
        currentUser={tweet.owner}
        editTweet={tweet}
        onCancelEdit={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <article
        className={`group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200
                    dark:border-zinc-800 p-4 transition-all duration-200
                    hover:border-zinc-300 dark:hover:border-zinc-700
                    hover:shadow-sm ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="flex gap-3">
          {/* Avatar */}
          <img
            src={
              tweet.owner?.avatar ||
              `https://ui-avatars.com/api/?name=${tweet.owner?.userName}&background=random`
            }
            alt={tweet.owner?.userName}
            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-zinc-100 dark:ring-zinc-800"
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {tweet.owner?.fullName || tweet.owner?.userName}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  @{tweet.owner?.userName}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700 text-xs">·</span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500" title={new Date(tweet.createdAt).toLocaleString()}>
                  {timeAgo(tweet.createdAt)}
                </span>
                {tweet.createdAt !== tweet.updatedAt && (
                  <span className="text-xs text-zinc-400 italic">(edited)</span>
                )}
              </div>

              {/* Owner actions — visible on hover */}
              {isOwner && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    title="Edit post"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500
                               hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    title="Delete post"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500
                               hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Post content */}
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap wrap-break-word">
              {tweet.content}
            </p>

            {/* Like button */}
            <div className="mt-3 flex items-center gap-4">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-1.5 text-xs font-medium rounded-lg px-2 py-1
                            transition-all duration-150 active:scale-95 select-none
                            ${tweet.isLiked
                              ? "text-red-500 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60"
                              : "text-zinc-400 hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            } ${isLiking ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {isLiking ? (
                  <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                ) : (
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${tweet.isLiked ? "scale-110" : ""}`}
                    fill={tweet.isLiked ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                )}
                <span>{tweet.likesCount ?? 0}</span>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800
                          shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Delete post?</h3>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 ml-12">
              This action cannot be undone. The post will be permanently removed.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400
                           hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500
                           hover:bg-red-600 rounded-lg transition-colors
                           disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting…
                  </>
                ) : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
