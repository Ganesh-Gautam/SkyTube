import axios from "../../api/axios";

const getChannelStats = async (channelName) => {
  const res = await axios.get(`/dashboard/stats/${channelName}`);
  return res.data.data;
};


const getChannelVideos = async (channelName, params) => {
  const res = await axios.get(`/dashboard/videos/${channelName}`, {
    params,
  }); 
  return res.data.data;
};

const updateAccountDetails = async (data) => {
  const res = await axios.patch(
    "/users/update-account",
    data,
    { withCredentials: true }
  );
  return res.data.data;
};

const updateAvatar = async (formData) => {
  const res = await axios.patch(
    "/users/avatar",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true
    }
  );
  return res.data.data;
};

const updateCoverImage = async (formData) => {
  const res = await axios.patch(
    "/users/coverImage",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true
    }
  );
  return res.data.data;
};

const changePassword = async (data) => {
  const res = await axios.post(
    "/users/change-password",
    data,
    { withCredentials: true }
  );
  return res.data.data;
};


export default {
  getChannelStats, 
  getChannelVideos,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  changePassword
};
