import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit2, FiTrash2, FiFilm } from "react-icons/fi";
import {
    fetchPlaylistById,
    removeVideoFromPlaylist,
    deletePlaylist,
    resetCurrentPlaylist,
    selectCurrentPlaylist,
    selectDetailStatus,
} from "../features/playlist/playlistSlice";
import PlaylistVideoRow from "../components/playlist/PlaylistVideoRow";
import PlaylistFormModal from "../components/playlist/PlaylistFormModal";
import DeletePlaylistModal from "../components/playlist/DeletePlaylistModal";
import { useNavigate } from "react-router-dom";
import { useSelector as useAuthSelector } from "react-redux";
import useInfiniteFeed from "../hooks/useInfiniteFeed.js";

export default function PlaylistDetailPage() {
    const { playlistId } = useParams();
    const dispatch        = useDispatch();
    const navigate        = useNavigate();
    const playlist        = useSelector(selectCurrentPlaylist);
    const status          = useSelector(selectDetailStatus);
    const { user }        = useAuthSelector((state) => state.auth);

    const [showEdit,   setShowEdit]   = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const currentUserId = user?.user?._id;
    const isOwner = playlist?.owner?._id === currentUserId ||
                    playlist?.owner === currentUserId;

    const videos = playlist?.videos || [];
    const { visibleItems, hasMore, sentinelRef } = useInfiniteFeed({
        items: videos,
        initialCount: 8,
        step: 4,
        resetKey: `${playlistId}-${videos.length}`,
    });

    useEffect(() => {
        dispatch(fetchPlaylistById(playlistId));
        return () => dispatch(resetCurrentPlaylist());
    }, [dispatch, playlistId]);

    const handleRemoveVideo = (payload) => {
        dispatch(removeVideoFromPlaylist(payload));
    };

    const handleConfirmDelete = async () => {
        const result = await dispatch(deletePlaylist(playlistId));
        if (!result.error) navigate("/playlists");
    };

    // ── Loading ───────────────────────────────────────────
    if (status === "loading") {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-48" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full w-72" />
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-3 items-center">
                            <div className="w-32 aspect-video rounded-lg
                                            bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full w-3/4" />
                                <div className="h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ── Error / Not found ─────────────────────────────────
    if (status === "failed" || !playlist) {
        return (
            <div className="flex flex-col items-center gap-3 py-24 text-center px-4">
                <p className="text-sm text-zinc-500">Playlist not found.</p>
                <button
                    onClick={() => navigate("/playlists")}
                    className="text-xs font-medium text-blue-600 hover:underline"
                >
                    ← Back to playlists
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">

            {/* Playlist header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-8">
                <div className="w-full sm:w-40 aspect-video rounded-xl overflow-hidden
                                bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    {videos[0]?.thumbnail ? (
                        <img
                            src={videos[0].thumbnail}
                            alt={playlist.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FiFilm size={24} className="text-zinc-400" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                            {playlist.name}
                        </h1>
                        {isOwner && (
                            <div className="flex items-center gap-1 shrink-0 self-start sm:self-auto">
                                <button
                                    onClick={() => setShowEdit(true)}
                                    title="Edit playlist"
                                    className="p-2 rounded-lg text-zinc-400 hover:text-blue-500
                                               hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                                >
                                    <FiEdit2 size={15} />
                                </button>
                                <button
                                    onClick={() => setShowDelete(true)}
                                    title="Delete playlist"
                                    className="p-2 rounded-lg text-zinc-400 hover:text-red-500
                                               hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                >
                                    <FiTrash2 size={15} />
                                </button>
                            </div>
                        )}
                    </div>

                    {playlist.description && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                            {playlist.description}
                        </p>
                    )}

                    <p className="text-xs text-zinc-400 mt-2">
                        {videos.length} video{videos.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* Video list */}
            {videos.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center
                                border border-dashed border-zinc-200 dark:border-zinc-800
                                rounded-2xl">
                    <FiFilm size={28} className="text-zinc-300 dark:text-zinc-700" />
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        No videos in this playlist
                    </p>
                    <p className="text-xs text-zinc-400">
                        Save videos here from the watch page.
                    </p>
                </div>
            ) : (
                <div className="space-y-1">
                    {visibleItems.map((video, idx) => (
                        <PlaylistVideoRow
                            key={video._id}
                            video={video}
                            playlistId={playlistId}
                            index={idx}
                            isOwner={isOwner}
                            onRemove={handleRemoveVideo}
                        />
                    ))}
                    {hasMore ? (
                        <div
                            ref={sentinelRef}
                            className="mt-3 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-5 text-center text-sm text-zinc-500"
                        >
                            Loading more playlist videos...
                        </div>
                    ) : null}
                </div>
            )}

            {showEdit && (
                <PlaylistFormModal
                    playlist={playlist}
                    onClose={() => setShowEdit(false)}
                />
            )}
            {showDelete && (
                <DeletePlaylistModal
                    playlist={playlist}
                    onConfirm={handleConfirmDelete}
                    onClose={() => setShowDelete(false)}
                />
            )}
        </div>
    );
}
