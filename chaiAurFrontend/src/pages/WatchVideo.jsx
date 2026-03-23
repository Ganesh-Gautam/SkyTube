import { useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoById , toggleVideoLike} from "../features/video/videoSlice";
import CommentSection from "../components/comment/CommentSection.jsx";
import SubscribeButton from "../components/SubscribeButton";

export default function WatchVideo() {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentVideo } = useSelector((state) => state.video);


  useEffect(() => {
    dispatch(fetchVideoById(videoId)); 
  }, [dispatch, videoId]);

  if (!currentVideo) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <video
        src={currentVideo.videoFile}
        controls
        className="w-full rounded"
      />

      <h2 className="text-xl font-semibold mt-4">
        {currentVideo.title}
      </h2>

      <div className="flex items-center gap-4 mt-4">
        <img
          src={currentVideo.owner?.avatar}
          alt="channel"
          className="w-12 h-12 rounded-full cursor-pointer"
          onClick={() =>
            navigate(`/channel/${currentVideo.owner?.userName}`)
          }
        />

        <div>
          <p
            className="font-semibold cursor-pointer"
            onClick={() =>
              navigate(`/channel/${currentVideo.owner?.userName}`)
            }
          >
            {currentVideo.owner?.userName}
          </p>
        </div>
        <SubscribeButton channelId={currentVideo.owner._id} />
      </div>

      <button onClick={() => dispatch(toggleVideoLike(currentVideo._id))}>
        {currentVideo?.isLiked ? "❤️" : "🤍"} {" "}
        {currentVideo?.likeCount || 0}
      </button>

      <p className="mt-3">{currentVideo.description}</p>

      <CommentSection videoId={videoId} />
    </div>
  );
}