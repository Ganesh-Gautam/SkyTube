import mongoose, {isValidObjectId} from "mongoose";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const publishAVideo=asyncHandler(async (req, res)=>{
    if(!req.user._id){
        throw new ApiError(400,"user not found")
    }
    const {title, description} = req.body;
    const videoLocalPath= req.files?.videoFile[0]?.path;
    const thumbnailLocalPath= req.files?.thumbnail[0]?.path;
    if (!videoLocalPath){
        throw new ApiError(400, "video file is required")
    }    
    if (!thumbnailLocalPath){
        throw new ApiError(400, "thumbnail of video is required")
    }
    if (!title){
        throw new ApiError(400, "video title is required")
    }

    const videoFile= await uploadOnCloudinary(videoLocalPath);
    const thumbnail= await uploadOnCloudinary(thumbnailLocalPath);

    if(!videoFile){
        throw new ApiError(500, "video is failed to upload");
    }
    if(!thumbnail){
        throw new ApiError(500, "thumbnail is failed to upload");
    }

    const video= await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videoFile.duration || 0,
        owner:req.user._id
    });
    if(!video){
        throw new ApiError(500, "Something went wrong while creating video ");
    }

    return res.status(201).json(
        new ApiResponse(201,video,"Video Published successfully")
    );
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }
    const userId = req.user?._id;

    const pipeline = [
    {
        $match: { _id: new mongoose.Types.ObjectId(videoId) }
    },
    {
        $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
            { $project: { userName: 1, avatar: 1 } }
        ]
        }
    },
    { $unwind: "$owner" },
    {
        $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes"
        }
    },
    {
        $addFields: {
        likeCount: { $size: "$likes" },
        isLiked: {
            $anyElementTrue: {
            $map: {
                input: "$likes",
                as: "like",
                in: { $eq: ["$$like.likedBy", userId] }
            }
            }
        }
        }
    },
    {
        $project: {
        likes: 0    
        }
    }
    ];

    const video = await Video.aggregate(pipeline);

    if (!video.length) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(201).json(
        new ApiResponse(201, video[0], "Video fetched successfully")
    );
});

const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query;

    const allowedSortFields = ['createdAt','duration','title'];
    const validSortBy = allowedSortFields.includes(sortBy)? sortBy : 'createdAt';
    const validLimit =Math.min(Math.max(Number(limit),1),50);
    const validPage = Math.max(Number(page),1);

    const filter = {};

    if(query){
        filter.$or=[
            {title: {$regex: query, $options: 'i'}},
            {description: {$regex: query, $options: 'i'}}
        ];
    }

    if(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
        }
        filter.owner = userId;
    }
    const sort = {[validSortBy]: sortType==="asc"?1:-1};
    const skip = (validPage-1)*validLimit;

    const [videos,total]=await Promise.all([
        Video.find(filter)
        .populate("owner","userName avatar")
        .sort(sort).skip(skip)
        .limit(validLimit).lean(),
        Video.countDocuments(filter)
    ]);

    return res.status(200).json(
        new ApiResponse(200,{
            videos,
            pagination:{
                total,
                page: validPage,
                limit:validLimit,
                totalPages: Math.ceil(total/validLimit)
            }
        },videos.length>0 ?  "Videos fetched successfully" : "No videos found")
    )
        
});

const updateVideo = asyncHandler(async (req, res)=>{
    const { videoId}= req.params;
    const {title , description}= req.body;
    const thumbnailLocalPath= req.files?.thumbnail[0]?.path;

    if(!title){
        throw new ApiError(400,"tilte is required")
    } 
    
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "video not found")
    }
    if(video.owner.toString()!== req.user._id.toString()){
        throw new ApiError(403, "You are not allowed to update this video");
    }
    const thumbnail =null
    if(thumbnailLocalPath){
        thumbnail=await uploadOnCloudinary(thumbnailLocalPath)
        if(!thumbnail){
            throw new ApiError(500, "thumbnail is failed to upload");
        }
    }
    

    if(title) video.title = title;
    if(description) video.description = description;
    if(thumbnail) video.thumbnail=thumbnail.url;
    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    );
})

const deleteVideo = asyncHandler(async(req, res)=>{
    const {videoId}= req.params;

    const video = await Video.findById(videoId);
    if(!video) throw new ApiError(404, "video not found");

    if(video.owner.toString()!== req.user._id.toString()){
        throw new ApiError(403, "You are not allowed to delete this video");
    }
    await Video.findByIdAndDelete(videoId);

    return res.status(200).json(
        new ApiResponse(200,{},"video deleted successfully")
    );

})

const togglePublishStatus = asyncHandler(async(req,res)=>{
    const {videoId}= req.params;

    const video = await Video.findById(videoId);
    if(!video) throw new ApiError(404, "video not found");

    if(video.owner.toString()!== req.user._id.toString()){
        throw new ApiError(403, "You are not allowed to delete this video");
    }

    video.isPublished =!video.isPublished;
    await video.save();

    return res.status(200).json(
        new ApiResponse(200,video, "Publish status toggled successfully")
    );

})

export {
    publishAVideo, getVideoById, getAllVideos,
    updateVideo, deleteVideo, togglePublishStatus
}

