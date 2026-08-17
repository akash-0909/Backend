import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription,getSubscriberCount,getSubscriptionStatus } from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyJWT);

router
    .route("/c/:channelId")
    .post(toggleSubscription);

router
    .route("/c/:channelId/count")
    .get(getSubscriberCount);
router
    .route("/c/:channelId/status")
    .get(getSubscriptionStatus);
export default router;