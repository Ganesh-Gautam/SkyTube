import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    dispatch(fetchVideoById(videoId));
  }, [dispatch, videoId]);

  useEffect(() => {
    if (!videos?.length) {
      dispatch(fetchVideos({ limit: 8 }));
    }
  }, [dispatch, videos?.length]);

  const relatedVideos = useMemo(
    () => (videos || []).filter((video) => video._id !== videoId).slice(0, 6),
    [videoId, videos]
  );

  if (!currentVideo && isLoading) {
    return <p className="p-6 text-sm text-zinc-500">Loading video...</p>;
  }

  if (!currentVideo) {
    return <p className="p-6 text-sm text-zinc-500">Video not found.</p>;
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-6">
        <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-black shadow-xl">
          <video src={currentVideo.videoFile} controls className="aspect-video w-full bg-black" />
        </div>

        <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              Now playing
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              {formatDuration(currentVideo.duration)}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-black leading-tight text-zinc-950 md:text-3xl">
            {currentVideo.title}
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {currentVideo.description || "No description was added for this video yet."}
          </p>

          <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-zinc-50 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={currentVideo.owner?.avatar}
                alt="channel"
                className="h-14 w-14 rounded-full border border-zinc-200 object-cover shadow-sm"
              />

              <div>
                <button
                  type="button"
                  className="text-left text-lg font-semibold text-zinc-900 hover:text-blue-600"
                  onClick={() => navigate(`/channel/${currentVideo.owner?.userName}`)}
                >
                  {currentVideo.owner?.userName}
                </button>
                <p className="text-sm text-zinc-500">Follow this channel and keep up with new uploads.</p>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <SubscribeButton channelId={currentVideo.owner?._id} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => dispatch(toggleVideoLike(currentVideo._id))}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                currentVideo?.isLiked
                  ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                  : "bg-zinc-900 text-white hover:bg-zinc-700"
              }`}
            >
              <FiHeart size={16} />
              {currentVideo?.isLiked ? "Liked" : "Like video"}
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs text-inherit">
                {currentVideo?.likeCount || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowSave(true)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-blue-300 hover:text-blue-600"
            >
              <FiBookmark size={16} />
              Save to playlist
            </button>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Discussion
              </p>
              <h2 className="text-xl font-bold text-zinc-950">Comments</h2>
            </div>
          </div>

          <CommentSection videoId={videoId} />
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-[1.75rem] border border-zinc-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eff6ff_50%,#fff7ed_100%)] p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Up next
          </p>
          <h2 className="mt-2 text-xl font-bold text-zinc-950">Keep the session going</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Pick another video from the feed without leaving the watch experience.
          </p>
        </div>

        {relatedVideos.length ? (
          relatedVideos.map((video) => (
            <Link
              key={video._id}
              to={`/watch/${video._id}`}
              className="group flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
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
                <div className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  <FiPlayCircle size={12} />
                  Next
                </div>
                <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-blue-600">
                  {video.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">{video.owner?.userName}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-500">
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
