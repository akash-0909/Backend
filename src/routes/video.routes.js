import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import  upload  from "../middlewares/multer.middleware.js";
import { publishVideo } from "../controllers/video.controller.js";
import {getAllVideos,getVideoById,updateVideo,deleteVideo,togglePublishStatus}  from "../controllers/video.controller.js"
const router = Router();

//router.use(verifyJWT);
router
    .route("/")
    .get(getAllVideos)
    .post(verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1
            },
            {
                name: "thumbnail",
                maxCount: 1
            }
        ]),
        publishVideo
    );
router
    .route("/:videoId")
    .get(getVideoById);
router
    .route("/:videoId")
    .patch(
        verifyJWT,
        upload.single("thumbnail"),
        updateVideo
    );
router
    .route("/:videoId")
    .delete(deleteVideo);
router
    .route("/toggle-publish/:videoId")
    .patch(verifyJWT,togglePublishStatus);
export default router;