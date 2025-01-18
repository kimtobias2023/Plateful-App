import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@axiosInstance';

// Initial state for the recipes slice
export const initialState = {
    recipes: [],
    isLoading: false,
    error: null,
};

// Async thunk for fetching recipes without filters
export const fetchRecipesAsync = createAsyncThunk(
    'recipe/fetchRecipes',
    async ({ searchQuery }, { rejectWithValue }) => {
        try {
            let query = `/recipes/search?`;

            // Add search query
            if (searchQuery) {
                query += `query=${encodeURIComponent(searchQuery.toLowerCase())}`;
            }

            const response = await axiosInstance.get(query);
            return response.data; // The recipes list
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk for fetching recipes
export const fetchRecipesWithFiltersAsync = createAsyncThunk(
    'recipe/fetchRecipesWithFilters',
    async ({ filters, searchQuery }, { rejectWithValue }) => {
        try {
            let query = `/recipes/search?`;

            // Construct and format label filters
            let labelFilters = [];
            if (filters.course.length) {
                labelFilters.push(...filters.course.map(course => `course:${course}`));
            }
            if (filters.cuisine.length) {
                labelFilters.push(...filters.cuisine.map(cuisine => `cuisine:${cuisine}`));
            }

            // Add label filters to the query string
            if (labelFilters.length) {
                query += `labels=${encodeURIComponent(labelFilters.join(','))}&`;
            }

            // Add other filters if present
            Object.keys(filters).forEach(key => {
                if (!['course', 'cuisine'].includes(key) && filters[key].length) {
                    const filterValue = Array.isArray(filters[key])
                        ? filters[key].map(value => value.toLowerCase()).join(',')
                        : filters[key].toLowerCase();
                    query += `${key}=${encodeURIComponent(filterValue)}&`;
                }
            });

            // Add search query
            if (searchQuery) {
                query += `query=${encodeURIComponent(searchQuery.toLowerCase())}`;
            }

            const response = await axiosInstance.get(query);
            return response.data; // The recipes list
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// Create the recipes slice
export const recipeSlice = createSlice({
    name: 'recipe',
    initialState,
    reducers: {
        // You can add reducers for other actions here
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipesAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRecipesAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.recipes = action.payload;
            })
            .addCase(fetchRecipesAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const selectRecipes = (state) => state.recipe.recipes;
// Export the reducer and any actions you need to use outside the slice
export default recipeSlice.reducer;
