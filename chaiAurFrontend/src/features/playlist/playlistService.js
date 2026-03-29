import axios from "../../api/axios.js";


const createPlaylist = async ({ name, description }) => {
    const { data } = await axios.post(`/playlist/`, { name, description });
    return data.data;
};

const getUserPlaylists = async (userId) => { 
    const { data } = await axios.get(`/playlist/u/${userId}`);
    return data.data;
};

const getPlaylistById = async (playlistId) => {
    const { data } = await axios.get(`/playlist/p/${playlistId}`);
    return data.data;
};

const updatePlaylist = async ({ playlistId, name, description }) => {
    const { data } = await axios.patch(`/playlist/p/${playlistId}`, { name, description });
    return data.data;
};

const deletePlaylist = async (playlistId) => {
    await axios.delete(`/playlist/p/${playlistId}`);
    return playlistId;
};

const addVideoToPlaylist = async ({ videoId, playlistId }) => {
    const { data } = await axios.patch(`/playlist/add/${videoId}/${playlistId}`);
    return data.data;
};

const removeVideoFromPlaylist = async ({ videoId, playlistId }) => {
    const { data } = await axios.patch(`/playlist/remove/${videoId}/${playlistId}`);
    return data.data;
};

export default {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
};
