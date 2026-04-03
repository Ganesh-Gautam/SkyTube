import axios from "../../api/axios.js";

const getWatchHistory = async () => {
  const res = await axios.get("/users/history");
  return res.data.data;
};

const clearWatchHistory = async () => {
  const res = await axios.delete("/users/history");
  return res.data.data;
};

const getLikedVideos = async () => {
  const res = await axios.get("/likes/videos");
  return res.data.data;
};

const removeLikedVideo = async (videoId) => {
  await axios.post(`/likes/toggle/v/${videoId}`);
  return videoId;
};

export default {
  getWatchHistory,
  clearWatchHistory,
  getLikedVideos,
  removeLikedVideo,
};
