import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@axiosInstance';

// Initial state for the recipe instructions slice
export const recipeInstructionInitialState = {
    currentRecipe: null, // Assuming this is the recipe being edited
    stagedInstructions: [],
    isEditing: false,
    addingSection: false,
    isLoading: false,
    error: null,
};

const recipeInstructionSlice = createSlice({
    name: 'recipeInstruction',
    initialState,
    reducers: {
        setIsEditing: (state, action) => {
            state.isEditing = action.payload;
        },
        setCurrentRecipe: (state, action) => {
            state.currentRecipe = action.payload;
        },
        setAddingSection: (state, action) => {
            state.addingSection = action.payload;
        },
        setStagedInstructions: (state, action) => {
            state.stagedInstructions = action.payload;
        },
        addInstruction: (state, action) => {
            const { sectionId, newInstruction } = action.payload;
            state.currentRecipe.RecipeSections = state.currentRecipe.RecipeSections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        RecipeInstructions: [...section.RecipeInstructions, newInstruction],
                    };
                }
                return section;
            });
        },
        removeInstruction: (state, action) => {
            const { sectionId, instructionId } = action.payload;
            state.currentRecipe.RecipeSections = state.currentRecipe.RecipeSections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        RecipeInstructions: section.RecipeInstructions.filter(instruction => instruction.id !== instructionId),
                    };
                }
                return section;
            });
        },
        handleInstructionChange: (state, action) => {
            const { sectionId, instructionId, field, value } = action.payload;
            state.currentRecipe.RecipeSections = state.currentRecipe.RecipeSections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        RecipeInstructions: section.RecipeInstructions.map(instruction => {
                            if (instruction.id === instructionId) {
                                return { ...instruction, [field]: value };
                            }
                            return instruction;
                        }),
                    };
                }
                return section;
            });
        },
        addInstructionSection: (state) => {
            state.currentRecipe.RecipeSections.push({
                id: Date.now(),  // Or use a unique identifier generator
                instructionHeader: "",
                RecipeInstructions: [],
            });
        },
        removeInstructionSection: (state, action) => {
            const { sectionId } = action.payload;
            state.currentRecipe.RecipeSections = state.currentRecipe.RecipeSections.filter(section => section.id !== sectionId);
        },
        undoInstructionChange: (state) => {
            if (state.past.length > 0) {
                const previous = state.past.pop();
                state.future.unshift(state.stagedInstructions);
                state.stagedInstructions = previous;
            }
        },
        redoInstructionChange: (state) => {
            if (state.future.length > 0) {
                const next = state.future.shift();
                state.past.push(state.stagedInstructions);
                state.stagedInstructions = next;
            }
        },
    },
    // Include extraReducers if you need to handle async actions with createAsyncThunk
    // For example: fetchInstructionsAsync, createInstructionSectionAsync, etc.
});

export const {
    setIsEditing,
    setCurrentRecipe,
    setAddingSection,
    setStagedInstructions,
    addInstruction,
    removeInstruction,
    handleInstructionChange,
    addInstructionSection,
    removeInstructionSection,
    undoInstructionChange,
    redoInstructionChange
} = recipeInstructionSlice.actions;

export default recipeInstructionSlice.reducer;

