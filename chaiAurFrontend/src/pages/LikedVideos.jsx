import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LibraryVideoRow from "../components/library/LibraryVideoRow.jsx";
import {
  fetchLikedVideos,
  removeLikedVideo,
} from "../features/library/librarySlice.js";

export default function LikedVideos() {
  const dispatch = useDispatch();
  const { likedVideos, likedLoading, removingLikedId, error } = useSelector(
    (state) => state.library
  );

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
        <p className="text-sm text-zinc-500">Loading liked videos...</p>
      ) : likedVideos.length ? (
        <div className="space-y-4">
          {likedVideos.map((video) => (
            <LibraryVideoRow
              key={video._id}
              video={video}
              actionLabel={removingLikedId === video._id ? "Removing..." : "Remove like"}
              actionDisabled={removingLikedId === video._id}
              onAction={(videoId) => dispatch(removeLikedVideo(videoId))}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-sm text-zinc-600">
          Videos you like will show up here.
        </div>
      )}
    </section>
  );
}
