import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscribedChannels } from "../features/subscription/subscriptionSlice"; 
import { Link } from "react-router-dom";
import useInfiniteFeed from "../hooks/useInfiniteFeed.js";

function SubscriptionsPage() {
  const dispatch = useDispatch();

  const {
    subscribedChannels = [],
    loading,
    error
  } = useSelector((state) => state.subscription);
  const { visibleItems, hasMore, sentinelRef } = useInfiniteFeed({
    items: subscribedChannels,
    initialCount: 9,
    step: 6,
    resetKey: subscribedChannels.length,
  });

  useEffect(() => {
    dispatch(fetchSubscribedChannels());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchSubscribedChannels());
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Subscribed Channels</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-lg border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-zinc-200" />
                <div className="space-y-2">
                  <div className="h-4 w-36 rounded bg-zinc-200" />
                  <div className="h-3 w-24 rounded bg-zinc-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Subscribed Channels</h2>

        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600 mb-4">
            Error loading subscriptions: {error}
          </p>

          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!subscribedChannels.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Subscribed Channels</h2>

        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            You haven't subscribed to any channels yet
          </p>

          <Link
            to="/explore"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Channels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b">
        <h2 className="text-2xl font-bold">Subscribed Channels</h2>

        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {subscribedChannels.length}{" "}
          {subscribedChannels.length === 1 ? "channel" : "channels"}
        </span>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((channel) => (
          <div
            key={channel.channelId}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4"
          > 
            <div className="flex items-start space-x-4">

              {/* Avatar */}
              <Link to={`/channel/${channel.channelId}`}>
                <img
                  src={channel.avatar || "/default-avatar.png"}
                  alt={`${channel.userName}'s avatar`}
                  className="w-16 h-16 rounded-full object-cover border"
                  loading="lazy"
                  decoding="async"
                  onError={(e) =>
                    (e.currentTarget.src = "/default-avatar.png")
                  }
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/channel/${channel?.userName}`}>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {channel.userName}
                  </h3>
                </Link> 
              </div>

            </div>
          </div>
        ))}
      </div>
      {hasMore ? (
        <div
          ref={sentinelRef}
          className="mt-6 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-5 text-center text-sm text-zinc-500"
        >
          Loading more channels...
        </div>
      ) : null}

    </div>
  );
}

export default SubscriptionsPage;
