import asyncHandler from "express-async-handler";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


// ==========================================
// TOGGLE SUBSCRIPTION
// ==========================================

const toggleSubscription = asyncHandler(async (req, res) => {

    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(
            400,
            "Channel ID is required"
        );
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(
            404,
            "Channel not found"
        );
    }

    if (
        channel._id.toString() ===
        req.user._id.toString()
    ) {
        throw new ApiError(
            400,
            "You cannot subscribe to yourself"
        );
    }

    const existingSubscription =
        await Subscription.findOne({
            subscriber: req.user._id,
            channel: channelId
        });

    // UNSUBSCRIBE
    if (existingSubscription) {

        await Subscription.findByIdAndDelete(
            existingSubscription._id
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Unsubscribed successfully",
                    {}
                )
            );
    }

    // SUBSCRIBE
    const subscription =
        await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "Subscribed successfully",
                subscription
            )
        );
});


// ==========================================
// GET SUBSCRIBER COUNT
// ==========================================

const getSubscriberCount = asyncHandler(
    async (req, res) => {

        const { channelId } = req.params;

        const channel =
            await User.findById(channelId);

        if (!channel) {
            throw new ApiError(
                404,
                "Channel not found"
            );
        }

        const subscriberCount =
            await Subscription.countDocuments({
                channel: channelId
            });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Subscriber count fetched successfully",
                    {
                        subscriberCount
                    }
                )
            );
    }
);


// ==========================================
// GET SUBSCRIPTION STATUS
// ==========================================

const getSubscriptionStatus = asyncHandler(
    async (req, res) => {

        const { channelId } = req.params;

        const subscription =
            await Subscription.findOne({
                subscriber: req.user._id,
                channel: channelId
            });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Subscription status fetched successfully",
                    {
                        isSubscribed: !!subscription
                    }
                )
            );
    }
);


export {
    toggleSubscription,
    getSubscriberCount,
    getSubscriptionStatus
};