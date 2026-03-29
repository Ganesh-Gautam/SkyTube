import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux"; 
import { FiEdit , FiEdit2} from "react-icons/fi";
import channelService from "../features/channel/channelService.js";
import ChannelVideoCard from "../components/ChannelVideoCard.jsx";
import SubscribeButton from "../components/SubscribeButton";
import PlaylistsPage from "./PlaylistsPage.jsx";
import CommunityTab from "../components/tweet/CommunityTab.jsx";



export default function Channel() {
  const { channelName } = useParams(); 
  const { user } = useSelector((state) => state.auth); 

  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("videos");

  const isOwner = useMemo(() => (
    user?.user?.userName?.trim().toLowerCase() ===
    channelName?.trim().toLowerCase()
  ), [user, channelName]);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const statsRes = await channelService.getChannelStats(channelName);
        const videosRes = await channelService.getChannelVideos(channelName);

        setStats(statsRes);
        setVideos(videosRes.docs || videosRes.videos);
      } catch {
        setError("Failed to load channel data.");
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, [channelName]);

  if (loading) return <p className="p-6">Loading channel...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div>
      {/* Channel Header */}
      <div className="relative"> 
        {stats?.coverImage ? (
          <img
            src={stats.coverImage}
            alt="Channel cover"
            className="w-full h-48 object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-48 bg-linear-to-r from-gray-700 to-gray-900" />
        )}

        <div className="flex items-center gap-4 p-6">
          <img
            src={stats?.avatar}
            alt={`${channelName} avatar`}
            className="w-24 h-24 rounded-full border-4 border-white"
          />

          <div>
            <h1 className="text-2xl font-bold">{channelName}</h1>
            <p className="text-gray-500">
              {stats?.totalVideos} videos <br/> 
            </p>
            <SubscribeButton channelId={stats?.channelId} />
          </div>
        </div>
        <div className="absolute top-4 right-6 flex flex-col gap-3">

          {isOwner && (
            <Link to={`/channel/${channelName}/edit`}>
              <button
                className="absolute top-4 right-6 flex items-center gap-2
                          bg-linear-to-r from-yellow-400 to-yellow-500
                          text-gray-900 font-semibold text-sm
                          px-4 py-2.5 rounded-xl
                          shadow-md backdrop-blur-md
                          hover:from-yellow-500 hover:to-yellow-600
                          hover:shadow-xl hover:scale-105
                          active:scale-95
                          transition-all duration-200 ease-in-out"
              >
                <FiEdit size={18} />
                Customize Channel
              </button>
            </Link>
          )}

          {isOwner && (
            <Link to={`/studio`}>
              <button
                title="Manage in Creator Studio"
                className="absolute top-4 right-44 flex items-center gap-2
                          bg-white/80 backdrop-blur-md
                          text-gray-700 font-medium text-sm
                          border border-gray-200
                          px-4 py-2.5 rounded-xl
                          shadow-sm
                          hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300
                          hover:shadow-md hover:scale-105
                          active:scale-95
                          transition-all duration-200 ease-in-out"
              >
                <FiEdit2 size={14} />
                Manage Videos
              </button>
            </Link>
          )}

        </div>
          
      
      </div> 

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6">
        <nav className="flex gap-6 text-sm font-medium">
          {["videos","playlists", "community", "about"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 border-b-2 transition-colors ${
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

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <ChannelVideoCard key={video._id} video={video} isOwner={isOwner} />
            ))}
          </div>
        )}

        {activeTab === "playlists" && (
            <PlaylistsPage channelUserId={stats?.channelId} />
        )}

        {activeTab === "community" && (
          <CommunityTab channelOwner={channelName} channelId={stats?.channelId} currentUser={user} isOwner={isOwner} />
        )}

        {activeTab === "about" && (
          <div className="space-y-2 text-gray-600">
            <p><strong>Channel Name:</strong> {channelName}</p>
            <p><strong>Total Videos:</strong> {stats?.totalVideos}</p>
            <p><strong>Total Likes:</strong> {stats?.totalLikes}</p>
            <p><strong>Total Comments:</strong> {stats?.totalComments}</p>
            <p className="mt-4">This is the about section. You can add channel description, creation date, etc.</p>
          </div>
        )}
      </div>
    </div>
  );
}
