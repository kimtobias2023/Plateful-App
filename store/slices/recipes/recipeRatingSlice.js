import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@axiosInstance';

export const initialState = {
    ratings: { taste: 0, time: 0, difficulty: 0, health: 0 },
    initialRatingsSet: false,
    isLoading: false,
    error: null
};


export const submitRatingAsync = createAsyncThunk(
    'recipeRating/submitRating',
    async ({ recipeId, ratings }, { getState, rejectWithValue }) => {
        try {
            const userId = getState().user.id; // assuming user ID is stored in user slice
            const response = await axiosInstance.post(`/recipes/${recipeId}/rate`, {
                userId,
                ...ratings
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const recipeRatingSlice = createSlice({
    name: 'recipeRating',
    initialState,
    reducers: {
        handleRatingChange: (state, action) => {
            const { category, newRating } = action.payload;
            if (['taste', 'time', 'difficulty', 'health'].includes(category)) {
                state.ratings[category] = newRating;
            } else {
                console.error(`Invalid rating category: ${category}`);
            }
        },
        setInitialRatings: (state, action) => {
            console.log('Setting initial ratings with payload:', action.payload);
            if (!state.initialRatingsSet) {
                const { taste, time, difficulty, health } = action.payload;
                state.ratings.taste = taste ?? 0; // Using nullish coalescing to default to 0 if undefined
                state.ratings.time = time ?? 0;
                state.ratings.difficulty = difficulty ?? 0;
                state.ratings.health = health ?? 0;
                state.initialRatingsSet = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitRatingAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(submitRatingAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                // Update state based on action.payload if needed
            })
            .addCase(submitRatingAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const {
    handleRatingChange,
    setInitialRatings,
} = recipeRatingSlice.actions;

export default recipeRatingSlice.reducer;
