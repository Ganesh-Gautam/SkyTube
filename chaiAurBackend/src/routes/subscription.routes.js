import {Router} from 'express'
import {
 getSubscribedChannels,
 getUserChannelSubscribers,
 toggleSubscription
} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router =Router();
router.use(verifyJWT);
router.route("/t/:channelId").post(toggleSubscription);
router.route("/s/:channelId").get(getUserChannelSubscribers);
router.route("/SubscribedChannels").get(getSubscribedChannels);

export default router
