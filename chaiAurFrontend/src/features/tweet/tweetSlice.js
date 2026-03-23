import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getUserTweets,
  addTweet as addTweetAPI,
  updateTweet as updateTweetAPI,
  deleteTweet as deleteTweetAPI,
} from "./tweetService.js";
import {ServiceToggleTweetLike as toggleTweetLikeAPI } from "../like/likeService.js"

export const fetchUserTweets = createAsyncThunk(
  "tweets/fetchComments",
  async ( userId ,thunkAPI) => {
    try {
      const res = await getUserTweets(userId); 

      return res.data.data.docs || res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

export const createTweet = createAsyncThunk(
  "tweets/create",
  async (content, { rejectWithValue }) => {
    try {
      const { data } = await addTweetAPI(content)
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create post");
    }
  }
);

export const updateTweet = createAsyncThunk(
  "tweets/update",
  async ({ tweetId, content }, { rejectWithValue }) => { 
    try {
      const { data } = await updateTweetAPI(tweetId,content)
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update post");
    }
  }
);

export const deleteTweet = createAsyncThunk(
  "tweets/delete",
  async (tweetId, { rejectWithValue }) => {
    try {
      await deleteTweetAPI(tweetId);
      return tweetId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete post");
    }
  }
);

export const toggleTweetLike = createAsyncThunk(
  "tweets/toggleLike",
  async (tweetId, thunkAPI) => {
    try { 
      const res = await toggleTweetLikeAPI(tweetId);  
      return res
      
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to toggle like"
      );
    }
  }
);


const tweetSlice = createSlice({
  name: "tweets",
  initialState: {
    tweets: [],
    status: "idle",        // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    submitting: false,     // for create/edit operations
    deletingId: null,      // tweetId currently being deleted
    likingId: null,        // tweetId currently being liked
  },
  reducers: {
    clearTweetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchUserTweets.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserTweets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tweets = action.payload;
      })
      .addCase(fetchUserTweets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder
      .addCase(createTweet.pending, (state) => {
        state.submitting = true;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.submitting = false;
        state.tweets.unshift(action.payload); 
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateTweet.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateTweet.fulfilled, (state, action) => {
        state.submitting = false;
        const idx = state.tweets.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.tweets[idx] = action.payload;
      })
      .addCase(updateTweet.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteTweet.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.deletingId = null;
        state.tweets = state.tweets.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTweet.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload;
      });

      
    builder
      .addCase(toggleTweetLike.pending, (state, action) => {
        state.likingId = action.meta.arg;
      })
      .addCase(toggleTweetLike.fulfilled, (state, action) => {
        state.likingId = null;
        const tweet = state.tweets.find((t) => t._id === action.payload.tweetId);
        if (tweet) {
          tweet.isLiked = action.payload.isLiked;
          tweet.likesCount = action.payload.likesCount;
        }
      })
      .addCase(toggleTweetLike.rejected, (state, action) => {
        state.likingId = null;
        state.error = action.payload;
      });
  },
});

export const { clearTweetError } = tweetSlice.actions;

export const selectAllTweets    = (state) => state.tweets.tweets;
export const selectTweetStatus  = (state) => state.tweets.status;
export const selectTweetError   = (state) => state.tweets.error;
export const selectSubmitting   = (state) => state.tweets.submitting;
export const selectDeletingId   = (state) => state.tweets.deletingId;
export const selectLikingId     = (state) => state.tweets.likingId;

export default tweetSlice.reducer;