import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import videoService from "./videoService.js";
import { ServiceToggleVideoLike } from "../like/likeService.js";
import { buildRecentSearches, loadRecentSearches, saveRecentSearches } from "../../utils/searchStorage.js";

const initialState = {
    videos:[],
    searchResults: [],
    searchPagination: null,
    suggestions: [],
    currentVideo : null,
    isLiked : false,
    likeCount: 0,
    pagination : null,
    isLoading : false,
    searchLoading: false,
    suggestionLoading: false,
    isError : false,
    message :"",
    deletingId: null,   
    togglingId: null, 
    updatingId: null,
    recentSearches: loadRecentSearches(),
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

export const searchVideos = createAsyncThunk(
    "video/search",
    async(params, thunkAPI)=>{
        try {
            return await videoService.getAllVideos(params);
        } catch (error){
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

export const fetchSearchSuggestions = createAsyncThunk(
    "video/fetchSearchSuggestions",
    async(query, thunkAPI) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return [];

        try {
            const data = await videoService.getAllVideos({
                query: trimmedQuery,
                limit: 6,
                sortBy: "createdAt",
                sortType: "desc",
            });

            const lowered = trimmedQuery.toLowerCase();
            const suggestions = [];

            data.videos.forEach((video) => {
                const candidates = [video.title, video.description]
                    .filter(Boolean)
                    .map((value) => value.trim());

                candidates.forEach((value) => {
                    if (
                        value &&
                        value.toLowerCase().includes(lowered) &&
                        !suggestions.some((item) => item.toLowerCase() === value.toLowerCase())
                    ) {
                        suggestions.push(value);
                    }
                });
            });

            return suggestions.slice(0, 6);
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
        addRecentSearch(state, action) {
            state.recentSearches = buildRecentSearches(state.recentSearches, action.payload);
        },
        clearRecentSearches(state) {
            state.recentSearches = [];
            saveRecentSearches([]);
        },
        clearSearchSuggestions(state) {
            state.suggestions = [];
            state.suggestionLoading = false;
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
        .addCase(searchVideos.pending, (state) => {
            state.searchLoading = true;
            state.isError = false;
            state.message = "";
        })
        .addCase(searchVideos.fulfilled, (state, action) => {
            state.searchLoading = false;
            state.searchResults = action.payload.videos;
            state.searchPagination = action.payload.pagination;
        })
        .addCase(searchVideos.rejected, (state, action) => {
            state.searchLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.searchResults = [];
        })
        .addCase(fetchSearchSuggestions.pending, (state) => {
            state.suggestionLoading = true;
        })
        .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
            state.suggestionLoading = false;
            state.suggestions = action.payload;
        })
        .addCase(fetchSearchSuggestions.rejected, (state) => {
            state.suggestionLoading = false;
            state.suggestions = [];
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

export const {
    clearVideoError,
    addRecentSearch,
    clearRecentSearches,
    clearSearchSuggestions,
} = videoSlice.actions;

export const selectAllVideos     = (state) => state.video.videos;
export const selectCurrentVideo  = (state) => state.video.currentVideo;
export const selectVideoLoading  = (state) => state.video.isLoading;
export const selectVideoError    = (state) => state.video.message;
export const selectPagination    = (state) => state.video.pagination;
export const selectDeletingId    = (state) => state.video.deletingId;
export const selectTogglingId    = (state) => state.video.togglingId;
export const selectUpdatingId    = (state) => state.video.updatingId;
export const selectSearchResults = (state) => state.video.searchResults;
export const selectSearchLoading = (state) => state.video.searchLoading;
export const selectSearchSuggestions = (state) => state.video.suggestions;
export const selectSuggestionLoading = (state) => state.video.suggestionLoading;
export const selectRecentSearches = (state) => state.video.recentSearches;

export default videoSlice.reducer;
