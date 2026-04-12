import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiEdit, FiEdit2 } from "react-icons/fi";
import channelService from "../features/channel/channelService.js";
import ChannelVideoCard from "../components/ChannelVideoCard.jsx";
import SubscribeButton from "../components/SubscribeButton";
import PlaylistsPage from "./PlaylistsPage.jsx";
import CommunityTab from "../components/tweet/CommunityTab.jsx";
import useInfiniteFeed from "../hooks/useInfiniteFeed.js";

export default function Channel() {
  const { channelName } = useParams();
  const authUser = useSelector((state) => state.auth.user);
  const user = authUser?.user ?? authUser ?? null;

  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("videos");

  const isOwner = useMemo(
    () =>
      user?.userName?.trim().toLowerCase() ===
      channelName?.trim().toLowerCase(),
    [user, channelName]
  );
  const { visibleItems, hasMore, sentinelRef } = useInfiniteFeed({
    items: videos,
    initialCount: 9,
    step: 6,
    resetKey: `${channelName}-${videos.length}`,
  });

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, videosRes] = await Promise.all([
          channelService.getChannelStats(channelName),
          channelService.getChannelVideos(channelName),
        ]);

        setStats(statsRes);
        setVideos(videosRes.docs || videosRes.videos || []);
      } catch {
        setError("Failed to load channel data.");
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, [channelName]);

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="h-48 animate-pulse rounded-2xl bg-zinc-200" />
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 animate-pulse rounded-full bg-zinc-200" />
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div>
      <div className="relative">
        {stats?.coverImage ? (
          <img
            src={stats.coverImage}
            alt="Channel cover"
            className="h-48 w-full rounded-2xl object-cover sm:h-56"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-48 w-full rounded-2xl bg-linear-to-r from-gray-700 to-gray-900 sm:h-56" />
        )}

        <div className="mt-4 flex flex-col gap-4 px-2 sm:px-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={stats?.avatar}
              alt={`${channelName} avatar`}
              className="h-20 w-20 rounded-full border-4 border-white object-cover sm:h-24 sm:w-24"
              loading="lazy"
              decoding="async"
            />

            <div>
              <h1 className="text-2xl font-bold">{channelName}</h1>
              <p className="text-gray-500">{stats?.totalVideos} videos</p>
              {!isOwner ? <SubscribeButton channelId={stats?.channelId} /> : null}
            </div>
          </div>

          {isOwner ? (
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/studio`}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                title="Manage in Creator Studio"
              >
                <FiEdit2 size={14} />
                Manage videos
              </Link>
              <Link
                to={`/channel/${channelName}/edit`}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-yellow-400 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-md transition hover:from-yellow-500 hover:to-yellow-600"
              >
                <FiEdit size={18} />
                Customize channel
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 border-b border-gray-200 px-2 sm:px-4">
        <nav className="flex gap-4 overflow-x-auto text-sm font-medium sm:gap-6">
          {["videos", "playlists", "community", "about"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 py-3 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-2 sm:p-6">
        {activeTab === "videos" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((video) => (
                <ChannelVideoCard key={video._id} video={video} isOwner={isOwner} />
              ))}
            </div>
            {hasMore ? (
              <div
                ref={sentinelRef}
                className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-5 text-center text-sm text-zinc-500"
              >
                Loading more videos...
              </div>
            ) : null}
          </div>
        )}

        {activeTab === "playlists" && <PlaylistsPage channelUserId={stats?.channelId} />}

        {activeTab === "community" && (
          <CommunityTab
            channelOwner={channelName}
            channelId={stats?.channelId}
            currentUser={user}
            isOwner={isOwner}
          />
        )}

        {activeTab === "about" && (
          <div className="space-y-2 text-gray-600">
            <p>
              <strong>Channel Name:</strong> {channelName}
            </p>
            <p>
              <strong>Total Videos:</strong> {stats?.totalVideos}
            </p>
            <p>
              <strong>Total Likes:</strong> {stats?.totalLikes}
            </p>
            <p>
              <strong>Total Comments:</strong> {stats?.totalComments}
            </p>
            <p className="mt-4">
              This is the about section. You can add channel description, creation date, etc.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
