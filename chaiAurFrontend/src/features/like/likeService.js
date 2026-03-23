import axios from "../../api/axios";

export const ServiceToggleVideoLike = async (videoId) => {
  const res = await axios.post(`/likes/toggle/v/${videoId}`); 
  return res.data.data
};

export const ServiceToggleCommentLike = (commentId) => {
  const res = axios.post(`/likes/toggle/c/${commentId}`);
  return res.data.data
};

export const ServiceToggleTweetLike = (tweetId) => { 
  const res = axios.post(`/likes/toggle/t/${tweetId}`);
  console.log(res.data.data)
  return res.data.data
};