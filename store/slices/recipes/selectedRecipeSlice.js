import { createSlice } from '@reduxjs/toolkit';

// Initial state of the slice
export const initialState = {
    selectedRecipes: {},
};

export const selectedRecipeSlice = createSlice({
    name: 'selectedRecipes',
    initialState: initialState,
    reducers: {
        selectRecipe: (state, action) => {
            const { recipeId, recipeData } = action.payload;
            // Assume recipeData contains the necessary 'staged' field or set it here
            state.selectedRecipes[recipeId] = { ...recipeData, staged: true };
        },
        deselectRecipe: (state, action) => {
            const { recipeId } = action.payload;
            delete state.selectedRecipes[recipeId];
        },
        clearSelectedRecipes: (state) => {
            state.selectedRecipes = {};
        },
        updateSelectedRecipes: (state, action) => {
            state.selectedRecipes = action.payload;
        },
        toggleSelectRecipe: (state, action) => {
            const { recipeId } = action.payload;
            if (state.selectedRecipes[recipeId]) {
                state.selectedRecipes[recipeId].selected = !state.selectedRecipes[recipeId].selected;
            }
        },
        removeSelectedRecipes: (state) => {
            Object.keys(state.selectedRecipes).forEach(id => {
                if (state.selectedRecipes[id].selected) {
                    delete state.selectedRecipes[id];
                }
            });
        },
    },
});

// Export actions
export const { selectRecipe, deselectRecipe, clearSelectedRecipes, updateSelectedRecipes, toggleSelectRecipe, removeSelectedRecipes } = selectedRecipeSlice.actions;

// Export reducer
export default selectedRecipeSlice.reducer;
