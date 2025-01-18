import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@axiosInstance';

// Define the shape of the profile state
export interface ProfileState {
  bio: string;
  isLoading: boolean;
  error: string | null;
}

// Initial state for the profile slice
export const initialState: ProfileState = { // Fixed the typo here
  bio: '',
  isLoading: false,
  error: null,
};

// Async thunk for updating the user's bio
export const updateBio = createAsyncThunk(
  'profile/updateBio',
  async ({ userId, bio }: { userId: number; bio: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/users/basic-profile/update-user-details/${userId}`,
        { bio }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Profile slice
const userProfileSlice = createSlice({
  name: 'profile',
  initialState, // Use corrected `profileInitialState`
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateBio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bio = action.payload.bio;
      })
      .addCase(updateBio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default userProfileSlice.reducer;


