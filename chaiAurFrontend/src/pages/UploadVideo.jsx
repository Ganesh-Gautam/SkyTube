import { createElement, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiCheckCircle,
  FiFilm,
  FiImage,
  FiUploadCloud,
} from "react-icons/fi";
import { uploadVideo } from "../features/video/videoSlice";

const formatFileSize = (size = 0) => {
  if (!size) return "0 MB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

const FilePickerCard = ({
  accept,
  file,
  helperText,
  icon,
  label,
  onChange,
}) => {
  const iconMarkup = createElement(icon, { size: 20 });

  return (
    <label className="group relative block cursor-pointer overflow-hidden rounded-3xl border border-dashed border-zinc-300 bg-white/80 p-5 transition hover:border-sky-400 hover:bg-sky-50/70">
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg shadow-zinc-950/10 transition group-hover:scale-105 group-hover:bg-sky-500">
          {iconMarkup}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-zinc-900">{label}</p>
            {file ? <FiCheckCircle className="text-emerald-500" size={16} /> : null}
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {file ? file.name : helperText}
          </p>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">
            {file ? `${formatFileSize(file.size)} selected` : "Click to browse"}
          </p>
        </div>
      </div>
    </label>
  );
};

export default function UploadVideo() {
  const dispatch = useDispatch();
  const { isLoading, message, isError } = useSelector((state) => state.video);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const canSubmit = useMemo(() => {
    return title.trim() && description.trim() && videoFile && thumbnail && !isLoading;
  }, [description, isLoading, thumbnail, title, videoFile]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    dispatch(uploadVideo(formData));
  };

  return (
    <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-sky-50 via-white to-amber-50 p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl" />
      </div>

      <div className="relative grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
 
        <section className="rounded-4xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.4)] backdrop-blur sm:p-8">
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Upload form
            </p>
            <h2 className="text-2xl font-black tracking-tight text-zinc-950">
              Set up the details
            </h2>
            <p className="text-sm text-zinc-500">
              Fill out the basics and attach both media files before publishing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-800">Video title</label>
              <input
                type="text"
                placeholder="Give your video a scroll-stopping title"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-sky-400 focus:bg-white"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-800">Description</label>
              <textarea
                placeholder="Tell viewers what they should expect from this video"
                className="min-h-32 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-sky-400 focus:bg-white"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FilePickerCard
                accept="video/*"
                file={videoFile}
                helperText="MP4, MOV, or any supported video format"
                icon={FiFilm}
                label="Video file"
                onChange={setVideoFile}
              />
              <FilePickerCard
                accept="image/*"
                file={thumbnail}
                helperText="Upload a strong thumbnail image"
                icon={FiImage}
                label="Thumbnail"
                onChange={setThumbnail}
              />
            </div>

            {isError && message ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {message}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-500">
                {videoFile && thumbnail
                  ? "Everything is attached and ready for upload."
                  : "Add both the video and thumbnail to continue."}
              </p>

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                <FiUploadCloud size={18} />
                {isLoading ? "Uploading..." : "Publish video"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
