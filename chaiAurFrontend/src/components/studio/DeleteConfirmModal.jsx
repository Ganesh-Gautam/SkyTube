export default function DeleteConfirmModal({ video, onConfirm, onClose, isDeleting }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200
                            dark:border-zinc-800 shadow-2xl w-full max-w-sm p-6
                            animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-950/50
                                    flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                            Delete video?
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">"{video.title}"</span>
                            {" "}will be permanently deleted. This cannot be undone.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400
                                   hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold
                                   text-white bg-red-500 hover:bg-red-600 rounded-lg
                                   disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                        {isDeleting ? (
                            <>
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Deleting…
                            </>
                        ) : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
