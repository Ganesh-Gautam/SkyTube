import { useEffect, useRef, useState } from "react";
import { useDispatch , useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import {
    addRecentSearch,
    clearRecentSearches,
    clearSearchSuggestions,
    fetchSearchSuggestions,
    selectRecentSearches,
    selectSearchSuggestions,
    selectSuggestionLoading,
} from "../../features/video/videoSlice.js";

export default function Header() {
    const { user } = useSelector((state) => state.auth);
    const recentSearches = useSelector(selectRecentSearches);
    const suggestions = useSelector(selectSearchSuggestions);
    const suggestionLoading = useSelector(selectSuggestionLoading);
    const dispatch = useDispatch ();
    const navigate = useNavigate(); 
    const location = useLocation();
    const [search, setSearch] = useState("");
    const [showPanel, setShowPanel] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearch(params.get("query") ?? "");
    }, [location.pathname, location.search]);

    useEffect(() => {
        if (!showPanel) return;

        const trimmed = search.trim();
        if (!trimmed) {
            dispatch(clearSearchSuggestions());
            return;
        }

        const timer = window.setTimeout(() => {
            dispatch(fetchSearchSuggestions(trimmed));
        }, 250);

        return () => window.clearTimeout(timer);
    }, [dispatch, search, showPanel]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowPanel(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const runSearch = (value) => {
        const query = value.trim();
        if (!query) return;

        dispatch(addRecentSearch(query));
        dispatch(clearSearchSuggestions());
        setShowPanel(false);
        navigate(`/search?query=${encodeURIComponent(query)}`);
    };

    const panelItems = search.trim() ? suggestions : recentSearches;

    return (
        <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-zinc-200 bg-white/95 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between gap-4">
                <h1
                    className="text-xl font-bold cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    MyTube
                </h1>
            </div>

            <div ref={searchRef} className="relative w-full max-w-2xl">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        runSearch(search);
                    }}
                    className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 shadow-sm transition focus-within:border-blue-400 focus-within:bg-white"
                >
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        onFocus={() => setShowPanel(true)}
                        placeholder="Search videos by title or description"
                        className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                    />
                    <button
                        type="submit"
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Search
                    </button>
                </form>

                {showPanel && (
                    <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
                        <div className="flex items-center justify-between px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                                {search.trim() ? "Suggestions" : "Recent searches"}
                            </p>
                            {!search.trim() && recentSearches.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => dispatch(clearRecentSearches())}
                                    className="text-xs font-medium text-zinc-500 transition hover:text-red-500"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {suggestionLoading && search.trim() ? (
                            <div className="px-4 py-6 text-sm text-zinc-500">Loading suggestions...</div>
                        ) : panelItems.length > 0 ? (
                            <div className="max-h-80 overflow-y-auto pb-2">
                                {panelItems.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => {
                                            setSearch(item);
                                            runSearch(item);
                                        }}
                                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                                    >
                                        <span className="line-clamp-1">{item}</span>
                                        <span className="text-xs text-zinc-400">
                                            {search.trim() ? "Try this" : "Recent"}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-6 text-sm text-zinc-500">
                                {search.trim()
                                    ? "No suggestions yet. Press enter to search anyway."
                                    : "Your recent searches will appear here."}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {user && (
                <div className="flex items-center gap-3 self-end md:self-auto">
                    <img
                        src={user.user.avatar}
                        alt="avatar"
                        onClick={() => navigate(`/channel/${user.user.userName}`)}
                        className="w-10 h-10 rounded-full cursor-pointer border"
                    />
                    <span
                        className="cursor-pointer text-sm font-medium text-zinc-700"
                        onClick={() => navigate(`/channel/${user.user.userName}`)}
                    >
                        {user.user.userName}
                    </span>
                    <button
                        onClick={() => dispatch(logout())}
                        className="rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white"
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
}
