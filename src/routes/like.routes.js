import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleVideoLike,toggleCommentLike,getVideoLikeCount,getCommentLikeCount,isVideoLiked,isCommentLiked} from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);

router
    .route("/toggle/video/:videoId")
    .post(toggleVideoLike);

router
    .route("/toggle/comment/:commentId")
    .post(toggleCommentLike);
router
    .route("/video/:videoId")
    .get(getVideoLikeCount);
router
    .route("/comment/:commentId")
    .get(getCommentLikeCount);
router
    .route("/video/:videoId/status")
    .get(isVideoLiked);
router
    .route("/comment/:commentId/status")
    .get(isCommentLiked);
export default router;