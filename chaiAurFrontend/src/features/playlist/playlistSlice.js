import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import playlistService from "./playlistService.js";

export const fetchUserPlaylists = createAsyncThunk(
    "playlist/fetchAll",
    async (userId, thunkAPI) => { 
        try {
            return await playlistService.getUserPlaylists(userId);
        } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.message || "Failed to fetch Playlist"
        );
        }
    }
);

export const fetchPlaylistById = createAsyncThunk(
    "playlist/fetchById",
    async (playlistId, { rejectWithValue }) => {
        try {
            return await playlistService.getPlaylistById(playlistId);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

export const createPlaylist = createAsyncThunk(
    "playlist/create",
    async (payload, { rejectWithValue }) => {
        try {
            return await playlistService.createPlaylist(payload);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

export const updatePlaylist = createAsyncThunk(
    "playlist/update",
    async (payload, { rejectWithValue }) => {
        try {
            return await playlistService.updatePlaylist(payload);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

export const deletePlaylist = createAsyncThunk(
    "playlist/delete",
    async (playlistId, { rejectWithValue }) => {
        try {
            return await playlistService.deletePlaylist(playlistId);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

export const addVideoToPlaylist = createAsyncThunk(
    "playlist/addVideo",
    async (payload, { rejectWithValue }) => {
        try {
            return await playlistService.addVideoToPlaylist(payload);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

export const removeVideoFromPlaylist = createAsyncThunk(
    "playlist/removeVideo",
    async (payload, { rejectWithValue }) => {
        try {
            return await playlistService.removeVideoFromPlaylist(payload);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

const playlistSlice = createSlice({
    name: "playlist",
    initialState: {
        playlists:       [],    
        currentPlaylist: null,  
        status:          "idle",
        detailStatus:    "idle",
        submitting:      false,
        deletingId:      null,
        togglingVideo:   null, // { videoId, playlistId } currently being toggled
        error:           null,
    },
    reducers: {
        clearPlaylistError(state) {
            state.error = null;
        },
        resetCurrentPlaylist(state) {
            state.currentPlaylist = null;
            state.detailStatus = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            // ── fetchUserPlaylists ───────────────────────────────
            .addCase(fetchUserPlaylists.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.playlists = action.payload;
            })
            .addCase(fetchUserPlaylists.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // ── fetchPlaylistById ────────────────────────────────
            .addCase(fetchPlaylistById.pending, (state) => {
                state.detailStatus = "loading";
            })
            .addCase(fetchPlaylistById.fulfilled, (state, action) => {
                state.detailStatus = "succeeded";
                state.currentPlaylist = action.payload;
            })
            .addCase(fetchPlaylistById.rejected, (state, action) => {
                state.detailStatus = "failed";
                state.error = action.payload;
            })

            // ── createPlaylist ───────────────────────────────────
            .addCase(createPlaylist.pending, (state) => {
                state.submitting = true;
            })
            .addCase(createPlaylist.fulfilled, (state, action) => {
                state.submitting = false;
                state.playlists.unshift(action.payload);
            })
            .addCase(createPlaylist.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })

            // ── updatePlaylist ───────────────────────────────────
            .addCase(updatePlaylist.pending, (state) => {
                state.submitting = true;
            })
            .addCase(updatePlaylist.fulfilled, (state, action) => {
                state.submitting = false;
                const idx = state.playlists.findIndex(
                    (p) => p._id === action.payload._id
                );
                if (idx !== -1) state.playlists[idx] = action.payload;
                if (state.currentPlaylist?._id === action.payload._id) {
                    state.currentPlaylist = action.payload;
                }
            })
            .addCase(updatePlaylist.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })

            // ── deletePlaylist ───────────────────────────────────
            .addCase(deletePlaylist.pending, (state, action) => {
                state.deletingId = action.meta.arg;
            })
            .addCase(deletePlaylist.fulfilled, (state, action) => {
                state.deletingId = null;
                state.playlists = state.playlists.filter(
                    (p) => p._id !== action.payload
                );
            })
            .addCase(deletePlaylist.rejected, (state, action) => {
                state.deletingId = null;
                state.error = action.payload;
            })

            // ── addVideoToPlaylist ───────────────────────────────
            .addCase(addVideoToPlaylist.pending, (state, action) => {
                state.togglingVideo = action.meta.arg;
            })
            .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
                state.togglingVideo = null;
                // update playlist in list if present
                const idx = state.playlists.findIndex(
                    (p) => p._id === action.payload._id
                );
                if (idx !== -1) state.playlists[idx] = action.payload;
                if (state.currentPlaylist?._id === action.payload._id) {
                    state.currentPlaylist = action.payload;
                }
            })
            .addCase(addVideoToPlaylist.rejected, (state, action) => {
                state.togglingVideo = null;
                state.error = action.payload;
            })

            // ── removeVideoFromPlaylist ──────────────────────────
            .addCase(removeVideoFromPlaylist.pending, (state, action) => {
                state.togglingVideo = action.meta.arg;
            })
            .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
                state.togglingVideo = null;
                const idx = state.playlists.findIndex(
                    (p) => p._id === action.payload._id
                );
                if (idx !== -1) state.playlists[idx] = action.payload;
                if (state.currentPlaylist?._id === action.payload._id) {
                    state.currentPlaylist = action.payload;
                }
            })
            .addCase(removeVideoFromPlaylist.rejected, (state, action) => {
                state.togglingVideo = null;
                state.error = action.payload;
            });
    },
});

export const { clearPlaylistError, resetCurrentPlaylist } = playlistSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectPlaylists       = (state) => state.playlist.playlists;
export const selectCurrentPlaylist = (state) => state.playlist.currentPlaylist;
export const selectPlaylistStatus  = (state) => state.playlist.status;
export const selectDetailStatus    = (state) => state.playlist.detailStatus;
export const selectSubmitting      = (state) => state.playlist.submitting;
export const selectDeletingId      = (state) => state.playlist.deletingId;
export const selectTogglingVideo   = (state) => state.playlist.togglingVideo;
export const selectPlaylistError   = (state) => state.playlist.error;

export default playlistSlice.reducer;
