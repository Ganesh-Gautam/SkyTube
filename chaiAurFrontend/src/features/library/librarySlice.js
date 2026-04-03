import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import libraryService from "./libraryService.js";

const initialState = {
  history: [],
  likedVideos: [],
  historyLoading: false,
  likedLoading: false,
  clearingHistory: false,
  removingLikedId: null,
  error: "",
};

export const fetchWatchHistory = createAsyncThunk(
  "library/fetchWatchHistory",
  async (_, thunkAPI) => {
    try {
      return await libraryService.getWatchHistory();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch watch history"
      );
    }
  }
);

export const clearWatchHistory = createAsyncThunk(
  "library/clearWatchHistory",
  async (_, thunkAPI) => {
    try {
      return await libraryService.clearWatchHistory();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to clear watch history"
      );
    }
  }
);

export const fetchLikedVideos = createAsyncThunk(
  "library/fetchLikedVideos",
  async (_, thunkAPI) => {
    try {
      return await libraryService.getLikedVideos();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch liked videos"
      );
    }
  }
);

export const removeLikedVideo = createAsyncThunk(
  "library/removeLikedVideo",
  async (videoId, thunkAPI) => {
    try {
      return await libraryService.removeLikedVideo(videoId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove liked video"
      );
    }
  }
);

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchHistory.pending, (state) => {
        state.historyLoading = true;
        state.error = "";
      })
      .addCase(fetchWatchHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload;
      })
      .addCase(fetchWatchHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.payload;
      })
      .addCase(clearWatchHistory.pending, (state) => {
        state.clearingHistory = true;
        state.error = "";
      })
      .addCase(clearWatchHistory.fulfilled, (state) => {
        state.clearingHistory = false;
        state.history = [];
      })
      .addCase(clearWatchHistory.rejected, (state, action) => {
        state.clearingHistory = false;
        state.error = action.payload;
      })
      .addCase(fetchLikedVideos.pending, (state) => {
        state.likedLoading = true;
        state.error = "";
      })
      .addCase(fetchLikedVideos.fulfilled, (state, action) => {
        state.likedLoading = false;
        state.likedVideos = action.payload;
      })
      .addCase(fetchLikedVideos.rejected, (state, action) => {
        state.likedLoading = false;
        state.error = action.payload;
      })
      .addCase(removeLikedVideo.pending, (state, action) => {
        state.removingLikedId = action.meta.arg;
        state.error = "";
      })
      .addCase(removeLikedVideo.fulfilled, (state, action) => {
        state.removingLikedId = null;
        state.likedVideos = state.likedVideos.filter(
          (video) => video._id !== action.payload
        );
      })
      .addCase(removeLikedVideo.rejected, (state, action) => {
        state.removingLikedId = null;
        state.error = action.payload;
      });
  },
});

export default librarySlice.reducer;
