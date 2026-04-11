import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FiTrash2 } from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectTogglingVideo } from "../../features/playlist/playlistSlice";

function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlaylistVideoRow({
    video,
    playlistId,
    index,
    isOwner = false,
    onRemove,
}) {
    const togglingVideo = useSelector(selectTogglingVideo);
    const isRemoving =
        togglingVideo?.videoId === video._id &&
        togglingVideo?.playlistId === playlistId;

    return (
        <div
            className={`group flex items-start sm:items-center gap-3 p-3 rounded-xl
                        hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors
                        ${isRemoving ? "opacity-40 pointer-events-none" : ""}`}
        >
            {/* Position number */}
            <span className="text-xs text-zinc-400 font-mono w-5 text-center shrink-0">
                {index + 1}
            </span>

            {/* Thumbnail */}
            <Link to={`/watch/${video._id}`} className="shrink-0">
                <div className="relative w-24 sm:w-32 aspect-video rounded-lg overflow-hidden
                                bg-zinc-100 dark:bg-zinc-800">
                    {video.thumbnail ? (
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-zinc-400" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75
                                       0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0
                                       002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25
                                       2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                    )}
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white
                                     text-[9px] font-mono px-1 py-0.5 rounded">
                        {formatDuration(video.duration)}
                    </span>
                </div>
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <Link to={`/watch/${video._id}`}>
                    <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100
                                   line-clamp-2 leading-snug hover:text-blue-600
                                   dark:hover:text-blue-400 transition-colors">
                        {video.title}
                    </h4>
                </Link>
                <p className="text-xs text-zinc-400 mt-0.5">
                    {video.owner?.userName && (
                        <span className="mr-1">{video.owner.userName} ·</span>
                    )}
                    {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                </p>
            </div>

            {/* Remove button — owner only, hover reveal */}
            {isOwner && (
                <button
                    onClick={() => onRemove({ videoId: video._id, playlistId })}
                    title="Remove from playlist"
                    className="shrink-0 p-2 rounded-lg text-zinc-400 hover:text-red-500
                               hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors
                               opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                    {isRemoving ? (
                        <span className="w-3.5 h-3.5 border-2 border-zinc-300
                                         border-t-zinc-600 rounded-full animate-spin block" />
                    ) : (
                        <FiTrash2 size={14} />
                    )}
                </button>
            )}
        </div>
    );
}
