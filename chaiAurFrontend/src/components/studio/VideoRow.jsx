
import { useDispatch, useSelector } from "react-redux";
import { 
    togglePublishStatus, 
    selectDeletingId,
    selectTogglingId,
} from "../../features/video/videoSlice";
function formatDuration(seconds) {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}


function timeAgo(dateStr) {
    const diff  = Date.now() - new Date(dateStr).getTime();
    const days  = Math.floor(diff / 86400000);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    if (days  < 1)  return "Today";
    if (days  < 7)  return `${days}d ago`;
    if (weeks < 5)  return `${weeks}w ago`;
    if (months < 12) return `${months}mo ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}


export default function VideoRow({ video, onEdit, onDelete }) {
    const dispatch   = useDispatch();
    const togglingId = useSelector(selectTogglingId);
    const deletingId = useSelector(selectDeletingId);

    const isToggling = togglingId === video._id;
    const isDeleting = deletingId === video._id;

    return (
        <tr
            className={`group border-b border-zinc-100 dark:border-zinc-800
                        hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors
                        ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
        >
            {/* Thumbnail + Title */}
            <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                    <div className="relative shrink-0 w-28 aspect-video rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        {video.thumbnail ? (
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                        )}
                        {video.duration && (
                            <span className="absolute bottom-1 right-1 bg-black/80 text-white
                                             text-[10px] font-mono px-1 py-0.5 rounded">
                                {formatDuration(video.duration)}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-60">
                            {video.title}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1 max-w-60">
                            {video.description || "No description"}
                        </p>
                    </div>
                </div>
            </td>

            {/* Publish toggle */}
            <td className="py-3 px-4 text-center">
                <button
                    onClick={() => dispatch(togglePublishStatus(video._id))}
                    disabled={isToggling}
                    title={video.isPublished ? "Click to unpublish" : "Click to publish"}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                                ${video.isPublished
                                    ? "bg-blue-500"
                                    : "bg-zinc-300 dark:bg-zinc-600"
                                } ${isToggling ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow
                                    transition-transform duration-150
                                    ${video.isPublished ? "translate-x-4" : "translate-x-0.5"}`}
                    />
                </button>
                <p className={`text-[10px] mt-1 font-medium
                               ${video.isPublished
                                   ? "text-blue-500"
                                   : "text-zinc-400 dark:text-zinc-500"}`}>
                    {isToggling ? "…" : video.isPublished ? "Public" : "Private"}
                </p>
            </td>



            {/* Date */}
            <td className="py-3 px-4 text-center">
                <span className="text-xs text-zinc-400">{timeAgo(video.createdAt)}</span>
            </td>

            {/* Actions */}
            <td className="py-3 px-4 text-center">
                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(video)}
                        title="Edit"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500
                                   hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(video)}
                        title="Delete"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500
                                   hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
}