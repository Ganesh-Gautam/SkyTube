import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  toggleSubscription,
  fetchChannelSubscribers,
  resetError
} from "../features/subscription/subscriptionSlice";

function SubscribeButton({ channelId }) {
  const dispatch = useDispatch();

  const { isSubscribed, subscriberCount, loading, error } = useSelector(
    (state) => state.subscription
  );

  useEffect(() => {
    if (channelId) {
        dispatch(resetError())
        dispatch(fetchChannelSubscribers(channelId));
    }
  }, [dispatch, channelId]);

  const handleSubscribe = async () => {
    try {
      await dispatch(toggleSubscription(channelId)).unwrap();
      dispatch(fetchChannelSubscribers(channelId));
    } catch (err) {
      console.error("Subscription Error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className={`px-4 py-2 rounded-md font-semibold transition-all duration-200
            ${isSubscribed
              ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
              : "bg-red-600 text-white hover:bg-red-700"}
            ${loading ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          {loading
            ? "Processing..."
            : isSubscribed
            ? "Subscribed"
            : "Subscribe"}
        </button>

        <span className="text-sm text-gray-600">
          {subscriberCount ?? 0} Subscribers
        </span>
      </div>

      {/* Error message from backend */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}

export default SubscribeButton;