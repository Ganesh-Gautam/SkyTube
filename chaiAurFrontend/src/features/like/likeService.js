import axios from "../../api/axios";

export const ServiceToggleVideoLike = async (videoId) => {
  const res = await axios.post(`/likes/toggle/v/${videoId}`); 
  return res.data.data
};

export const ServiceToggleCommentLike = (commentId) => {
  const res = axios.post(`/likes/toggle/c/${commentId}`);
  return res.data.data
};

export const ServiceToggleTweetLike = async (tweetId) => {
  const res = await axios.post(`/likes/toggle/t/${tweetId}`);
  return res.data.data;
};
