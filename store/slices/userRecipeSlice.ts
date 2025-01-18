import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '@axiosInstance';


// Define Recipe and UserRecipeState interfaces
interface Recipe {
  id: number;
  name: string;
  description: string;
  [key: string]: any; // Additional properties can be added as needed
}

interface UserRecipeState {
  savedRecipes: Record<number, Recipe>; // Map of recipe IDs to Recipe objects
  favoriteRecipes: number[]; // Array of favorite recipe IDs
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserRecipeState = {
  savedRecipes: {},
  favoriteRecipes: [],
  isLoading: false,
  error: null,
};

// Async thunk for fetching saved recipes
export const fetchSavedRecipes = createAsyncThunk<
  Recipe[], // Return type
  number,   // Argument type (userId)
  { rejectValue: string }
>('userRecipes/fetchSavedRecipes', async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/recipes`);
    return response.data as Recipe[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch saved recipes');
  }
});

// Async thunk for saving a recipe
export const saveRecipe = createAsyncThunk<
  Recipe,                       // Return type
  { userId: number; recipe: Recipe }, // Argument type
  { rejectValue: string }
>('userRecipes/saveRecipe', async ({ userId, recipe }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/users/${userId}/recipes`, recipe);
    return response.data as Recipe;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to save recipe');
  }
});

// Async thunk for removing a saved recipe
export const removeSavedRecipe = createAsyncThunk<
  number,                       // Return type (recipeId)
  { userId: number; recipeId: number }, // Argument type
  { rejectValue: string }
>('userRecipes/removeSavedRecipe', async ({ userId, recipeId }, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/users/${userId}/recipes/${recipeId}`);
    return recipeId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to remove recipe');
  }
});

// Async thunk for fetching favorite recipes
export const fetchFavoriteRecipes = createAsyncThunk<
  number[],  // Return type (array of recipe IDs)
  number,    // Argument type (userId)
  { rejectValue: string }
>('userRecipes/fetchFavoriteRecipes', async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/favorites`);
    return response.data as number[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch favorite recipes');
  }
});

// Async thunk for adding a favorite recipe
export const addFavoriteRecipe = createAsyncThunk<
  number,                       // Return type (recipeId)
  { userId: number; recipeId: number }, // Argument type
  { rejectValue: string }
>('userRecipes/addFavoriteRecipe', async ({ userId, recipeId }, { rejectWithValue }) => {
  try {
    await axiosInstance.post(`/users/${userId}/favorites`, { recipeId });
    return recipeId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to add favorite recipe');
  }
});

// Async thunk for removing a favorite recipe
export const removeFavoriteRecipe = createAsyncThunk<
  number,                       // Return type (recipeId)
  { userId: number; recipeId: number }, // Argument type
  { rejectValue: string }
>('userRecipes/removeFavoriteRecipe', async ({ userId, recipeId }, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/users/${userId}/favorites/${recipeId}`);
    return recipeId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to remove favorite recipe');
  }
});

// Create slice
const userRecipeSlice = createSlice({
  name: 'userRecipes',
  initialState,
  reducers: {
    clearUserRecipes: (state) => {
      state.savedRecipes = {};
      state.favoriteRecipes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch saved recipes
      .addCase(fetchSavedRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSavedRecipes.fulfilled, (state, action: PayloadAction<Recipe[]>) => {
        state.isLoading = false;
        state.savedRecipes = action.payload.reduce((acc, recipe) => {
          acc[recipe.id] = recipe;
          return acc;
        }, {} as Record<number, Recipe>);
      })
      .addCase(fetchSavedRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch saved recipes';
      })

      // Save a recipe
      .addCase(saveRecipe.fulfilled, (state, action: PayloadAction<Recipe>) => {
        state.savedRecipes[action.payload.id] = action.payload;
      })

      // Remove a saved recipe
      .addCase(removeSavedRecipe.fulfilled, (state, action: PayloadAction<number>) => {
        delete state.savedRecipes[action.payload];
      })

      // Fetch favorite recipes
      .addCase(fetchFavoriteRecipes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFavoriteRecipes.fulfilled, (state, action: PayloadAction<number[]>) => {
        state.isLoading = false;
        state.favoriteRecipes = action.payload;
      })
      .addCase(fetchFavoriteRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch favorite recipes';
      })

      // Add a favorite recipe
      .addCase(addFavoriteRecipe.fulfilled, (state, action: PayloadAction<number>) => {
        state.favoriteRecipes.push(action.payload);
      })

      // Remove a favorite recipe
      .addCase(removeFavoriteRecipe.fulfilled, (state, action: PayloadAction<number>) => {
        state.favoriteRecipes = state.favoriteRecipes.filter((id) => id !== action.payload);
      });
  },
});

export const { clearUserRecipes } = userRecipeSlice.actions;
export default userRecipeSlice.reducer;
