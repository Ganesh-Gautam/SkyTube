import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";

import {
  getVideoComments,
  addComment as addCommentAPI,
  updateComment as updateCommentAPI,
  deleteComment as deleteCommentAPI,
} from "./commentService.js";
import {ServiceToggleCommentLike as toggleCommentLikeAPI } from "../like/likeService.js"

const initialState = {
  items: [],
  loading: false,
  error: null,
  tempComments: {},
};

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (videoId, thunkAPI) => {
    try {
      const res = await getVideoComments(videoId); 

      return res.data.data.docs || res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ videoId, content, parent }, thunkAPI) => {
    try {
      const res = await addCommentAPI(videoId, { content, parent });

      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (commentId, thunkAPI) => {
    try {
      await updateCommentAPI(commentId);

      return commentId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to Edit comment"
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, thunkAPI) => {
    try {
      await deleteCommentAPI(commentId);

      return commentId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);



export const toggleCommentLike = createAsyncThunk(
  "comments/toggleLike",
  async (commentId, thunkAPI) => {
    try { 
      const res = await toggleCommentLikeAPI(commentId);  
      return res
      
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to toggle like"
      );
    }
  }
);


const commentSlice = createSlice({
  name: "comments",
  initialState,

  reducers: {
    addCommentOptimistic: {
      reducer: (state, action) => {
        state.items.unshift(action.payload);
        state.tempComments[action.payload._id] = true;
      },

      prepare({ content, user }) {
        const tempId = `temp_${nanoid()}`;

        return {
          payload: {
            _id: tempId,
            content,
            owner: {
              _id: user?._id,
              userName: user?.userName,
              avatar: user?.avatar,
            },
            likeCount: 0,
            isLiked: false,
            createdAt: new Date().toISOString(),
            isTemp: true,
          },
        };
      },
    },

    replaceTempComment :(state, action) =>{
      const {tempId ,newComment} = action.payload;
      const index = state.items.findIndex((c)=> c._id ===tempId);
      if (index !== -1) {
        state.items[index] = newComment;
        delete state.tempComments[tempId];
      }
    } ,

    removeTempComment: (state, action) => {
      state.items = state.items.filter((c) => c._id !== action.payload);
      delete state.tempComments[action.payload];
    },

    toggleLikeOptimistic: (state, action) => {
      const comment = state.items.find((c) => c._id === action.payload);
      if (!comment) return;
      
      comment.isLiked = !comment.isLiked;
      comment.likeCount += comment.isLiked ? 1 : -1;
    },

    clearComments: (state) => {
      state.items = [];
      state.tempComments = {};
      state.error = null;
    },

    resetError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.tempComments = {};
      })

      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch comments";
      });

    builder
      .addCase(addComment.fulfilled, (state, action) => {
        const tempIndex = state.items.findIndex((c) => c.isTemp);

        if (tempIndex !== -1) {
          state.items[tempIndex] = action.payload;
        } else {
          state.items.unshift(action.payload);
        }
      })

      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload || "Failed to add comment";

        state.items = state.items.filter((c) => !c.isTemp);
        state.tempComments = {};
      });
    builder
      .addCase(updateComment.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);

      })
      .addCase(updateComment.rejected, (state, action) => {
        state.error = action.payload || "Failed to Edit comment";
      });

    builder
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);

        delete state.tempComments[action.payload];
      })

      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete comment";
      });

    builder
      .addCase(toggleCommentLike.pending, (state, action) => {
          const comment = state.items.find((c) => c._id === action.meta.arg);
          if (!comment) return;
          comment.isLiked   = !comment.isLiked;                    
          comment.likeCount += comment.isLiked ? 1 : -1;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => { 
          const comment = state.items.find((c) => c._id === action.payload.commentId);
          if (!comment) return;
          comment.likeCount = action.payload.likeCount;
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
          const comment = state.items.find((c) => c._id === action.meta.arg);
          if (!comment) return;
          comment.isLiked   = !comment.isLiked;                     
          comment.likeCount += comment.isLiked ? 1 : -1;
      })
        },
      });

export const {
  addCommentOptimistic,
  replaceTempComment,
  removeTempComment,
  toggleLikeOptimistic,
  clearComments,
  resetError,
} = commentSlice.actions;

export default commentSlice.reducer;