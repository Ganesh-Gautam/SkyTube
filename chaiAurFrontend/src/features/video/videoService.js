import axios from "../../api/axios.js";

const publishVideo = async (formData) => {
    const res = await axios.post("/videos/upload", formData); 
    return res.data.data;
};

const getAllVideos = async (params) => {
    const res = await axios.get("/videos", { params });
    return res.data.data;
};

const getVideoById = async (videoId) => {
    const res = await axios.get(`/videos/${videoId}`);
    return res.data.data;
};

const deleteVideo = async (videoId) => {
    await axios.delete(`/videos/${videoId}`); 
    return videoId;
};

const updateVideo = async ({ videoId, formData }) => {
    const res = await axios.patch(`/videos/${videoId}`, formData); 
    return res.data.data;
};

const togglePublishStatus = async (videoId) => {
    const res = await axios.patch(`/videos/toggle/publish/${videoId}`);
    return res.data.data; // expects { isPublished }
};

export default {
    publishVideo,
    getAllVideos,
    getVideoById,
    deleteVideo,
    updateVideo,
    togglePublishStatus,
};
