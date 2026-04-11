import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LibraryVideoRow from "../components/library/LibraryVideoRow.jsx";
import {
  fetchLikedVideos,
  removeLikedVideo,
} from "../features/library/librarySlice.js";
import useInfiniteFeed from "../hooks/useInfiniteFeed.js";

export default function LikedVideos() {
  const dispatch = useDispatch();
  const { likedVideos, likedLoading, removingLikedId, error } = useSelector(
    (state) => state.library
  );
  const { visibleItems, hasMore, sentinelRef } = useInfiniteFeed({
    items: likedVideos,
    initialCount: 8,
    step: 4,
    resetKey: likedVideos.length,
  });

  useEffect(() => {
    dispatch(fetchLikedVideos());
  }, [dispatch]);

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Your library
          </p>
          <h1 className="text-3xl font-bold text-zinc-950">Liked videos</h1>
        </div>
        <p className="text-sm text-zinc-500">{likedVideos.length} saved likes</p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {likedLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="h-40 w-full rounded-xl bg-zinc-200 md:w-72" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-zinc-200" />
                  <div className="h-3 w-1/3 rounded bg-zinc-100" />
                  <div className="h-3 w-full rounded bg-zinc-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : likedVideos.length ? (
        <div className="space-y-4">
          {visibleItems.map((video) => (
            <LibraryVideoRow
              key={video._id}
              video={video}
              actionLabel={removingLikedId === video._id ? "Removing..." : "Remove like"}
              actionDisabled={removingLikedId === video._id}
              onAction={(videoId) => dispatch(removeLikedVideo(videoId))}
            />
          ))}
          {hasMore ? (
            <div
              ref={sentinelRef}
              className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-5 text-center text-sm text-zinc-500"
            >
              Loading more liked videos...
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-sm text-zinc-600">
          Videos you like will show up here.
        </div>
      )}
    </section>
  );
}
