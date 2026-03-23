import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import videoService from "./videoService.js";
import { ServiceToggleVideoLike } from "../like/likeService.js";

const initialState = {
    videos:[],
    currentVideo : null,
    isLiked : false,
    likeCount: 0,
    pagination : null,
    isLoading : false,
    isError : false,
    message :"",
    deletingId: null,   
    togglingId: null, 
    updatingId: null,
}

export const fetchVideos = createAsyncThunk(
    "video/fetchAll", async(params, thunkAPI)=>{
        try {
            return await videoService.getAllVideos(params);
        } catch (error){
            return thunkAPI.rejectWithValue(error.respose?.data?.message);
        }
    }
)

export const fetchVideoById = createAsyncThunk(
    "video/fetchById",
    async (videoId, thunkAPI) => {
        try {
        return await videoService.getVideoById(videoId);
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);
export const toggleVideoLike = createAsyncThunk( 
    "video/toggleLike", 
    async (videoId, thunkAPI) => { 
        try { 
            return await ServiceToggleVideoLike(videoId); 
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message); 
        } 
    } 
);

export const uploadVideo = createAsyncThunk(
    "video/upload",
    async (formData, thunkAPI) => {
        try {
            return await videoService.publishVideo(formData);
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deleteVideo = createAsyncThunk(
    "video/delete",
    async (videoId, thunkAPI) => {
        try {
            return await videoService.deleteVideo(videoId); // returns videoId
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

export const updateVideo = createAsyncThunk(
    "video/update",
    async ({ videoId, formData }, thunkAPI) => { 
        try {
            return await videoService.updateVideo({ videoId, formData });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

export const togglePublishStatus = createAsyncThunk(
    "video/togglePublish",
    async (videoId, thunkAPI) => {
        try {
            const data = await videoService.togglePublishStatus(videoId);
            return { videoId, isPublished: data.isPublished };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        clearVideoError(state) {
            state.isError = false;
            state.message = "";
        },
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchVideos.pending,(state)=>{
            state.isLoading =true;
        })
        .addCase(fetchVideos.fulfilled, (state ,action)=>{
            state.isLoading = false;
            state.videos = action.payload.videos;
            state.pagination = action.payload.pagination;
        })
        .addCase(fetchVideos.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(fetchVideoById.fulfilled, (state, action) => {
            state.currentVideo = action.payload;
        })
        .addCase(toggleVideoLike.fulfilled, (state, action) => {
            state.isLoading = false;
            if (state.currentVideo) {
                state.currentVideo.isLiked = action.payload.liked;
                state.currentVideo.likeCount  += action.payload.liked ? 1 : -1;
            }
        })
        .addCase(uploadVideo.fulfilled, (state, action) => {
            state.videos.unshift(action.payload);
        })

        .addCase(deleteVideo.pending, (state, action) => {
            state.deletingId = action.meta.arg;
        })
        .addCase(deleteVideo.fulfilled, (state, action) => {
            state.deletingId = null;
            state.videos     = state.videos.filter((v) => v._id !== action.payload);
            if (state.currentVideo?._id === action.payload) {
                state.currentVideo = null;
            }
        })
        .addCase(deleteVideo.rejected, (state, action) => {
            state.deletingId = null;
            state.isError    = true;
            state.message    = action.payload;
        })

        .addCase(updateVideo.pending, (state, action) => {
            state.updatingId = action.meta.arg.videoId;
        })
        .addCase(updateVideo.fulfilled, (state, action) => {
            state.updatingId = null;
            const idx = state.videos.findIndex((v) => v._id === action.payload._id);
            if (idx !== -1) state.videos[idx] = action.payload;
            if (state.currentVideo?._id === action.payload._id) {
                state.currentVideo = action.payload;
            }
        })
        .addCase(updateVideo.rejected, (state, action) => {
            state.updatingId = null;
            state.isError    = true;
            state.message    = action.payload;
        })

        .addCase(togglePublishStatus.pending, (state, action) => {
            state.togglingId = action.meta.arg;
        })
        .addCase(togglePublishStatus.fulfilled, (state, action) => {
            state.togglingId = null;
            const { videoId, isPublished } = action.payload;
            const video = state.videos.find((v) => v._id === videoId);
            if (video) video.isPublished = isPublished;
            if (state.currentVideo?._id === videoId) {
                state.currentVideo.isPublished = isPublished;
            }
        })
        .addCase(togglePublishStatus.rejected, (state, action) => {
            state.togglingId = null;
            state.isError    = true;
            state.message    = action.payload;
        });
    }
});

export const { clearVideoError } = videoSlice.actions;

export const selectAllVideos     = (state) => state.video.videos;
export const selectCurrentVideo  = (state) => state.video.currentVideo;
export const selectVideoLoading  = (state) => state.video.isLoading;
export const selectVideoError    = (state) => state.video.message;
export const selectPagination    = (state) => state.video.pagination;
export const selectDeletingId    = (state) => state.video.deletingId;
export const selectTogglingId    = (state) => state.video.togglingId;
export const selectUpdatingId    = (state) => state.video.updatingId;

export default videoSlice.reducer;