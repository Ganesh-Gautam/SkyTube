import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateVideo, selectUpdatingId } from "../../features/video/videoSlice";

export default function EditVideoModal({ video, onClose, onSaved }) {
    const dispatch   = useDispatch();
    const updatingId = useSelector(selectUpdatingId);
    const isUpdating = updatingId === video._id;

    const [title,       setTitle]       = useState(video.title       || "");
    const [description, setDescription] = useState(video.description || "");
    const [thumbnail,   setThumbnail]   = useState(null);
    const [preview,     setPreview]     = useState(video.thumbnail   || null);
    const fileRef = useRef(null);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const handleThumbnail = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setThumbnail(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title",       title.trim());
        formData.append("description", description.trim());
        if (thumbnail) formData.append("thumbnail", thumbnail);

        const result = await dispatch(updateVideo({ videoId: video._id, formData }));
        if (!result.error) {
            onSaved?.(result.payload);
            onClose();
        }
    };

    const isDirty =
        title.trim()       !== (video.title       || "") ||
        description.trim() !== (video.description || "") ||
        thumbnail !== null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200
                            dark:border-zinc-800 shadow-2xl w-full max-w-lg
                            animate-in fade-in zoom-in-95 duration-150">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b
                                border-zinc-100 dark:border-zinc-800">
                    <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        Edit video
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600
                                   dark:hover:text-zinc-200 hover:bg-zinc-100
                                   dark:hover:bg-zinc-800 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">

                    {/* Thumbnail */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                            Thumbnail
                        </label>
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="relative group cursor-pointer rounded-xl overflow-hidden
                                       border-2 border-dashed border-zinc-200 dark:border-zinc-700
                                       hover:border-blue-400 dark:hover:border-blue-500
                                       transition-colors aspect-video bg-zinc-50 dark:bg-zinc-800"
                        >
                            {preview ? (
                                <>
                                    <img
                                        src={preview}
                                        alt="Thumbnail preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                                                    transition-opacity flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <span className="text-white text-xs font-medium">Change thumbnail</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
                                    <svg className="w-8 h-8 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M3.75 3A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75z" />
                                    </svg>
                                    <span className="text-xs text-zinc-400">Click to upload thumbnail</span>
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnail}
                            className="hidden"
                        />
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Video title"
                            maxLength={100}
                            className="w-full px-3 py-2.5 text-sm rounded-lg bg-zinc-50 dark:bg-zinc-800
                                       border border-zinc-200 dark:border-zinc-700
                                       text-zinc-900 dark:text-zinc-100
                                       placeholder:text-zinc-400
                                       focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                       focus:border-blue-400 dark:focus:border-blue-500
                                       transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your video…"
                            rows={3}
                            maxLength={500}
                            className="w-full px-3 py-2.5 text-sm rounded-lg bg-zinc-50 dark:bg-zinc-800
                                       border border-zinc-200 dark:border-zinc-700
                                       text-zinc-900 dark:text-zinc-100
                                       placeholder:text-zinc-400 resize-none
                                       focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                       focus:border-blue-400 dark:focus:border-blue-500
                                       transition-colors"
                        />
                        <p className="text-right text-xs text-zinc-400 font-mono">
                            {description.length}/500
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400
                                       hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isDirty || isUpdating || !title.trim()}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold
                                       text-white bg-blue-600 hover:bg-blue-500 rounded-lg
                                       disabled:opacity-40 disabled:cursor-not-allowed
                                       transition-all active:scale-95"
                        >
                            {isUpdating ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Save changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
