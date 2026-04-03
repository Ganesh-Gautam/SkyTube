import mongoose , {isValidObjectId} from "mongoose"
import { Like } from "../models/like.model.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async(req, res)=>{
    const {videoId} =req.params
    const userId = req.user._id;

    const existingLike = await Like.findOne({
        video : videoId,
        likedBy : userId
    });

    if(existingLike) {
        await existingLike.deleteOne();

        return res.status(200).json(
            new ApiResponse(200,  { liked : false}, "Video unliked")
        );
    }
    await Like.create({
        video: videoId, 
        likedBy : userId 
    });

    return res.status(201).json(
        new ApiResponse(201, {liked : true}, "Video liked")
    );

})

const toggleCommentLike = asyncHandler(async(req,res)=>{
    const {commentId} = req.params 
    const userId = req.user._id;

    const existingLike = await Like.findOne({
        comment : commentId,
        likedBy : userId
    });

    let isLiked;
    if(existingLike) {
        await existingLike.deleteOne();
        isLiked = false;
    } else {
        await Like.create({
            comment : commentId, 
            likedBy : userId
        });
        isLiked = true;
    }

    // Always get fresh count from database
    const likeCount = await Like.countDocuments({ comment: commentId });

    return res.status(200).json(
        new ApiResponse(200, { 
            isLiked, 
            likeCount 
        }, isLiked ? "Comment liked" : "Comment unliked")
    );
});

const toggleTweetLike = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params 
    const userId = req.user._id;

    const existingLike = await Like.findOne({
        tweet : tweetId,
        likedBy : userId
    });

    if(existingLike) {
        await existingLike.deleteOne();

        return res.status(200).json(
            new ApiResponse(200,  { liked : false}, "Tweet unliked")
        );
    }
    await Like.create({
        tweet : tweetId, 
        likedBy : userId
    });

    return res.status(201).json(
        new ApiResponse(201, {liked : true}, "Tweet liked")
    );

}) 

const getLikedVideos = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const pipeline = [
        {
            $match : {
                likedBy : new mongoose.Types.ObjectId(userId),
                video: { $ne: null }
            }
        },{
            $lookup : {
                from : "videos",
                localField : "video",
                foreignField : "_id",
                as : "video"
            }
        } ,{$unwind : "$video"},
        {
            $match : {
                "video.isPublished": true
            }
        },{
            $lookup : {
                from : "users",
                localField : "video.owner",
                foreignField : "_id",
                as : "video.owner",
                pipeline : [
                    {
                        $project : {
                            userName : 1,
                            avatar : 1
                        }
                    }
                ]
            }
        },{
            $unwind : "$video.owner"
        },
        {
            $addFields: {
                "video.isLiked": true
            }
        },
        {
            $project : {
                _id : "$video._id",
                videoFile: "$video.videoFile",
                thumbnail: "$video.thumbnail",
                title: "$video.title",
                description: "$video.description",
                duration: "$video.duration",
                createdAt: "$video.createdAt",
                updatedAt: "$video.updatedAt",
                owner: "$video.owner",
                isLiked: "$video.isLiked"
            }
        },{
            $sort : {
                createdAt : -1
            }
        }
    ];

    const likedVideos = await Like.aggregate(pipeline);

    return res.status(200).json(
        new ApiResponse(200, likedVideos , "Liked videos fetched successfully")
    );

})

export { 
    toggleCommentLike, toggleVideoLike, toggleTweetLike, getLikedVideos
}
