import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FiEdit2 } from "react-icons/fi";

const formatDuration = (duration) => {
  if (!duration || isNaN(duration)) return "0:00"; 
  const minutes = Math.floor(duration / 60); 
  const seconds = Math.floor(duration % 60); 
  return `${minutes}:${seconds.toString().padStart(2, "0")}`; 
};

export default function ChannelVideoCard({ video, isOwner = false }) {
  const navigate = useNavigate();

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/studio");
  };

  return (
    <div className="group relative">
      <div className="relative">
        <Link to={`/watch/${video._id}`}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover rounded"
            loading="lazy"
            decoding="async"
          />
          <span 
            className="absolute bottom-2 right-2 
              bg-black/70 text-white text-xs font-semibold 
              px-2.5 py-0.5 rounded-md shadow-md 
              backdrop-blur-sm"
          >
            {formatDuration(video.duration)}
          </span>
        </Link>

        {/* Edit button — owner only */}
        {isOwner && (
          <button
            onClick={handleEditClick}
            title="Manage in Creator Studio"
            className="absolute top-2 right-2
                       flex items-center gap-1 
                       bg-white dark:bg-zinc-800 
                       border border-zinc-200 dark:border-zinc-700
                       text-zinc-700 dark:text-zinc-200
                       text-[11px] font-medium
                       px-2 py-1 rounded-lg shadow-sm
                       opacity-0 group-hover:opacity-100
                       translate-y-1 group-hover:translate-y-0
                       transition-all duration-150
                       hover:bg-blue-50 hover:text-blue-600
                       hover:border-blue-300"
          >
            <FiEdit2 size={11} />
            Edit
          </button>
        )}
      </div>

      <div className="flex gap-3 mt-3">
        <div>
          <Link to={`/watch/${video._id}`}>
            <h3 className="font-semibold line-clamp-2">
              {video.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500"> 
            {formatDistanceToNow(new Date(video.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
