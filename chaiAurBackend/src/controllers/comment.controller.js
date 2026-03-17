import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments= asyncHandler(async(req, res)=>{
    const {videoId}= req.params;
    const {page=1, limit=10}= req.query;
    const userId = req.user?._id;

    const pipeline =[
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
                parent : null
            }
        },
        {
            $lookup : {
                from : "users",
                localField :"owner",
                foreignField : "_id",
                as: "owner",
                pipeline : [
                    {
                        $project: {
                            userName:1,
                            avatar :1
                        }
                    }
                ]
            }
        },{
            $unwind :"$owner"
        },{
            $lookup : {
                from : "likes",
                localField : "_id",
                foreignField : "comment",
                as : "likes"
            }
        },{
            $addFields  : {
                likeCount : {$size : "$likes"},
                isLiked  : {
                    $in : [
                        new mongoose.Types.ObjectId(userId),
                        "$likes.likedBy"
                    ]
                }
            }
        },{
            $lookup : {
                from : "comments",
                localField : "_id",
                foreignField : "parent",
                as : "replies"
            }
        },
        
        {
            $sort  : {
                createdAt : -1
            }
        }
    ];

    const options = {
        page : Number(page),
        limit: Number (limit)
    }

    const comments = await Comment.aggregatePaginate(
        Comment.aggregate(pipeline),
        options
    )

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    );

})

const addComment = asyncHandler(async (req, res)=>{
    const {videoId}=req.params; 
    const {content, parent = null} = req.body;

    if(!content?.trim()){
        throw new ApiError(400,"Comment content is required");
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const comment = await Comment.create({
        content, video: videoId,
        owner : req.user?._id,
        parent
    });
    await comment.populate("owner", "userName avatar");

    await Video.findByIdAndUpdate(videoId, {
        $inc : {commentCount :1}
    })
    return res.status(201).json(
        new ApiResponse(201,comment, "Comment added succesfully")
    );
})

const updateComment = asyncHandler(async(req,res)=>{
    const {commentId}= req.params;
    const {content}= req.body; 

    if(!content?.trim()){
        throw new ApiError(400,"Updated content is required");
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    const comment = await Comment.findById(commentId);
    if(!comment) throw new ApiError(403,"Comment not found");

    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You can't edit this comment")
    }

    comment.content = content;
    await comment.save(); 

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot delete this comment");
    }

    await comment.deleteOne({
        $or : [
            {_id : commentId},
            {parent : commentId}
        ]
    });

    await Video.findByIdAndUpdate(comment.video,{
        $inc :{commentCount: -1}
    });

    return res.status(200).json(
        new ApiResponse(200, null, "Comment deleted successfully")
    );
});


export {
    getVideoComments, addComment, updateComment, deleteComment
}