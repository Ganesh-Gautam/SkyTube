import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const formatDuration = (duration) => {
  if (!duration || isNaN(duration)) return "0:00"; 
  const minutes = Math.floor(duration / 60); 
  const seconds = Math.floor(duration % 60); 
  return `${minutes}:${seconds.toString().padStart(2, "0")}`; 
};

export default function ChannelVideoCard({ video }) {
  return (
    <div>
      <div className="relative">
        <Link to={`/watch/${video._id}`}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover rounded"
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

