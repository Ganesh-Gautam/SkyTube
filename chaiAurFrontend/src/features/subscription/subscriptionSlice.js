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
  optimisticSnapshot: null,
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
      .addCase(toggleSubscription.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.optimisticSnapshot = {
          isSubscribed: state.isSubscribed,
          subscriberCount: state.subscriberCount,
        };

        state.isSubscribed = !state.isSubscribed;
        state.subscriberCount = Math.max(
          0,
          state.subscriberCount + (state.isSubscribed ? 1 : -1)
        );

        if (!state.isSubscribed) {
          state.subscribedChannels = state.subscribedChannels.filter(
            (channel) => channel.channelId !== action.meta.arg
          );
        }
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.isSubscribed = action.payload.isSubscribed;
        state.optimisticSnapshot = null;
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (state.optimisticSnapshot) {
          state.isSubscribed = state.optimisticSnapshot.isSubscribed;
          state.subscriberCount = state.optimisticSnapshot.subscriberCount;
        }
        state.optimisticSnapshot = null;
      })

      .addCase(fetchSubscribedChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscribedChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribedChannels = action.payload.channels;
      })
      .addCase(fetchSubscribedChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchChannelSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannelSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriberCount = action.payload.subscriberCount;
        state.isSubscribed = action.payload.isSubscribed;
      })
      .addCase(fetchChannelSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const {
  resetError,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
