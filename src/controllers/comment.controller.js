import asyncHandler from "express-async-handler";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


// ==========================================
// ADD COMMENT
// ==========================================

const addComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
        throw new ApiError(
            400,
            "Comment content is required"
        );
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(
            404,
            "Video not found"
        );
    }

    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id
    });

    if (!comment) {
        throw new ApiError(
            500,
            "Failed to add comment"
        );
    }

    const populatedComment = await Comment
        .findById(comment._id)
        .populate("owner", "username avatar");

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "Comment added successfully",
                populatedComment
            )
        );
});


// ==========================================
// GET VIDEO COMMENTS
// ==========================================

const getVideoComments = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    const comments = await Comment.find({
        video: videoId
    })
        .populate("owner", "username avatar")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Comments fetched successfully",
                comments
            )
        );
});


// ==========================================
// UPDATE COMMENT
// ==========================================

const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
        throw new ApiError(
            400,
            "Comment content is required"
        );
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(
            404,
            "Comment not found"
        );
    }

    if (
        comment.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to update this comment"
        );
    }

    comment.content = content.trim();

    await comment.save();

    const updatedComment = await Comment
        .findById(commentId)
        .populate("owner", "username avatar");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Comment updated successfully",
                updatedComment
            )
        );
});


// ==========================================
// DELETE COMMENT
// ==========================================

const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(
            404,
            "Comment not found"
        );
    }

    if (
        comment.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to delete this comment"
        );
    }

    await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Comment deleted successfully",
                {}
            )
        );
});


export {
    addComment,
    getVideoComments,
    updateComment,
    deleteComment
};