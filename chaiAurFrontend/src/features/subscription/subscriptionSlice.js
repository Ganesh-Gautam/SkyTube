import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  toggleSubscription as toggleSubscriptionAPI,
  getSubscribedChannels,
  getChannelSubscribers,
} from "./subscriptionService";


const initialState = {
  subscribedChannels: [],
  subscriberCount: 0,
  isSubscribed: false,
  loading: false,
  error: null,
};


export const toggleSubscription = createAsyncThunk(
  "subscription/toggle",
  async (channelId, thunkAPI) => {
    try {
      const res = await toggleSubscriptionAPI(channelId); 
      return {
        channelId,
        isSubscribed: res.data.data.isSubscribed, 
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Subscription failed"
      );
    }
  }
);


export const fetchSubscribedChannels = createAsyncThunk(
  "subscription/SubscribedChannels",
  async (_, thunkAPI) => {
    try {
      const res = await getSubscribedChannels(); 
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

export const fetchChannelSubscribers = createAsyncThunk(
  "subscription/getSubscribers",
  async (channelId, thunkAPI) => {
    try {
      const res = await getChannelSubscribers(channelId);
      return {
        subscriberCount: res.data.data.subscriberCount,
        isSubscribed : res.data.data.isSubscribed
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,

  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.isSubscribed = action.payload.isSubscribed;
        state.subscriberCount += state.isSubscribed ? 1 : -1;
      })
      .addCase(toggleSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSubscribedChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribedChannels = action.payload.channels;
      })

      .addCase(fetchChannelSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriberCount = action.payload.subscriberCount;
        state.isSubscribed = action.payload.isSubscribed;
      });
  },
});
export const {
  resetError,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;