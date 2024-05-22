import { Router } from "express";
import { getAllVideos, getVideoById, publishAVideo, updateVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/upload-video").post(
    verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router.route("/all-videos").get(getAllVideos)
router.route("/v/get-video/:videoId").get(getVideoById)
router.route("/v/update-video/:videoId").patch(verifyJWT, updateVideo)


export default router;