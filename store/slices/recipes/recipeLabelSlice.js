import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@axiosInstance';
import { transformLabelData } from '@utils/transformLabelData';
// Inside the slice

export const initialState = {
    labelOptions: {},
    sharedLabels: [],
    stagedLabels: [],
    isLoading: false,
    error: null,
};

// Async thunk to fetch label options
export const fetchLabelsAsync = createAsyncThunk(
    'recipeLabel/fetchLabels',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/labels');
            return transformLabelData(response.data);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for updating recipe label associations
export const updateRecipeLabelAsync = createAsyncThunk(
    'recipeLabel/updateRecipeLabel',
    async ({ recipeId, payload }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/recipes/${recipeId}/updateLabel`, payload);
            return response.data;  // Return the updated data or any relevant info
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const recipeLabelSlice = createSlice({
    name: 'recipeLabel',
    initialState,
    reducers: {
        stageLabel: (state, action) => {
            const { currentLabelId, newLabelId, labelType, labelName } = action.payload;
            // Check if the currentLabelId exists in sharedLabels
            const labelExists = state.sharedLabels.some(label => label.id === currentLabelId);
            if (!labelExists) {
                state.error = `Label with ID: ${currentLabelId} does not exist.`;
                return;
            }
            // Update sharedLabels by replacing the current label with the new one
            state.sharedLabels = state.sharedLabels.map(label => {
                if (label.id === currentLabelId) {
                    return { id: newLabelId, labelType, labelName };
                }
                return label;
            });
            // Update stagedLabels if needed
            state.stagedLabels = state.stagedLabels.filter(label => label.id !== currentLabelId);
        },
        updateSharedLabels: (state, action) => {
            state.sharedLabels = action.payload;
        },
        setStagedLabels: (state, action) => {
            state.stagedLabels = action.payload;
        },
        addStagedLabel: (state, action) => {
            const newLabel = action.payload;
            state.stagedLabels.push(newLabel);
        },
        removeStagedLabel: (state, action) => {
            const labelIdToRemove = action.payload;
            state.stagedLabels = state.stagedLabels.filter(label => label.id !== labelIdToRemove);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLabelsAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLabelsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.labelOptions = action.payload;
            })
            .addCase(fetchLabelsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateRecipeLabelAsync.fulfilled, (state, action) => {
                // Handle the successful label update
            })
            .addCase(updateRecipeLabelAsync.rejected, (state, action) => {
                // Handle errors
            });
    },
});

export const {
    updateSharedLabels,
    stageLabel,
    setStagedLabels,
    addStagedLabel,
    removeStagedLabel
} = recipeLabelSlice.actions;

export default recipeLabelSlice.reducer;
