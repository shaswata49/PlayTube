import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";
import { ApiError} from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getVideoComments = asyncHandler(async (req,res) => {

    const {videoId} = req.params


})
