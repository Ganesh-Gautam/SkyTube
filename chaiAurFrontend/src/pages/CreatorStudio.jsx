import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  
    selectDeletingId, 
    deleteVideo as deleteVideoThunk
} from "../features/video/videoSlice";
import EditVideoModal from "../components/studio/EditVideoModal.jsx";
import DeleteConfirmModal from "../components/studio/DeleteConfirmModal.jsx";
import channelService from "../features/channel/channelService.js";
import VideoRow from "../components/studio/VideoRow.jsx";

export default function CreatorStudio() {
    const dispatch  = useDispatch();
    const { user } = useSelector((state) => state?.auth);
    const channelName=user?.user?.userName; 

    const deletingId = useSelector(selectDeletingId);    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [editVideo,   setEditVideo]   = useState(null); 
    const [deleteVideo, setDeleteVideo] = useState(null); 
    const [filter,      setFilter]      = useState("all"); 
    const [search,      setSearch]      = useState("");

    useEffect(() => {
        const fetchChannel = async () => {
          try {
            const statsRes = await channelService.getChannelStats(channelName);
            const videosRes = await channelService.getChannelVideos(channelName);

            setStats(statsRes);
            setVideos(videosRes.docs || videosRes.videos);
            } catch {
            setError("Failed to load channel data");
            } finally {
            setLoading(false);
          }
        };
        fetchChannel();
    }, [channelName]);

    if (error) return <p className="p-6 text-red-500">{error}</p>;

    const searchLower = search.toLowerCase(); 
    const filtered = videos
    .filter((v) => {
        if (filter === "public") return v.isPublished;
        if (filter === "private") return !v.isPublished;
        return true;
    })
    .filter((v) =>
        v.title?.toLowerCase().includes(searchLower)
    );

    const handleConfirmDelete = async () => {
        if (!deleteVideo) return;
        dispatch(deleteVideoThunk(deleteVideo._id));
        setDeleteVideo(null);
    };

    const published  = videos.filter((v) => v.isPublished).length;
    const drafts     = videos.length - published;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

                {/* Page header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                            Creator Studio
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                            Manage your videos
                        </p>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Total videos", value: videos.length },
                        { label: "Total Likes", value: stats?.totalLikes},
                        { label: "Total Comments", value: stats?.totalComments },
                        { label: "Published",    value: `${published} / ${drafts} private` },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white dark:bg-zinc-900 rounded-2xl border
                                       border-zinc-200 dark:border-zinc-800 px-5 py-4"
                        >
                            <p className="text-xs text-zinc-400 uppercase tracking-wide font-medium">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Table card */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border
                                border-zinc-200 dark:border-zinc-800 overflow-hidden">

                    {/* Toolbar */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b
                                    border-zinc-100 dark:border-zinc-800 flex-wrap">
                        {/* Search */}
                        <div className="relative flex-1 min-w-45">
                            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400"
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search videos…"
                                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg
                                           bg-zinc-50 dark:bg-zinc-800
                                           border border-zinc-200 dark:border-zinc-700
                                           text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400
                                           focus:outline-none focus:ring-2 focus:ring-blue-500/30
                                           transition-colors"
                            />
                        </div>

                        {/* Filter tabs */}
                        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 gap-0.5">
                            {["all", "public", "private"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors
                                                ${filter === f
                                                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                                                }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="space-y-0">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 px-4 py-3
                                                        border-b border-zinc-100 dark:border-zinc-800 animate-pulse">
                                    <div className="w-28 aspect-video rounded-lg bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full w-48" />
                                        <div className="h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full w-64" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-16 text-center">
                            <svg className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3"
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                {search ? "No videos match your search" : "No videos yet"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                        {["Video", "Visibility", "Date"].map((h) => (
                                            <th key={h}
                                                className="px-4 py-2.5 text-[10px] font-semibold
                                                           text-zinc-400 dark:text-zinc-500
                                                           uppercase tracking-wider text-center first:text-left">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((video) => (
                                        <VideoRow
                                            key={video._id}
                                            video={video}
                                            onEdit={setEditVideo}
                                            onDelete={setDeleteVideo}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {editVideo && (
                <EditVideoModal
                    video={editVideo}
                    onClose={() => setEditVideo(null)}
                />
            )}
            {deleteVideo && (
                <DeleteConfirmModal
                    video={deleteVideo}
                    onConfirm={handleConfirmDelete}
                    onClose={() => setDeleteVideo(null)}
                    isDeleting={deletingId === deleteVideo._id}
                />
            )}
        </div>
    );
}
