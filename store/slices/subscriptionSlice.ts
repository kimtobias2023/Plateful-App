import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, makeRequest, setAuthToken, setCsrfToken } from '@axiosInstance';
import { getQueuedItem } from "@utils/secureStoreUtils"; // Adjust the path as needed

interface SubscriptionState {
  isSubscribed: boolean;
  isCheckingSubscription: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  isSubscribed: false,
  isCheckingSubscription: false,
  error: null,
};

// Thunk to fetch subscription status
export const checkSubscriptionStatusThunk = createAsyncThunk<
  boolean, // Return type
  void, // Args type
  { rejectValue: string } // Reject value type
>("subscription/checkSubscriptionStatus", async (_, { rejectWithValue }) => {
  try {
    await setAuthToken
    const token = await getQueuedItem("access_token");

    const response = await makeRequest({
        method: 'POST',
        url: '/subscription/check-subscription',
      });

    if (!response.ok) {
      throw new Error("Failed to fetch subscription status.");
    }

    const data = await response.json();
    return data.isSubscribed; // Assumes backend returns { isSubscribed: boolean }
  } catch (error) {
    console.error("[checkSubscriptionStatusThunk] Error:", error);
    return rejectWithValue(error instanceof Error ? error.message : "Unknown error occurred");
  }
});

// Slice
const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkSubscriptionStatusThunk.pending, (state) => {
        state.isCheckingSubscription = true;
        state.error = null;
      })
      .addCase(checkSubscriptionStatusThunk.fulfilled, (state, action) => {
        state.isCheckingSubscription = false;
        state.isSubscribed = action.payload;
      })
      .addCase(checkSubscriptionStatusThunk.rejected, (state, action) => {
        state.isCheckingSubscription = false;
        state.isSubscribed = false; // Default to unsubscribed on error
        state.error = action.payload || "Failed to check subscription status.";
      });
  },
});

export const selectSubscriptionStatus = (state: { subscription: SubscriptionState }) => ({
  isSubscribed: state.subscription.isSubscribed,
  isCheckingSubscription: state.subscription.isCheckingSubscription,
});

export default subscriptionSlice.reducer;
