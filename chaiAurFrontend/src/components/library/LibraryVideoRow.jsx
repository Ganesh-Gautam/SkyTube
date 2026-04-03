import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const formatDuration = (duration) => {
  if (!duration || Number.isNaN(duration)) return "0:00";

  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function LibraryVideoRow({
  video,
  actionLabel,
  onAction,
  actionDisabled = false,
}) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
      <Link to={`/watch/${video._id}`} className="relative w-full shrink-0 md:w-72">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-44 w-full rounded-xl object-cover"
        />
        <span className="absolute bottom-3 right-3 rounded bg-black/75 px-2 py-1 text-xs font-semibold text-white">
          {formatDuration(video.duration)}
        </span>
      </Link>

      <div className="min-w-0 flex-1">
        <Link to={`/watch/${video._id}`}>
          <h3 className="line-clamp-2 text-lg font-semibold text-zinc-900 hover:text-blue-600">
            {video.title}
          </h3>
        </Link>

        <Link
          to={`/channel/${video.owner?.userName}`}
          className="mt-2 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
        >
          <img
            src={video.owner?.avatar}
            alt={video.owner?.userName}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span>{video.owner?.userName}</span>
        </Link>

        <p className="mt-2 text-sm text-zinc-500">
          {video.createdAt
            ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })
            : "Recently"}
        </p>

        {video.description ? (
          <p className="mt-3 line-clamp-2 text-sm text-zinc-700">{video.description}</p>
        ) : null}
      </div>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={() => onAction(video._id)}
          disabled={actionDisabled}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {actionLabel}
        </button>
      ) : null}
    </article>
  );
}
