import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  FiCompass,
  FiHome,
  FiLogIn,
  FiLogOut,
  FiSearch,
  FiUploadCloud,
  FiUser,
  FiVideo,
} from "react-icons/fi";
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const menuRef = useRef(null);

  // Sync search input with URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("query") ?? "");
  }, [location.pathname, location.search]);

  // Close panels on route change
  useEffect(() => {
    setMenuOpen(false);
    setShowPanel(false);
  }, [location.pathname, location.search]);

  // Debounced suggestion fetch
  useEffect(() => {
    if (!showPanel) return;
    const trimmed = search.trim();
    if (!trimmed) {
      dispatch(clearSearchSuggestions());
      return;
    }
    const timer = setTimeout(() => {
      dispatch(fetchSearchSuggestions(trimmed));
    }, 250);
    return () => clearTimeout(timer);  
  }, [dispatch, search, showPanel]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowPanel(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
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

  const panelItems = (search.trim() ? suggestions : recentSearches).filter(
    (item) => typeof item === "string"
  );

  const userData = user?.user ?? user;
  const isActive = (path) => location.pathname === path;

  const primaryLinks = [
    { label: "Home", path: "/", icon: FiHome },
    ...(userData
      ? [
          { label: "Subscriptions", path: "/subscribedChannels", icon: FiCompass },
          { label: "You", path: "/feed/you", icon: FiUser },
          { label: "Studio", path: "/studio", icon: FiVideo },
          { label: "Upload", path: "/upload", icon: FiUploadCloud },
          
        ]
      : [
          { label: "Login", path: "/login", icon: FiLogIn },
          { label: "Register", path: "/register", icon: FiUser },
        ]),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70  backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group flex items-center gap-3 rounded-2xl px-1 py-1 text-left"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-400 text-sm font-black text-white shadow-lg shadow-zinc-950/20 transition group-hover:scale-[1.03]">
                S
              </div>
              <div>
                <p className="text-lg font-black tracking-tight text-zinc-950">SkyTube</p>
              </div>
            </button>
          </div>

          {/* Search bar */}
          <div ref={searchRef} className="relative order-3 w-full md:order-2 md:flex-1">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                runSearch(search);
              }}
              className="flex items-center gap-3 rounded-[28px] border border-zinc-200 bg-white/90 px-4 py-3 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.7)] transition focus-within:border-sky-300 focus-within:bg-white"
            >
              <FiSearch className="shrink-0 text-zinc-400" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={() => setShowPanel(true)}
                placeholder="Search videos, topics, creators..."
                className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
              />
              <div className="hidden rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 sm:block">
                Search
              </div>
            </form>

            {showPanel && (
              <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-3xl border border-zinc-200 bg-white/95 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                    {search.trim() ? "Suggestions" : "Recent searches"}
                  </p>
                  {!search.trim() && recentSearches.length > 0 && (
                    <button
                      type="button"
                      onClick={() => dispatch(clearRecentSearches())}
                      className="text-xs font-semibold text-zinc-500 transition hover:text-red-500"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {suggestionLoading && search.trim() ? (
                  <div className="px-5 py-6 text-sm text-zinc-500">Loading suggestions...</div>
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
                        className="flex w-full items-center justify-between px-5 py-3 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                      >
                        <span className="line-clamp-1">{item}</span>
                        <span className="text-xs font-medium text-zinc-400">
                          {search.trim() ? "Try this" : "Recent"}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-6 text-sm text-zinc-500">
                    {search.trim()
                      ? "No suggestions yet. Press enter to search anyway."
                      : "Your recent searches will appear here."}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upload video */}
          <div className="relative order-2">
            {
              userData ? (
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-zinc-950 transition hover:bg-zinc-100 shadow-sm"
                >
                  <FiUploadCloud size={20}/>
                  Upload a video          
                </Link>
              ) : null
            }
          </div>

          {/* Menu */}
          <div ref={menuRef} className="relative order-2 ml-auto">
            {userData ?
              (<button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="order-2 flex items-center gap-3 rounded-4xl border border-zinc-200 bg-white/80 px-2 py-2 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                aria-expanded={menuOpen}
              >
                <img
                  src={userData.avatar}
                  alt="avatar"
                  className="h-10 w-10 rounded-4xl border border-zinc-200 object-cover"
                />
              </button>) : 
              (
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="rounded-2xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Register
                </button>
              </div>
              )
            }

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-3xl border border-zinc-200 bg-white/95 p-3 shadow-2xl backdrop-blur">
                <div className="rounded-2xl bg-blue-500 p-4 text-white">
                  <div className="mt-4 text-center">
                    {userData ? (
                      <Link
                        to={`/channel/${userData.userName}`}
                        className="block rounded-lg bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-700 transition-colors"
                      >
                        <span className="text-lg font-bold">
                          Hi, {userData.userName}
                        </span>
                        <p className="text-sm opacity-80">Click to view Channel</p>
                      </Link>
                    ) : (
                      <span className="text-lg font-bold text-gray-700">
                        Welcome to SkyTube
                      </span>
                    )}
                  </div>

                </div>

                <div className="mt-3 space-y-1">
                  {primaryLinks.map(({ label, path, icon: Icon }) => (
                    <button
                      key={path}
                      type="button"
                      onClick={() => navigate(path)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                        isActive(path)
                          ? "bg-sky-50 text-sky-700"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          isActive(path) ? "bg-sky-100" : "bg-zinc-100"
                        }`}
                      >
                        <Icon size={16} />
                      </span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                {userData && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(logout());
                      setMenuOpen(false);
                    }}
                    className="mt-3 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100">
                      <FiLogOut size={16} />
                    </span>
                    <span>Logout</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
