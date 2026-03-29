import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import videoReducer from "../features/video/videoSlice";
import commentReducer from "../features/comment/commentSlice";
import subscriptionReducer from "../features/subscription/subscriptionSlice";
import tweetReducer from "../features/tweet/tweetSlice";
import playlistReducer from "../features/playlist/playlistSlice";

;export const store = configureStore({
  reducer: {
    auth: authReducer,
    video:videoReducer,
    comments : commentReducer,
    subscription : subscriptionReducer,
    tweets : tweetReducer,
    playlist : playlistReducer
  },
});
