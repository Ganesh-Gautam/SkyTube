import mongoose, {isValidObjectId} from "mongoose";
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
 

const createTweet = asyncHandler(async(req,res)=>{
    const {content} = req.body;
    if(!req.user._id){
        throw new ApiError(400,"user not found")
    }
    if(!content){
        throw new ApiError(400,"Provide content of tweet ")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })
    if(!tweet){
        throw new ApiError(500, "Something went wrong while creating tweet ");
    }
    return res.status(201).json(
        new ApiResponse(200, tweet, "User's tweet created Successfully")
    )

})

const updateTweet =asyncHandler(async(req, res)=>{
    const {content} = req.body;
    const { tweetId } = req.params;
    
    if(!content){
        throw new ApiError(400,"content of Tweet is required")
    } 

    const tweet = await Tweet.findByIdAndUpdate({ _id: tweetId, owner: req.user._id },
        {
            $set: {
                content
            }
        },
        {new: true}
    )
    if (!tweet){
        throw new ApiError(400,"no such tweet is found")
    }
    return res.status(200)
    .json( new ApiResponse(200,tweet,"Tweet updated Successfully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user?._id);
        const { tweetId } = req.params;

        const tweet = await Tweet.findById(tweetId)
        if(!tweet){
            throw new ApiError(404,"Tweet not found")
        }
        if (String(tweet.owner) !== String(user._id)) {
            throw new ApiError(403, "Unauthorized access");
        }
        await Tweet.findByIdAndDelete(tweetId);
        res.status(200).json(200,{},"Tweet deleted succesfully")

    } catch(error){
        throw new ApiError(500,"Server Error")
    }
}) 

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const currentUserId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const parsedPage = Number.parseInt(page, 10);
    const parsedLimit = Number.parseInt(limit, 10);

    const safePage = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
    const safeLimit = Number.isNaN(parsedLimit) || parsedLimit < 1
        ? 10
        : Math.min(parsedLimit, 50);

    const pipeline = [
        {
            $match: {
                owner: userId
            }
        },
        {
            $lookup: {
                from: "users",
                let: {
                    ownerId: { $toObjectId: "$owner" }
                },
                as: "owner",
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$ownerId"]
                            }
                        }
                    },
                    {
                        $project: {
                            userName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $lookup: {
                from: "likes",
                let: {
                    tweetId: "$_id",
                    currentUserId: currentUserId
                        ? new mongoose.Types.ObjectId(currentUserId)
                        : null
                },
                as: "likeStats",
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$tweet", "$$tweetId"]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            likesCount: { $sum: 1 },
                            isLiked: {
                                $max: {
                                    $cond: [
                                        { $eq: ["$likedBy", "$$currentUserId"] },
                                        1,
                                        0
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likesCount: {
                    $ifNull: [{ $arrayElemAt: ["$likeStats.likesCount", 0] }, 0]
                },
                isLiked: {
                    $toBool: {
                        $ifNull: [{ $arrayElemAt: ["$likeStats.isLiked", 0] }, 0]
                    }
                }
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $project: {
                likeStats: 0
            }
        }
    ];

    const options = {
        page: safePage,
        limit: safeLimit
    };

    const tweets = await Tweet.aggregatePaginate(
        Tweet.aggregate(pipeline),
        options
    );

    return res.status(200).json(
        new ApiResponse(200, tweets, "User's tweets fetched successfully")
    );
});


export {
    createTweet, getUserTweets, updateTweet, deleteTweet
}
