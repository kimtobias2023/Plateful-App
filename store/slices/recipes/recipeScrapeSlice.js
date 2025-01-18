import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@axiosInstance';

// Define the initial state for recipe scraping
export const initialState = {
    currentRecipe: {
        id: null,
        name: "",
        description: "",
        RecipeIngredientSections: [],
        RecipeInstructionSections: [],
        notes: [],
        ratings: {
            taste: 0,
            time: 0,
            difficulty: 0,
            health: 0,
        },
        labels: [],
    },
    originalRecipe: null,
    isLoading: false,
    error: null,
};

// Define the thunk action to scrape a recipe
export const scrapeRecipeAsync = createAsyncThunk(
    'recipes/scrape',
    async ({ url }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/recipes/scrape', { url });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue({ message: 'Could not scrape recipe' });
            }
        }
    }
);

// Create a slice for recipe scraping
export const recipeScrapeSlice = createSlice({
    name: 'recipeScrape',
    initialState,
    reducers: {
        // Define any synchronous reducers here if needed
        recipeScraped: (state, action) => {
            state.currentRecipe = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(scrapeRecipeAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(scrapeRecipeAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.currentRecipe = action.payload;
            })
            .addCase(scrapeRecipeAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ? action.payload.message : 'Could not scrape recipe';
            });
    },
});

// Export the recipeScraped action for other components to use
export const { recipeScraped } = recipeScrapeSlice.actions;

// Export the reducer function
export default recipeScrapeSlice.reducer;

