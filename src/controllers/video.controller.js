import asyncHandler from "express-async-handler";
import  ApiError  from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);

    if (!videoFile?.url) {
        throw new ApiError(400, "Error while uploading video");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail?.url) {
        throw new ApiError(400, "Error while uploading thumbnail");
    }

    const video = await Video.create({
        videoFile: videoFile.url,
    videoPublicId: videoFile.public_id,

    thumbnail: thumbnail.url,
    thumbnailPublicId: thumbnail.public_id,
        title,
        description,
        duration: videoFile.duration,
        views:0,
        isPublished:true,
        owner: req.user._id
    });

    if (!video) {
        throw new ApiError(500, "Something went wrong while publishing video");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                video,
                "Video published successfully"
            )
        );
});
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const videos = await Video.find({
        isPublished: true
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const totalVideos = await Video.countDocuments({
        isPublished: true
    });

    const totalPages = Math.ceil(totalVideos / limit);

    const data = {
        videos,
        totalVideos,
        currentPage: Number(page),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                data,
                "Videos fetched successfully"
            )
        );
});
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }
    const videoo = await Video.findByIdAndUpdate(
        videoId,
        {
            $inc: {
                views: 1
            }
        },
        { new: true }
    );
    const video = await Video.findById(videoId)
        .populate("owner", "username fullName avatar");

    if (!videoo) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video,
                "Video fetched successfully"
            )
        );
});
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this video");
    }

    if (title) video.title = title;
    if (description) video.description = description;

    if (req.file) {
        const thumbnailLocalPath = req.file.path;

        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnail?.url) {
            throw new ApiError(400, "Error while uploading thumbnail");
        }

        video.thumbnail = thumbnail.url;
    }

    await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video,
                "Video updated successfully"
            )
        );
});
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }
    await deleteFromCloudinary(video.videoPublicId, "video");

    await deleteFromCloudinary(video.thumbnailPublicId, "image");
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to delete this video"
        );
    }

    await Video.findByIdAndDelete(videoId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Video deleted successfully"
            )
        );
});
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to change this video"
        );
    }

    video.isPublished = !video.isPublished;

    await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video,
                video.isPublished
                    ? "Video published successfully"
                    : "Video unpublished successfully"
            )
        );
});
export { publishVideo,getAllVideos,getVideoById,updateVideo,deleteVideo,togglePublishStatus };