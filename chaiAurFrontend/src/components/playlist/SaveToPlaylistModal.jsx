import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiCheck } from "react-icons/fi";
import {
    fetchUserPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    selectPlaylists,
    selectTogglingVideo,
} from "../../features/playlist/playlistSlice";
import PlaylistFormModal from "./PlaylistFormModal.jsx";

export default function SaveToPlaylistModal({ videoId, onClose }) {
    const dispatch     = useDispatch();
    const [showCreate,     setShowCreate]     = useState(false);
    const playlists    = useSelector(selectPlaylists);
    const togglingVideo = useSelector(selectTogglingVideo);

    const { user } = useSelector((state) => state.auth);
    const userId=user.user._id;

    useEffect(() => {
        dispatch(fetchUserPlaylists(userId));
    }, [dispatch, userId]);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const isVideoInPlaylist = (playlist) =>
        playlist.videos?.some((v) =>
            typeof v === "string" ? v === videoId : v._id === videoId
        );

    const handleToggle = (playlist) => {
        const inPlaylist = isVideoInPlaylist(playlist);
        if (inPlaylist) {
            dispatch(removeVideoFromPlaylist({ videoId, playlistId: playlist._id }));
        } else {
            dispatch(addVideoToPlaylist({ videoId, playlistId: playlist._id }));
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4
                        bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border
                            border-zinc-200 dark:border-zinc-800 shadow-2xl
                            w-full max-w-sm
                            animate-in fade-in zoom-in-95 duration-150">

                {/* Header */} 
                <div className="flex items-center justify-between px-5 py-4
                                border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Save to playlist
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600
                                   dark:hover:text-zinc-200 hover:bg-zinc-100
                                   dark:hover:bg-zinc-800 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* List */} 
                <div className="max-h-72 overflow-y-auto py-2">
                    {status === "loading" ? (
                        <div className="space-y-1 px-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i}
                                     className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800
                                                animate-pulse" />
                            ))}
                        </div>
                    ) : playlists.length === 0 ? (
                        <p className="text-center text-sm text-zinc-400 py-8">
                            No playlists yet. Create one first.
                        </p>
                    ) : (
                        playlists.map((playlist) => {
                            const inPlaylist = isVideoInPlaylist(playlist);
                            const isToggling =
                                togglingVideo?.videoId    === videoId &&
                                togglingVideo?.playlistId === playlist._id;

                            return (
                                <button
                                    key={playlist._id}
                                    onClick={() => handleToggle(playlist)}
                                    disabled={isToggling}
                                    className="w-full flex items-center gap-3 px-4 py-2.5
                                               hover:bg-zinc-50 dark:hover:bg-zinc-800/60
                                               transition-colors disabled:opacity-60 text-left"
                                >
                                    {/* Checkbox */}
                                    <div className={`w-4 h-4 rounded border-2 flex items-center
                                                     justify-center shrink-0 transition-colors
                                                     ${inPlaylist
                                                         ? "bg-blue-600 border-blue-600"
                                                         : "border-zinc-300 dark:border-zinc-600"
                                                     }`}>
                                        {inPlaylist && <FiCheck size={10} className="text-white" />}
                                    </div>

                                    {/* Playlist name */}
                                    <span className="flex-1 text-sm text-zinc-800
                                                     dark:text-zinc-200 truncate">
                                        {playlist.name}
                                    </span>

                                    {/* Video count */} 
                                    <span className="text-xs text-zinc-400 shrink-0">
                                        {playlist?.videos?.length ?? 0}
                                    </span>

                                    {/* Spinner */}
                                    {isToggling && (
                                        <span className="w-3.5 h-3.5 border-2 border-zinc-300
                                                         border-t-zinc-600 rounded-full
                                                         animate-spin shrink-0" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Footer — link to create new */}
                <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 text-xs font-medium text-blue-600
                                   dark:text-blue-400 hover:underline"
                    >
                        <FiPlus size={13} />
                        Create new playlist
                    </button>
                </div>
            </div>
            {showCreate && (
                <PlaylistFormModal onClose={() => setShowCreate(false)} />
            )}
        </div>
    );
}
