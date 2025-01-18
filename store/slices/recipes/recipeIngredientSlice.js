import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@axiosInstance';

// Initial state for the recipe ingredients slice
export const initialState = {
    currentRecipe: null, // Assuming this is related to the recipe currently being edited
    stagedIngredients: [],
    units: [],
    isLoading: false,
    error: null,
};

// Async thunk to fetch units
export const fetchUnitsAsync = createAsyncThunk(
    'recipeIngredient/fetchUnits',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/units');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const recipeIngredientSlice = createSlice({
    name: 'recipeIngredient',
    initialState,
    reducers: {
        setCurrentRecipe: (state, action) => {
            state.currentRecipe = action.payload;
        },
        addIngredientSection: (state) => {
            state.currentRecipe = {
                ...state.currentRecipe,
                RecipeSections: [
                    ...(state.currentRecipe.RecipeSections || []),
                    { id: Date.now(), sectionName: "", RecipeIngredients: [] }, // Using a timestamp as a temporary unique ID
                ],
            };
        },
        removeIngredientSection: (state, action) => {
            const { sectionId } = action.payload;
            state.currentRecipe.RecipeSections = state.currentRecipe.RecipeSections.filter(section => section.id !== sectionId);
        },
        addIngredient: (state, action) => {
            const { sectionId, newIngredient } = action.payload;
            const updatedSections = state.currentRecipe.RecipeSections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        RecipeIngredients: [...section.RecipeIngredients, newIngredient]
                    };
                }
                return section;
            });
            state.currentRecipe.RecipeSections = updatedSections;
        },
        removeIngredient: (state, action) => {
            const { sectionId, ingredientId } = action.payload;
            state.currentRecipe.RecipeSections = state.currentRecipe.RecipeSections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        RecipeIngredients: section.RecipeIngredients.filter(ingredient => ingredient.id !== ingredientId)
                    };
                }
                return section;
            });
        },
        handleIngredientChange: (state, action) => {
            const { sectionId, ingredientId, field, newValue } = action.payload;
            state.currentRecipe.RecipeSections = state.currentRecipe.RecipeSections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        RecipeIngredients: section.RecipeIngredients.map(ingredient => {
                            if (ingredient.id === ingredientId) {
                                return { ...ingredient, [field]: newValue };
                            }
                            return ingredient;
                        })
                    };
                }
                return section;
            });
        },
        setStagedIngredients: (state, action) => {
            state.stagedIngredients = action.payload;
        },
        // Undo to previous staged ingredients
        undoIngredientChange: (state) => {
            if (state.past.length > 0) {
                const previous = state.past[state.past.length - 1];
                state.future.unshift(state.stagedIngredients);
                state.stagedIngredients = previous;
                state.past.pop();
            }
        },

        // Redo to next staged ingredients
        redoIngredientChange: (state) => {
            if (state.future.length > 0) {
                const next = state.future[0];
                state.past.push(state.stagedIngredients);
                state.stagedIngredients = next;
                state.future.shift();
            }
        },

        // Replace all staged ingredients
        setIngredients: (state, action) => {
            state.past.push(state.stagedIngredients);
            state.stagedIngredients = action.payload;
            state.future = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnitsAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUnitsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.units = action.payload;
            })
            .addCase(fetchUnitsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    setCurrentRecipe,
    addIngredientSection,
    addIngredient,
    removeIngredient,
    removeIngredientSection,
    handleIngredientChange,
    setStagedIngredients,
    undoIngredientChange,
    redoIngredientChange,
    setIngredients
} = recipeIngredientSlice.actions;

export default recipeIngredientSlice.reducer;
