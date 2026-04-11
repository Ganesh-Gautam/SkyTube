import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const formatDuration = (duration) => {
  if (!duration || isNaN(duration)) return "0:00"; 
  const minutes = Math.floor(duration / 60); 
  const seconds = Math.floor(duration % 60); 
  return `${minutes}:${seconds.toString().padStart(2, "0")}`; 
};


export default function VideoCard({ video }) {
  const time = formatDuration(video?.duration);

  return (
    <div >
      <div className="relative">
        <Link to={`/watch/${video._id}`}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            loading="lazy"
            decoding="async"
          />
          {time && (
            <span
              className="absolute bottom-2 right-2 
                        bg-black/70 text-white text-xs font-semibold 
                        px-2.5 py-0.5 rounded-md shadow-md 
                        backdrop-blur-sm"
              aria-label={`Video duration ${time}`}
            >
              {time}
            </span>
          )}
        </Link>
      </div>

      <div className="flex gap-3 mt-3">
        {/* Channel Avatar */}
        <Link to={`/channel/${video.owner?.userName}`}>
          <img
            src={video.owner?.avatar || "/default-avatar.png"}
            alt={`${video.owner?.userName}'s avatar`}
            className="w-10 h-10 rounded-full border border-zinc-200 transition-transform duration-200 hover:scale-105 dark:border-zinc-700"
            loading="lazy"
            decoding="async"
            onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
          />
        </Link>

        <div>
          <Link to={`/watch/${video._id}`}>
            <h3 className="line-clamp-2 font-semibold text-zinc-900 transition-colors hover:text-blue-600 dark:text-zinc-100 dark:hover:text-sky-400">
              {video.title}
            </h3>
          </Link>

          <Link
            to={`/channel/${video.owner?.userName}`}
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            {video.owner?.userName}
          </Link>

          <p className="text-sm text-zinc-500 dark:text-zinc-400"> 
            {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}
