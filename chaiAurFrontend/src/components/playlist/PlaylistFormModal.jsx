import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createPlaylist,
    updatePlaylist,
    selectSubmitting,
} from "../../features/playlist/playlistSlice";

export default function PlaylistFormModal({ playlist = null, onClose }) {
    const dispatch   = useDispatch();
    const submitting = useSelector(selectSubmitting);
    const isEditMode = Boolean(playlist);

    const [name,        setName]        = useState(playlist?.name        ?? "");
    const [description, setDescription] = useState(playlist?.description ?? "");

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const isDirty =
        name.trim() !== (playlist?.name ?? "") ||
        description.trim() !== (playlist?.description ?? "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        let result;
        if (isEditMode) {
            result = await dispatch(
                updatePlaylist({
                    playlistId: playlist._id,
                    name: name.trim(),
                    description: description.trim(),
                })
            );
        } else {
            result = await dispatch(
                createPlaylist({ name: name.trim(), description: description.trim() })
            );
        }

        if (!result.error) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4
                        bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border
                            border-zinc-200 dark:border-zinc-800 shadow-2xl
                            w-full max-w-md
                            animate-in fade-in zoom-in-95 duration-150">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4
                                border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {isEditMode ? "Edit playlist" : "New playlist"}
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-500
                                          dark:text-zinc-400 uppercase tracking-wide">
                            Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My awesome playlist"
                            maxLength={60}
                            autoFocus
                            className="w-full px-3 py-2.5 text-sm rounded-lg
                                       bg-zinc-50 dark:bg-zinc-800
                                       border border-zinc-200 dark:border-zinc-700
                                       text-zinc-900 dark:text-zinc-100
                                       placeholder:text-zinc-400
                                       focus:outline-none focus:ring-2
                                       focus:ring-blue-500/40 focus:border-blue-400
                                       dark:focus:border-blue-500 transition-colors"
                        />
                        <p className="text-right text-[10px] text-zinc-400 font-mono">
                            {name.length}/60
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-500
                                          dark:text-zinc-400 uppercase tracking-wide">
                            Description
                            <span className="ml-1 text-zinc-400 normal-case font-normal">
                                (optional)
                            </span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's this playlist about?"
                            rows={3}
                            maxLength={200}
                            className="w-full px-3 py-2.5 text-sm rounded-lg resize-none
                                       bg-zinc-50 dark:bg-zinc-800
                                       border border-zinc-200 dark:border-zinc-700
                                       text-zinc-900 dark:text-zinc-100
                                       placeholder:text-zinc-400
                                       focus:outline-none focus:ring-2
                                       focus:ring-blue-500/40 focus:border-blue-400
                                       dark:focus:border-blue-500 transition-colors"
                        />
                        <p className="text-right text-[10px] text-zinc-400 font-mono">
                            {description.length}/200
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-600
                                       dark:text-zinc-400 hover:bg-zinc-100
                                       dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim() || submitting || (isEditMode && !isDirty)}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm
                                       font-semibold text-white bg-blue-600 hover:bg-blue-500
                                       rounded-lg disabled:opacity-40 disabled:cursor-not-allowed
                                       transition-all active:scale-95"
                        >
                            {submitting ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white/30
                                                     border-t-white rounded-full animate-spin" />
                                    {isEditMode ? "Saving…" : "Creating…"}
                                </>
                            ) : (
                                isEditMode ? "Save changes" : "Create playlist"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
