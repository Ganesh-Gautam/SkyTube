import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserTweets,
  clearTweetError,
  selectAllTweets,
  selectTweetStatus,
  selectTweetError,
} from "../features/tweet/tweetSlice";
import TweetComposer from "../components/TweetComposer.jsx";
import TweetCard from "../components/TweetCard.jsx";


export default function CommunityTab({ channelOwner, channelId, currentUser, isOwner }) {
  const dispatch = useDispatch();
  const tweets   = useSelector(selectAllTweets);
  const status   = useSelector(selectTweetStatus);
  const error    = useSelector(selectTweetError); 
  
  useEffect(() => {
    if (status === "idle") dispatch(fetchUserTweets(channelId));
    return () => dispatch(clearTweetError());
  }, [dispatch ,channelId ,status]);

  const handleRetry = () => dispatch(fetchUserTweets(channelId));

  return (
    <section className="max-w-2xl mx-auto px-4 py-6 space-y-5">

      {isOwner && currentUser && (
        <TweetComposer currentUser={currentUser} />
      )}

      {status === "loading" && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border
                                    border-zinc-200 dark:border-zinc-800 p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <div className="flex gap-2">
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full w-24" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full w-16" />
                  </div>
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full w-full" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full w-4/5" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full w-3/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {status === "failed" && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Couldn't load posts</p>
            <p className="text-xs text-zinc-400 mt-0.5">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="px-4 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200
                       dark:border-blue-800 dark:text-blue-400 rounded-lg hover:bg-blue-50
                       dark:hover:bg-blue-950/40 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {status === "succeeded" && tweets.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {isOwner ? "Share something with your community" : "No posts yet"}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {isOwner
                ? "Your posts will appear here for your subscribers."
                : `${channelOwner} hasn't posted anything yet.`}
            </p>
          </div>
        </div>
      )}

      {/* Posts feed */}
      {status === "succeeded" && tweets.length > 0 && (
        <div className="space-y-4">
          {/* Post count header */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Posts
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-800
                             px-2 py-0.5 rounded-full font-mono">
              {tweets.length}
            </span>
          </div>

          {tweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
              currentUserId={currentUser?._id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
