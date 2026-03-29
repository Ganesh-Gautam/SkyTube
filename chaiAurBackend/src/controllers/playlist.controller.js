import mongoose , {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async(req, res)=>{
    const {name, description} = req.body;

    if(!name?.trim()){
        throw new ApiError(400, "Playlist name is required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner : req.user?._id
    });

    return res.status(201).json(
        new ApiResponse(201,playlist, "Playlist created succesfully")
    );

})

const getUserPlaylists = asyncHandler(async(req, res)=>{
    const {userId }= req.params;  
    const pipeline = [
        {
            $match : {
                owner : new mongoose.Types.ObjectId(userId)
            }
        },{
            $lookup : {
                from : "videos",
                localField : "videos",
                foreignField : "_id",
                as : "videos"
            } 
        },
        {
            $project : {
                name : 1,
                description : 1,
                createdAt : 1,
                updatedAt : 1,
                videos: 1 
            }
        },{
            $sort : {createdAt : -1}
        }
    ]
    
    const playlists = await Playlist.aggregate(pipeline)
    
    return res.status(200).json(
        new ApiResponse(200, playlists, "User playlists fetched successfully")
    )
})

const getPlaylistById = asyncHandler(async(req, res)=>{
    const {playlistId} = req.params;

    const playlist = await Playlist.findById(playlistId)
        .populate("videos")
        .populate("owner","userName avatar");

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200,playlist, "Playlist fetched successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req,res)=>{
    const {playlistId, videoId} = req.params;

    const playlist =await Playlist.findById(playlistId);
    if(!playlist) throw new ApiError(404, "Playlist not found");

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not allowed to modify this playlist");
    }

    if(playlist.videos.includes(videoId)){
        throw new ApiError(400, "Video already in playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();
    
    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist")
    );
})

const removeVideoFromPlaylist  = asyncHandler(async (req, res)=>{
const {playlistId , videoId} = req.params;

const playlist = await Playlist.findById(playlistId);
if (!playlist) throw new ApiError(404, "Playlist not found");

if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not allowed to modify this playlist");
}

playlist.videos= playlist.videos.filter(
    (vid)=> vid.toString() !== videoId.toString()
)

await playlist.save();

return res.status(200).json(
    new ApiResponse(200,playlist, "Video removed from Playlis")
)

})

const updatePlaylist = asyncHandler(async(req, res)=>{
    const { playlistId } = req.params;
    const { name, description } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not allowed to update this playlist");
    }

    if (name) playlist.name = name;
    if (description) playlist.description = description;

    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist updated successfully")
    );
})

const deletePlaylist = asyncHandler(async(req, res)=>{
    const {playlistId} = req.params;  
    
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not allowed to delete this playlist");
    }

    await playlist.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "Playlist deleted successfully")
    );

})

export {
    createPlaylist ,
    getUserPlaylists , getPlaylistById,
    addVideoToPlaylist, removeVideoFromPlaylist , 
    updatePlaylist , deletePlaylist,
}