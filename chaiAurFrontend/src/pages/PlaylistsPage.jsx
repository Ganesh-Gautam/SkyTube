import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus } from "react-icons/fi";
import {
    fetchUserPlaylists,
    deletePlaylist,
    selectPlaylists,
    selectPlaylistStatus,
    selectPlaylistError,
} from "../features/playlist/playlistSlice";
import PlaylistCard from "../components/playlist/PlaylistCard";
import PlaylistFormModal from "../components/playlist/PlaylistFormModal";
import DeletePlaylistModal from "../components/playlist/DeletePlaylistModal"; 
import useInfiniteFeed from "../hooks/useInfiniteFeed.js";

export default function PlaylistsPage({ channelUserId =undefined }) {
    const dispatch  = useDispatch();
    const playlists = useSelector(selectPlaylists);
    const status    = useSelector(selectPlaylistStatus);
    const error     = useSelector(selectPlaylistError);

    const [showCreate,     setShowCreate]     = useState(false);
    const [editPlaylist,   setEditPlaylist]   = useState(null);
    const [deleteTarget,   setDeleteTarget]   = useState(null); 

    const { user } = useSelector((state) => state.auth);
    const currentUserId = user?.user?._id || user?._id;
    const userId = channelUserId ?? currentUserId;
    const isOwner = !channelUserId || channelUserId === currentUserId;
    const { visibleItems, hasMore, sentinelRef } = useInfiniteFeed({
        items: playlists,
        initialCount: 8,
        step: 4,
        resetKey: `${userId}-${playlists.length}`,
    });


    useEffect(() => {
        dispatch(fetchUserPlaylists(userId));
    }, [dispatch, userId]);

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        const result = dispatch(deletePlaylist(deleteTarget._id));
        if (!result.error) setDeleteTarget(null);
    };


    return (
        <div className="max-w-6xl mx-auto px-4 py-8"> 
            {/* Header */} 
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        Your Playlists
                    </h1>
                    {status === "succeeded" && (
                        <p className="text-sm text-zinc-400 mt-0.5">
                            {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>
                    {isOwner ? (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold
                                text-white bg-blue-600 hover:bg-blue-500 rounded-xl
                                transition-all active:scale-95 shadow-sm"
                    >
                        <FiPlus size={15} />
                        New playlist
                    </button>
                    ) : null}              
            </div>

            {/* Loading skeleton */}
            {status === "loading" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-2xl border border-zinc-200
                                                dark:border-zinc-800 overflow-hidden animate-pulse">
                            <div className="aspect-video bg-zinc-200 dark:bg-zinc-800" />
                            <div className="p-3 space-y-2">
                                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full w-3/4" />
                                <div className="h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {status === "failed" && (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <p className="text-sm text-zinc-500">{error || "Failed to load playlists"}</p>
                    <button
                        onClick={() => userId && dispatch(fetchUserPlaylists(userId))}
                        className="px-4 py-1.5 text-xs font-semibold text-blue-600
                                   border border-blue-200 dark:border-blue-800 rounded-lg
                                   hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Empty state */}
            {status === "succeeded" && playlists.length === 0 && (
                <div className="flex flex-col items-center gap-4 py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800
                                    flex items-center justify-center">
                        <svg className="w-7 h-7 text-zinc-400" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625
                                   4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875
                                   0 010-3.75z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            No playlists yet
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                            Create your first playlist to organize your videos.
                        </p>
                    </div> 
                </div>
            )}

            {/* Grid */}
            {status === "succeeded" && playlists.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {visibleItems.map((playlist) => (
                        <PlaylistCard
                            key={playlist._id}
                            playlist={playlist}
                            isOwner={isOwner}
                            onEdit={setEditPlaylist}
                            onDelete={setDeleteTarget}
                        />
                    ))}
                </div>
            )}
            {status === "succeeded" && hasMore ? (
                <div
                    ref={sentinelRef}
                    className="mt-5 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-5 text-center text-sm text-zinc-500"
                >
                    Loading more playlists...
                </div>
            ) : null}

            {/* Modals */}
            {showCreate && (
                <PlaylistFormModal onClose={() => setShowCreate(false)} />
            )}
            {editPlaylist && (
                <PlaylistFormModal
                    playlist={editPlaylist}
                    onClose={() => setEditPlaylist(null)}
                />
            )}
            {deleteTarget && (
                <DeletePlaylistModal
                    playlist={deleteTarget}
                    onConfirm={handleConfirmDelete}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}
