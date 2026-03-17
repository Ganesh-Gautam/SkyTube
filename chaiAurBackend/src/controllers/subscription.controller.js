import mongoose, {isValidObjectId} from "mongoose";
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"

import { asyncHandler } from "../utils/asyncHandler.js" 

const toggleSubscription= asyncHandler(async(req, res)=>{
    const {channelId}=req.params;
    const subscriberId= req.user._id;
    if(!subscriberId) {
        throw new ApiError(400,"login to subscribe/unsubscribe")
    }

    if(!channelId){
        throw new ApiError(400,"Channel Id is required");
    }
    if(String(channelId)=== String(subscriberId)) {
        throw new ApiError(400,"You cannot subscribe to yourself");
    }

    const subscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    }); 
    if(subscription){ 
        await Subscription.deleteOne({_id:subscription._id});
        return res.status(200).json(
            new ApiResponse(200, {isSubscribed:false},"Unsubscribed successfully")
        )
    } 
    await Subscription.create({
        subscriber: subscriberId,
        channel: channelId
    });
    return res.status(201).json(
        new ApiResponse(201, {isSubscribed: true}, "Subscribed successfully")
    );
})

const getUserChannelSubscribers= asyncHandler(async(req, res)=>{
    const {channelId}= req.params;
    const subscriberId= req.user?._id;   
    const isSubscribed = await Subscription.exists({
        subscriber: subscriberId,
        channel: channelId
    });


    const subscribers= await Subscription.aggregate([
        {
            $match: { channel: new mongoose.Types.ObjectId(channelId)}
        },{
            $lookup: {
                from : "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscribedBy"
            }
        },{$unwind: "$subscribedBy"},
        {
            $project: {
                _id:0,
                subscriberId:"$subscribedBy._id",
                userName: "$subscribedBy.userName",
                avatar: "$subscribedBy.avatar"
            }
        }
    ]);
    return res.status(200).json(
        new ApiResponse(
            200,{subscriberCount: subscribers.length , isSubscribed: Boolean(isSubscribed) },
            "Subscribers fetched successfully"
        )
    )
})

const getSubscribedChannels=asyncHandler(async(req, res)=>{ 
    const userId= req.user?._id
    if (!userId) {
        throw new ApiError(404, "User not found");
    }
    const channels = await Subscription.aggregate([
        {
            $match:{
                subscriber: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from :"users",
                localField: "channel",
                foreignField: "_id",
                as : "subscribedTo"
            }
        }, {$unwind: "$subscribedTo"},
        {
            $project: {
                _id: 0,
                channelId: "$subscribedTo._id",
                userName: "$subscribedTo.userName",
                avatar: "$subscribedTo.avatar"
            }
        }
    ]);
    return res.status(200).json(
        new ApiResponse(200,{channelsSubscribedToCount: channels.length,channels}, 
            "Subscribed channels fetched successfully")
    )
 
})

export {
    toggleSubscription, getUserChannelSubscribers, getSubscribedChannels
}