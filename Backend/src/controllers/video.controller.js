import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  // const {page = 1, limit = 10, query, sortBy, sortType, userId} = req.query

  const videos = await Video.find();

  return res
    .status(201)
    .json(new ApiResponse(200, videos, "All Video fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const user = await User.findById(req.user?._id);

  if (!user) {
    // Handle the case where the user with the provided ID is not found
    throw new ApiError(400, "User not found");
  }

  if (!title) throw new ApiError(400, "Title is required");
  if (!description) throw new ApiError(400, "Description is required");

  const exsistedVideo = await Video.findOne({
    $and: [{ title }, { user }],
  });

  if (exsistedVideo)
    throw new ApiError(
      409,
      "Video with same Owner and same Title already exsists"
    );

  const videoLocalPath = req.files?.videoFile[0].path;
  const thubnailLocalPath = req.files?.thumbnail[0].path;

  console.log(req.files);

  if (!videoLocalPath) throw new ApiError(400, "Video File is required");
  if (!thubnailLocalPath)
    throw new ApiError(400, "Video Thumbnail is required");

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thubnailLocalPath);

  if (!videoFile) throw new ApiError(400, "Video File is required");
  if (!thumbnail) throw new ApiError(400, "Video Thumbnail is required");

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    owner: user._id,
  });

  const createdVideo = await Video.findById(video._id);

  if (!createdVideo)
    throw new ApiError(500, "Something went wrong while uploadiing the video");

  return res
    .status(201)
    .json(new ApiResponse(200, createdVideo, "Video upoladed successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) throw new ApiError(400, "videoId is missing");

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              email: 1,
            },
          },
        ],
      },
    },
  ]);

  if (!video || video.length === 0) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const { title, description } = req.body;

  const requestedUserId = req.user?._id.toString();

  if (!requestedUserId) {
    throw new ApiError(404, "User ID not found");
  }

  const videoDetails = await Video.findById(videoId);

  if (!videoDetails) {
    throw new ApiError(404, "VideoDetails not found");
  }

  const ownerId = videoDetails.owner.toString();

  if (!title || !description)
    throw new ApiError(400, "All fields are required");

  if (requestedUserId !== ownerId)
    throw new ApiError(403, "You are not authorized to update this video");

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
      },
    },
    { new: true }
  ).select("-videoFile -thumbnail");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const video = await getVideoByIdUtil(req);
  if (!video) throw new ApiError(404, "video not found");

  await deleteFromCloudinary(video.videoFile);
  await deleteFromCloudinary(video.thumbnail);

  const deletedVideo = await Video.findByIdAndDelete(video._id);
  if (!deletedVideo) {
    throw new ApiError(500, "video does not delete");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "video deleted successfully"));
});

export { publishAVideo, getAllVideos, getVideoById, updateVideo };
