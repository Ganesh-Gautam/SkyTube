import mongoose from "mongoose"
import {Video} from "../models/video.model.js" 
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const { channelName } = req.params;

    if (!channelName?.trim()) {
        throw new ApiError(400, "Channel name is missing");
    }

    const channel = await User.findOne({
        $or: [{ userName: channelName }, { email: channelName }]
    }).select("userName avatar coverImage");

    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const stats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channel._id)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "comments"
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 }, 
                totalLikes: { $sum: { $size: "$likes" } },
                totalComments: { $sum: { $size: "$comments" } }
            }
        }
    ]);

    const channelStats = stats[0] || {
        totalVideos: 0, 
        totalLikes: 0,
        totalComments: 0
    };

    return res.status(200).json(
        new ApiResponse(200, {
            ...channelStats,
            channelId: channel._id,
            userName: channel.userName,
            avatar: channel.avatar,
            coverImage: channel.coverImage
        }, "Channel stats fetched successfully")
    );
});


const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelName } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!channelName?.trim()) {
    throw new ApiError(400, "Channel Name/Email is missing");
  }

  const channel = await User.findOne({
    $or: [{ userName: channelName }, { email: channelName }]
  });

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const isOwner = req.user?._id?.toString() === channel._id.toString();

  const options = {
    page: Number(page),
    limit: Number(limit),
    sort: { createdAt: -1 }
  };

  const videos = await Video.aggregatePaginate(
    Video.aggregate([
      {
        $match: {
          owner: channel._id,
          ...(isOwner ? {} : { isPublished: true })
        }
      },
      {
        $project: {
          thumbnail: 1,
          title: 1,
          description: 1,
          isPublished: 1,
          duration: 1,
          createdAt: 1
        }
      }
    ]),
    options
  );

  return res.status(200).json(
    new ApiResponse(200, videos, "Channel videos fetched successfully")
  );
});

export {
    getChannelStats, getChannelVideos
}
