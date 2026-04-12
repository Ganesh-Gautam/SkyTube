import {Router} from "express"
import {getChannelStats ,getChannelVideos} from "../controllers/dashboard.controller.js";
import { optionalVerifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/stats/:channelName").get(optionalVerifyJWT, getChannelStats);
router.route("/videos/:channelName").get(optionalVerifyJWT, getChannelVideos);

export default router;
