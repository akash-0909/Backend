import asyncHandler from "express-async-handler";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import  ApiError  from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Video unliked successfully"
                )
            );
    }

    const like = await Like.create({
        video: videoId,
        likedBy: req.user._id
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                like,
                "Video liked successfully"
            )
        );
});
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Comment unliked successfully"
                )
            );
    }

    const like = await Like.create({
        comment: commentId,
        likedBy: req.user._id
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                like,
                "Comment liked successfully"
            )
        );
});
const getVideoLikeCount = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const likeCount = await Like.countDocuments({
        video: videoId
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { likeCount },
                "Video like count fetched successfully"
            )
        );
});
const getCommentLikeCount = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const likeCount = await Like.countDocuments({
        comment: commentId
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { likeCount },
                "Comment like count fetched successfully"
            )
        );
});
const isVideoLiked = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const like = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { isLiked: !!like },
                "Video like status fetched successfully"
            )
        );
});
const isCommentLiked = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const like = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { isLiked: !!like },
                "Comment like status fetched successfully"
            )
        );
});
export { toggleVideoLike,toggleCommentLike,getVideoLikeCount,getCommentLikeCount,isVideoLiked,isCommentLiked};