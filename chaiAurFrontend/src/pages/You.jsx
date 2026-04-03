import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PlaylistsPage from "./PlaylistsPage";
import LibraryVideoRow from "../components/library/LibraryVideoRow.jsx";
import {
  clearWatchHistory,
  fetchWatchHistory,
} from "../features/library/librarySlice.js";

export default function You() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const userId = authUser?.user?._id || authUser?._id;
  const { history, historyLoading, clearingHistory, error } = useSelector(
    (state) => state.library
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchWatchHistory());
    }
  }, [dispatch, userId]);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Your space
            </p>
            <h1 className="text-3xl font-bold text-zinc-950">History</h1>
          </div>

          {userId ? (
            <div className="flex flex-wrap gap-3">
              <Link
                to="/feed/liked-videos"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                Open liked videos
              </Link>
              <button
                type="button"
                onClick={() => dispatch(clearWatchHistory())}
                disabled={clearingHistory || !history.length}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {clearingHistory ? "Clearing..." : "Clear history"}
              </button>
            </div>
          ) : null}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {!userId ? (
          <p className="text-sm text-zinc-500">Please log in to view your history.</p>
        ) : historyLoading ? (
          <p className="text-sm text-zinc-500">Loading history...</p>
        ) : history.length ? (
          <div className="space-y-4">
            {history.map((video) => (
              <LibraryVideoRow key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-sm text-zinc-600">
            Videos you watch will appear here.
          </div>
        )}
      </section>
      <section className="max-w-sm p-4 bg-white rounded-lg shadow-md hover:shadow-2xl hover:cursor-pointer transition-shadow">
        <button
          onClick={() => navigate("/feed/liked-videos")}
          className="w-full text-left"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Liked Videos</h2>
          <p className="text-sm text-gray-600">
            View all the videos you’ve liked in one place.
          </p>
        </button>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Playlists</h2>
        {userId ? (
          <PlaylistsPage />
        ) : (
          <p className="text-sm text-zinc-500">Please log in to view playlists.</p>
        )}
      </section>
    </div>
  );
}
