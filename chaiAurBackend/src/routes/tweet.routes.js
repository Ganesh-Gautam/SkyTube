import {Router} from 'express';
import {createTweet, getUserTweets, updateTweet, deleteTweet} from "../controllers/tweet.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(verifyJWT);

router.route("/create-tweet").post(createTweet);
router.route("/t/:tweetId").patch(updateTweet);
router.route("/d/:tweetId").delete(deleteTweet);
router.route("/all-tweets/:userId").get(getUserTweets);

export default router

