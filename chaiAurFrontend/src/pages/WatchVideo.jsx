import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiBookmark, FiHeart, FiPlayCircle } from "react-icons/fi";
import { fetchVideoById, fetchVideos, toggleVideoLike } from "../features/video/videoSlice";
import CommentSection from "../components/comment/CommentSection.jsx";
import SubscribeButton from "../components/SubscribeButton";
import SaveToPlaylistModal from "../components/playlist/SaveToPlaylistModal.jsx";

const formatDuration = (duration) => {
  if (!duration || Number.isNaN(duration)) return "0:00";
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function WatchVideo() {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentVideo, videos, isLoading } = useSelector((state) => state.video);
  const [showSave, setShowSave] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const playerRef = useRef(null);
  const currentVideoId = currentVideo?._id;

  useEffect(() => {
    let cancelled = false;
    setVideoLoading(true);
    const action = dispatch(fetchVideoById(videoId));
    const promise = typeof action?.unwrap === "function" ? action.unwrap() : action;
    Promise.resolve(promise)
      .catch(() => {})
      .finally(() => { if (!cancelled) setVideoLoading(false); });
    return () => { cancelled = true; };
  }, [dispatch, videoId]);

  useEffect(() => { setShowSave(false); }, [videoId]);

  useEffect(() => {
    if (currentVideoId && currentVideoId === videoId) {
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentVideoId, videoId]);

  useEffect(() => {
    if (!videos?.length) dispatch(fetchVideos({ limit: 8 }));
  }, [dispatch, videos?.length]);

  const relatedVideos = useMemo(
    () => (videos || []).filter((v) => v._id !== videoId).slice(0, 6),
    [videoId, videos]
  );

  if (!currentVideo && isLoading) return (
    <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400">Loading video...</p>
  );
  if (videoLoading && (!currentVideo || currentVideo._id !== videoId)) return (
    <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400">Loading video...</p>
  );
  if (!currentVideo) return (
    <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400">Video not found.</p>
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-6">

        {/* Player */}
        <div
          ref={playerRef}
          className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-black shadow-xl dark:border-zinc-800"
        >
          <video
            key={currentVideo._id}
            src={currentVideo.videoFile}
            controls
            className="aspect-video w-full bg-black"
          />
        </div>

        {/* Video info */}
        <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              Now playing
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {formatDuration(currentVideo.duration)}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-black leading-tight text-zinc-950 dark:text-zinc-50 md:text-3xl">
            {currentVideo.title}
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {currentVideo.description || "No description was added for this video yet."}
          </p>

          {/* Channel row */}
          <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/50 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={currentVideo.owner?.avatar}
                alt={`${currentVideo.owner?.userName}'s avatar`}
                className="h-14 w-14 rounded-full border border-zinc-200 object-cover shadow-sm dark:border-zinc-700"
              />
              <div>
                <button
                  type="button"
                  className="text-left text-lg font-semibold text-zinc-900 transition hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                  onClick={() => navigate(`/channel/${currentVideo.owner?.userName}`)}
                >
                  {currentVideo.owner?.userName}
                </button>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Follow this channel and keep up with new uploads.
                </p>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <SubscribeButton channelId={currentVideo.owner?._id} />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => dispatch(toggleVideoLike(currentVideo._id))}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                currentVideo?.isLiked
                  ? "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/60"
                  : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              }`}
            >
              <FiHeart size={16} />
              {currentVideo?.isLiked ? "Liked" : "Like video"}
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs dark:bg-black/20">
                {currentVideo?.likeCount || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowSave(true)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-blue-600 dark:hover:text-blue-400"
            >
              <FiBookmark size={16} />
              Save to playlist
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                Discussion
              </p>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Comments</h2>
            </div>
          </div>
          <CommentSection videoId={videoId} />
        </div>
      </section>

      {/* Sidebar */}
      <aside className="space-y-4">
        <div className="rounded-[1.75rem] border border-zinc-200 bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-blue-950/30 dark:to-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Up next
          </p>
          <h2 className="mt-2 text-xl font-bold text-zinc-950 dark:text-zinc-50">
            Keep the session going
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Pick another video from the feed without leaving the watch experience.
          </p>
        </div>

        {relatedVideos.length ? (
          relatedVideos.map((video) => (
            <Link
              key={video._id}
              to={`/watch/${video._id}`}
              className="group flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <div className="relative w-40 shrink-0 overflow-hidden rounded-xl">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-24 w-full object-cover transition group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-2 right-2 rounded bg-black/75 px-2 py-1 text-[11px] font-semibold text-white">
                  {formatDuration(video.duration)}
                </span>
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  <FiPlayCircle size={12} />
                  Next
                </div>
                <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                  {video.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {video.owner?.userName}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            More videos will appear here once the feed has loaded.
          </div>
        )}
      </aside>

      {showSave && (
        <SaveToPlaylistModal videoId={currentVideo._id} onClose={() => setShowSave(false)} />
      )}
    </div>
  );
}