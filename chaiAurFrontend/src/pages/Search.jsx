import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import VideoCard from "../components/VideoCard.jsx";
import VideoCardSkeleton from "../components/VideoCardSkeleton.jsx";
import {
  addRecentSearch,
  searchVideos,
  selectSearchLoading,
  selectSearchResults,
  selectVideoError,
} from "../features/video/videoSlice.js";

const DATE_FILTERS = [
  { value: "any", label: "Any time" },
  { value: "24h", label: "Last 24 hours" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
];

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "title:asc", label: "Title A-Z" },
  { value: "title:desc", label: "Title Z-A" },
  { value: "duration:asc", label: "Longest duration" },
  { value: "duration:desc", label: "Shortest duration" },
];

const matchesDateFilter = (video, dateFilter) => {
  if (dateFilter === "any") return true;

  const createdAt = new Date(video.createdAt).getTime();
  if (Number.isNaN(createdAt)) return false;

  const now = Date.now();
  const ranges = {
    "24h": 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000,
  };

  return now - createdAt <= ranges[dateFilter];
};

export default function Search() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query")?.trim() ?? "";
  const date = searchParams.get("date") || "any";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortType = searchParams.get("sortType") || "desc";
  const results = useSelector(selectSearchResults);
  const isLoading = useSelector(selectSearchLoading);
  const error = useSelector(selectVideoError);

  useEffect(() => {
    dispatch(searchVideos({ query, sortBy, sortType, limit: 24 }));
    if (query) {
      dispatch(addRecentSearch(query));
    }
  }, [dispatch, query, sortBy, sortType]);

  const filteredResults = results.filter((video) => matchesDateFilter(video, date));
  const selectedSort = `${sortBy}:${sortType}`;

  const updateParam = (key, value, fallback) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === fallback) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handleSortChange = (event) => {
    const [nextSortBy, nextSortType] = event.target.value.split(":");
    updateParam("sortBy", nextSortBy, "createdAt");
    updateParam("sortType", nextSortType, "desc");
  };

  const handleDateChange = (event) => {
    updateParam("date", event.target.value, "any");
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Search & Discovery
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
              {query ? `Results for "${query}"` : "Discover videos"}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Search by title or description, then narrow things down with sort and date filters.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-zinc-700">
              Sort
              <select
                value={selectedSort}
                onChange={handleSortChange}
                className="mt-1 block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-zinc-700">
              Uploaded
              <select
                value={date}
                onChange={handleDateChange}
                className="mt-1 block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              >
                {DATE_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700">
          {error || "Something went wrong while loading search results."}
        </div>
      ) : filteredResults.length > 0 ? (
        <>
          <p className="text-sm text-zinc-500">
            {filteredResults.length} video{filteredResults.length === 1 ? "" : "s"} found
          </p>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredResults.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-zinc-800">
            {query ? "No videos matched this search" : "No videos to discover yet"}
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Try a different keyword, switch the date filter, or sort by a different field.
          </p>
        </div>
      )}
    </section>
  );
}
