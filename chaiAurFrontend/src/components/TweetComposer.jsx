import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTweet, updateTweet, selectSubmitting } from "../features/tweet/tweetSlice";

export default function TweetComposer({ currentUser, editTweet = null, onCancelEdit }) {
    const dispatch   = useDispatch();
    const submitting = useSelector(selectSubmitting);

    const textareaRef = useRef(null);
    const MAX = 500;

    const [content, setContent] = useState(() => editTweet ? editTweet.content : "");

    useEffect(() => {
    if (editTweet?.content !== undefined) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setContent(editTweet.content);
    } else {
        setContent("");
    }
    }, [editTweet?.content]);

    useLayoutEffect(() => {
    if (editTweet) textareaRef.current?.focus();
    }, [editTweet]);


    const handleChange = (e) => {
    setContent(e.target.value);
    const el = textareaRef.current;
    if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }
    };

    const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed || trimmed.length > MAX) return;

    if (editTweet) {
        await dispatch(updateTweet({ tweetId: editTweet._id, content: trimmed }));
        onCancelEdit?.();
    } else {
        await dispatch(createTweet(trimmed));
        setContent("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
    };

    const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit();
    if (e.key === "Escape" && editTweet) onCancelEdit?.();
    };

    const remaining   = MAX - content.length;
    const isOverLimit = remaining < 0;
    const isEmpty     = content.trim().length === 0;
    const isEditMode  = Boolean(editTweet);

    return (
    <div
        className={`bg-white dark:bg-zinc-900 rounded-2xl border transition-all duration-200 ${
        isEditMode
            ? "border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-500/10"
            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
        } p-4`}
    >
        <div className="flex gap-3">
        <img
            src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.username}&background=random`}
            alt={currentUser?.username}
            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-zinc-100 dark:ring-zinc-800"
        />

        <div className="flex-1 flex flex-col gap-3">
            <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isEditMode ? "Edit your post…" : "Share something with your community…"}
            rows={isEditMode ? 3 : 2}
            aria-label={isEditMode ? "Edit tweet" : "Compose tweet"}
            className="w-full bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400
                        text-sm leading-relaxed resize-none focus:outline-none min-h-13 overflow-hidden"
            />

            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span
                className={`text-xs font-mono transition-colors ${
                isOverLimit
                    ? "text-red-500"
                    : remaining < 50
                    ? "text-amber-500"
                    : "text-zinc-400"
                }`}
            >
                {remaining} left
            </span>

            <div className="flex items-center gap-2">
                {isEditMode && (
                <button
                    onClick={onCancelEdit}
                    className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-700
                                dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg
                                hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    Cancel
                </button>
                )}
                <button
                onClick={handleSubmit}
                disabled={isEmpty || isOverLimit || submitting}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg
                            bg-blue-600 hover:bg-blue-500 text-white
                            disabled:opacity-40 disabled:cursor-not-allowed
                            transition-all duration-150 active:scale-95"
                >
                {submitting ? (
                    <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isEditMode ? "Saving…" : "Posting…"}
                    </>
                ) : (
                    <>
                    {isEditMode ? (
                        <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Save changes
                        </>
                    ) : (
                        <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                        Post
                        </>
                    )}
                    </>
                )}
                </button>
            </div>
            </div>
        </div>
        </div>

        {isEditMode && (
        <p className="mt-2 pl-13 text-xs text-zinc-400">
            Press <kbd className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-mono">Esc</kbd> to cancel
            {" · "}
            <kbd className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-mono">⌘↵</kbd> to save
        </p>
        )}
    </div>
    );
}
