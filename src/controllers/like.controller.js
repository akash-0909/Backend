import asyncHandler from "express-async-handler";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


// ==========================================
// TOGGLE VIDEO LIKE
// ==========================================

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

    // UNLIKE
    if (existingLike) {

        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Video unliked successfully",
                    {}
                )
            );
    }

    // LIKE
    const like = await Like.create({
        video: videoId,
        likedBy: req.user._id
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "Video liked successfully",
                like
            )
        );
});


// ==========================================
// TOGGLE COMMENT LIKE
// ==========================================

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

    // UNLIKE COMMENT
    if (existingLike) {

        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Comment unliked successfully",
                    {}
                )
            );
    }

    // LIKE COMMENT
    const like = await Like.create({
        comment: commentId,
        likedBy: req.user._id
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "Comment liked successfully",
                like
            )
        );
});


// ==========================================
// GET VIDEO LIKE COUNT
// ==========================================

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
                "Video like count fetched successfully",
                {
                    likeCount
                }
            )
        );
});


// ==========================================
// GET COMMENT LIKE COUNT
// ==========================================

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
                "Comment like count fetched successfully",
                {
                    likeCount
                }
            )
        );
});


// ==========================================
// CHECK VIDEO LIKE STATUS
// ==========================================

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
                "Video like status fetched successfully",
                {
                    isLiked: !!like
                }
            )
        );
});


// ==========================================
// CHECK COMMENT LIKE STATUS
// ==========================================

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
                "Comment like status fetched successfully",
                {
                    isLiked: !!like
                }
            )
        );
});


export {
    toggleVideoLike,
    toggleCommentLike,
    getVideoLikeCount,
    getCommentLikeCount,
    isVideoLiked,
    isCommentLiked
};