import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiFilm } from "react-icons/fi";

export default function PlaylistCard({
    playlist,
    isOwner = false,
    onEdit,
    onDelete,
    isDeleting = false,
}) {
    return (
        <div
            className={`group relative flex flex-col rounded-2xl border border-zinc-200
                        dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden
                        hover:border-zinc-300 dark:hover:border-zinc-700
                        hover:shadow-md transition-all duration-200
                        ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
        >
            {/* Thumbnail */} 
            <Link to={`/playlists/${playlist._id}`} className="block">
                <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800">
                    {Array.isArray(playlist?.videos) && playlist.videos.length > 0 ? (
                    playlist.videos[0]?.thumbnail ? (
                        <img
                        src={playlist?.videos[0].thumbnail}
                        alt={playlist?.name || "Video thumbnail"}
                        className="w-full h-full object-cover
                                    group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center
                                        justify-center gap-2 text-zinc-400">
                        <FiFilm size={28} />
                        <span className="text-xs">No thumbnail available</span>
                        </div>
                    )
                    ) : (
                    <div className="w-full h-full flex flex-col items-center
                                    justify-center gap-2 text-zinc-400">
                        <FiFilm size={28} />
                        <span className="text-xs">No videos yet</span>
                    </div>
                    )}


                    {/* Video count badge — bottom right */}
                    <div className="absolute bottom-0 right-0 bg-black/80 text-white
                                    text-[10px] font-semibold px-2 py-1 rounded-tl-lg
                                    flex items-center gap-1">
                        <FiFilm size={9} />
                        {playlist?.videos?.length ?? 0} videos
                    </div>
                </div>
            </Link>

            {/* Info */}
            <div className="flex-1 flex flex-col p-3 gap-1">
                <div className="flex items-start justify-between gap-2">
                    <Link
                        to={`/playlists/${playlist._id}`}
                        className="flex-1 min-w-0"
                    >
                        <h3 className="text-sm font-semibold text-zinc-900
                                       dark:text-zinc-100 truncate leading-snug
                                       hover:text-blue-600 dark:hover:text-blue-400
                                       transition-colors">
                            {playlist.name}
                        </h3>
                    </Link>

                    {/* Owner actions — hover reveal */}
                    {isOwner && (
                        <div className="flex items-center gap-1 shrink-0
                                        opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onEdit(playlist)}
                                title="Edit playlist"
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500
                                           hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            >
                                <FiEdit2 size={13} />
                            </button>
                            <button
                                onClick={() => onDelete(playlist)}
                                title="Delete playlist"
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500
                                           hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            >
                                <FiTrash2 size={13} />
                            </button>
                        </div>
                    )}
                </div>

                {playlist.description && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed">
                        {playlist.description}
                    </p>
                )}
            </div>
        </div>
    );
}
