import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchVideos } from "../features/video/videoSlice";
import VideoCard from "../components/VideoCard.jsx";
import VideoCardSkeleton from "../components/VideoCardSkeleton.jsx";
import useInfiniteFeed from "../hooks/useInfiniteFeed.js";

const Home = () => {
  const dispatch = useDispatch();
  const { videos, isLoading } = useSelector((state) => state.video);
  const { visibleItems, hasMore, sentinelRef } = useInfiniteFeed({
    items: videos,
    initialCount: 9,
    step: 6,
    resetKey: Array.isArray(videos) ? videos.length : 0,
  });

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);
   
  return (
    <div className="space-y-10">
      <section className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50"> Explore</h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {Array.isArray(videos) ? videos.length : 0} videos ready to watch
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        ) : Array.isArray(videos) && videos.length > 0 ? (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {visibleItems.map((video) => (
                <div
                  key={video._id}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <VideoCard video={video} />
                </div>
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

        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center sm:p-10 dark:border-zinc-800 dark:bg-zinc-900/40">
            <h3 className="text-base font-semibold text-zinc-900 sm:text-lg dark:text-zinc-100">No videos yet</h3>
            <p className="mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
              Start the library with your first upload and give people something to discover.
            </p>
            <Link
              to="/upload"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 sm:px-6 sm:py-3 sm:text-base dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Upload the first video
            </Link>
          </div>

        )}
      </section>

    
    </div>
  );
};

export default Home;
