import { useSelector } from "react-redux";
import PlaylistsPage from "./PlaylistsPage";

export default function You() {
  const authUser = useSelector((state) => state.auth.user);
  const userId = authUser?.user?._id;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold">History</h2>
        <p className="text-sm text-zinc-500">Coming soon</p>
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
