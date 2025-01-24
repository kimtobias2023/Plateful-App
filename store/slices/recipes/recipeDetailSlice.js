import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@axiosInstance';
import { selectCurrentUser, selectCurrentUserId } from 'store/slices/authSlice';
import { transformLabelData } from '@utils/transformLabelData';


export const initialState = {
    currentRecipe: {
        id: null,
        name: "",
        description: "",
        RecipeIngredientSections: [ // Renamed from 'sections' to 'ingredientSections' for clarity
            // This will hold sections related to ingredients
            // Example: { id: 1, sectionName: "For the Cake", ingredients: [...], sectionOrder: 1 }
        ],
        RecipeInstructionSections: [ // New addition for instruction sections
            // This will hold sections related to instructions
            // Example: { id: 1, sectionName: "Baking the Cake", instructions: [...], sectionOrder: 1 }
        ],
        notes: [],
        ratings: {
            taste: 0,
            time: 0,
            difficulty: 0,
            health: 0,
        },
        labels: [], // Assuming labels are part of your recipe
    },
    // Other state properties remain unchanged
    originalRecipe: null, // For tracking changes during edit
    isLoading: false,
    error: null,
    errorMessage: "",
    isEditing: false,
    reviewText: '', // Consider if this should be part of `currentRecipe` if it's about the recipe
    addingSection: false, // UI state for adding sections
    past: [], // For undo functionality
    future: [], // For redo functionality
    editTimeFields: {
        preparationTime: false,
        cookingTime: false,
        totalTime: false,
    },
    labelOptions: {}, // For managing available label options
    units: [], // If units are fetched globally and not part of each recipe
    nutrition: {
        calories: null,
        proteinContent: null,
        fatContent: null,
        carbohydrateContent: null,
        saturatedFatContent: null,
        unsaturatedFatContent: null,
        fiberContent: null,
        cholesterolContent: null,
        sugarContent: null,
        sodiumContent: null,
        servingSize: null,
    },
};



export const fetchRecipeDetails = createAsyncThunk(
    'recipeDetails/fetchRecipeDetails',
    async (recipeId, { dispatch, getState, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/recipes/${recipeId}/details`);
            console.log("Fetched Recipe Details:", response.data);

            if (!response.data) {
                console.error("Fetched recipe details are undefined.");
                return rejectWithValue("Fetched recipe details are undefined.");
            }

            // Assuming currentUser is defined somewhere, if needed for conditional logic
            const currentUser = selectCurrentUser(getState()); // Ensure you have this selector implemented

            // Initialize userRating with default values to ensure it always exists
            let userRating = {
                tasteRating: 0,
                timeRating: 0,
                difficultyRating: 0,
                healthRating: 0,
            };

            // Update userRating with actual values if available
            if (currentUser && response.data.userRating) {
                userRating = {
                    tasteRating: response.data.userRating.tasteRating ?? 0,
                    timeRating: response.data.userRating.timeRating ?? 0,
                    difficultyRating: response.data.userRating.difficultyRating ?? 0,
                    healthRating: response.data.userRating.healthRating ?? 0,
                };
                console.log('userRating:', userRating);
            }

            // Transform the fetched data to match the Redux state structure
            const transformedData = {
                ...response.data,
                ratings: {
                    taste: userRating.tasteRating,
                    time: userRating.timeRating,
                    difficulty: userRating.difficultyRating,
                    health: userRating.healthRating,
                },
                labels: {
                    diet: response.data.Labels.find(label => label.labelType === 'diet')?.labelName || null,
                    cuisine: response.data.Labels.find(label => label.labelType === 'cuisine')?.labelName || null,
                    course: response.data.Labels.find(label => label.labelType === 'course')?.labelName || null,
                },
                notes: response.data.notes ?? [],
                // You can add transformations for RecipeRatingsReviews and RecipeSections if needed
            };

            dispatch(updateRecipeLabel(transformedData.labels));
            dispatch(setInitialRatings(transformedData.ratings));

            return transformedData;
        } catch (error) {
            console.error("Error fetching recipe details:", error);
            return rejectWithValue(error.message);
        }
    }
);


export const saveEditedRecipe = createAsyncThunk(
    'recipeDetails/saveEditedRecipe',
    async ({ recipeId, updatedData }, { getState, dispatch, rejectWithValue }) => {
        try {

            const payload = {
                ...getState().recipeDetail.currentRecipe, // Spread existing recipe details
                ...updatedData, // Apply updated data, including the new labels structure
            };

            const response = await axiosInstance.put(`/recipes/${recipeId}`, payload);
            console.log('Update response:', response.data);

            dispatch(updateCurrentRecipeDetails(response.data));
        } catch (error) {
            console.error("Error in saveEditedRecipe:", error);
            return rejectWithValue(error.message);
        }
    }
);



// Thunk for updating recipe details
export const updateRecipeDetails = createAsyncThunk(
    'recipeDetails/updateRecipeDetails',
    async ({ recipeId, payload }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/recipes/${recipeId}`, payload);
            console.log("Recipe details updated successfully:", response.data);
            return response.data; // Return the updated recipe data
        } catch (error) {
            console.error("Failed to update recipe details:", error);
            return rejectWithValue(error.message);
        }
    }
);

// Create the submitReview thunk
export const submitReview = createAsyncThunk(
    'recipeDetails/submitReview',
    async ({ recipeId, reviewText }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/recipes/${recipeId}/review`, { reviewText });
            return response.data; // Return response data upon successful review submission
        } catch (error) {
            return rejectWithValue(error.message); // Handle any errors
        }
    }
);

// Async thunk to fetch units
export const fetchUnitsAsync = createAsyncThunk(
    'recipeIngredient/fetchUnits',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/units');
            return response.data;
        } catch (error) {
            console.error('Error fetching units:', error);
            return rejectWithValue(error.message);
        }
    }
);

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

export const submitRatingAsync = createAsyncThunk(
    'recipeRating/submitRating',
    async ({ recipeId, ratings }, { getState, rejectWithValue }) => {
        console.log('User slice state:', getState().user);
        const userId = selectCurrentUserId(getState());

        if (!userId) {
            console.error('Error: User ID is undefined');
            return rejectWithValue('User not logged in');
        }

        try {
            const response = await axiosInstance.post(`/recipes/${recipeId}/rate`, {
                userId,
                ...ratings
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting rating:', error);
            if (error.response) {

            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
            }
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const recipeDetailSlice = createSlice({
    name: 'recipeDetails',
    initialState,
    reducers: {
        updateRecipeName: (state, action) => {
            const { recipeId, name } = action.payload;
            if (state.currentRecipe.id === recipeId) {
                state.currentRecipe.recipeName = name;
            }
        },
        updateCookTime: (state, action) => {
            const { preparationTime, cookingTime, totalTime } = action.payload;

            // Assuming the times are already in minutes or converted to minutes before dispatching this action
            if (state.currentRecipe) {
                state.currentRecipe.preparationTime = preparationTime;
                state.currentRecipe.cookingTime = cookingTime;
                state.currentRecipe.totalTime = totalTime;
            }
        },
        updateRecipeDescription: (state, action) => {
            const { recipeId, description } = action.payload;
            if (state.currentRecipe.id === recipeId) {
                state.currentRecipe.recipeDescription = description;
            }
        },
        addLabel: (state, action) => {
            const newLabel = action.payload; // Assume payload contains the label object
            state.currentRecipe.labels.push(newLabel);
        },
        removeLabel: (state, action) => {
            const labelIdToRemove = action.payload; // Assume payload contains the label ID
            state.currentRecipe.labels = state.currentRecipe.labels.filter(label => label.id !== labelIdToRemove);
        },
        updateRecipeLabel: (state, action) => {
            const { recipeId, type, name } = action.payload;
            if (state.currentRecipe.id === recipeId) {
                // Assuming labels is an object with keys as label types
                if (name === null || name === 'None') {
                    // Remove the label by setting its value to null
                    state.currentRecipe.labels[type] = null;
                } else {
                    // Update or add the label
                    state.currentRecipe.labels[type] = name;
                }
            }
        },
        handleRatingChange: (state, action) => {
            const { category, newRating } = action.payload;
            // Initialize ratings if it doesn't exist or if it's somehow undefined
            if (!state.currentRecipe.ratings || typeof state.currentRecipe.ratings !== 'object') {
                state.currentRecipe.ratings = {
                    taste: 0,
                    time: 0,
                    difficulty: 0,
                    health: 0,
                };
            }
            state.currentRecipe.ratings[category] = newRating;
        },
        setInitialRatings: (state, action) => {
            if (!state.initialRatingsSet) {
                const { taste, time, difficulty, health } = action.payload;
                state.currentRecipe.ratings.taste = taste ?? 0;
                state.currentRecipe.ratings.time = time ?? 0;
                state.currentRecipe.ratings.difficulty = difficulty ?? 0;
                state.currentRecipe.ratings.health = health ?? 0;
                state.initialRatingsSet = true; // Ensure this gets updated correctly
            }
        },
        setCurrentRecipe: (state, action) => {
            state.currentRecipe = action.payload;
        },
        setIsEditing: (state, action) => {
            state.isEditing = action.payload;
            if (action.payload) {
                // Store the current recipe as originalRecipe when editing starts
                state.originalRecipe = state.currentRecipe;
            }
        },
        cancelEditing: (state) => {
            if (state.originalRecipe) {
                // Revert to the original recipe
                state.currentRecipe = state.originalRecipe;
            }
            state.isEditing = false;
            state.originalRecipe = null; // Clear the original recipe
        },
        setAddingSection: (state, action) => {
            state.addingSection = action.payload;
        },
        handleError: (state, action) => {
            state.errorMessage = action.payload;
        },
        handleTimeChange: (state, action) => {
            const { field, value } = action.payload;
            const intValue = parseInt(value, 10);
            if (!isNaN(intValue) && intValue >= 0) {
                state.currentRecipe[field] = intValue;
            }
        },
        undo: (state) => {
            if (state.past.length > 0) {
                const previous = state.past[state.past.length - 1];
                state.future.unshift(state.currentRecipe);
                state.currentRecipe = previous;
                state.past.pop();
            }
        },
        redo: (state) => {
            if (state.future.length > 0) {
                const next = state.future[0];
                state.past.push(state.currentRecipe);
                state.currentRecipe = next;
                state.future.shift();
            }
        },
        makeChange: (state, action) => {
            state.past.push(state.currentRecipe);
            state.currentRecipe = action.payload;
            state.future = [];
        },
        setEditTimeFields: (state, action) => {
            const { field, value } = action.payload;
            state.editTimeFields[field] = value;
        },
        updateServings: (state, action) => {
            const { recipeId, servings } = action.payload;
            if (state.currentRecipe && state.currentRecipe.id === recipeId) {
                state.currentRecipe.servings = servings;
            }
        },
        updateIngredientSectionHeader: (state, action) => {
            const { sectionId, newHeader } = action.payload;
            const updatedIngredientSections = state.currentRecipe.RecipeIngredientSections.map(section => {
                if (section.id === sectionId) {
                    return { ...section, ingredientHeader: newHeader };
                }
                return section;
            });
            state.currentRecipe.RecipeIngredientSections = updatedIngredientSections;
        },
        addIngredientSection: (state, action) => {
            const newSection = {
                ingredientHeader: 'New Ingredient Header...',
                RecipeIngredients: [{ 
                    quantity: '',
                    unit: '',
                    ingredientName: 'New Ingredient...',
                    ingredientNotes: '',
                }],
                isNew: true 
            };
            state.currentRecipe.RecipeIngredientSections.push(newSection);
        },
        removeIngredientSection: (state, action) => {
            const { sectionId } = action.payload;
            // Filter out the section by ID. For new sections, ensure the temporary ID matches.
            state.currentRecipe.RecipeIngredientSections = state.currentRecipe.RecipeIngredientSections.filter(section =>
                section.id !== sectionId || (section.isNew && section.tempId === sectionId)
            );
        },
        addIngredient: (state, action) => {
            const { sectionId, newIngredient } = action.payload;
            const updatedIngredientSections = state.currentRecipe.RecipeIngredientSections.map(section => {
                if (section.id === sectionId) {
                    const ingredientToAdd = { ...newIngredient, isNew: true };
                    return {
                        ...section,
                        RecipeIngredients: [...section.RecipeIngredients, ingredientToAdd]
                    };
                }
                return section;
            });
            state.currentRecipe.RecipeIngredientSections = updatedIngredientSections;
        },
        removeIngredient: (state, action) => {
            const { sectionId, ingredientId } = action.payload;
            const sectionIndex = state.currentRecipe.RecipeIngredientSections.findIndex(section => section.id === sectionId);

            if (sectionIndex !== -1) {
                // Remove the ingredient from the section
                const ingredients = state.currentRecipe.RecipeIngredientSections[sectionIndex].RecipeIngredients.filter(ingredient => ingredient.id !== ingredientId);

                // If it's the last ingredient in a new section, remove the entire section
                if (ingredients.length === 0 && state.currentRecipe.RecipeIngredientSections[sectionIndex].isNew) {
                    state.currentRecipe.RecipeIngredientSections.splice(sectionIndex, 1);
                } else {
                    // Otherwise, just update the ingredients array for the section
                    state.currentRecipe.RecipeIngredientSections[sectionIndex].RecipeIngredients = ingredients;
                }
            }
        },
        updateIngredient: (state, action) => {
            const { sectionId, ingredientId, value } = action.payload;
            state.currentRecipe.RecipeIngredientSections = state.currentRecipe.RecipeIngredientSections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        RecipeIngredients: section.RecipeIngredients.map(ingredient => {
                            if (ingredient.id === ingredientId) {
                                return { ...ingredient, ...value };
                            }
                            return ingredient;
                        })
                    };
                }
                return section;
            });
        },
        updateInstructionSectionHeader: (state, action) => {
            console.log("Updating instruction section header with", action.payload);
            const { sectionId, newHeader } = action.payload;
            const sectionIndex = state.currentRecipe.RecipeInstructionSections.findIndex(section => section.id === sectionId);
            if (sectionIndex !== -1) {
                state.currentRecipe.RecipeInstructionSections[sectionIndex].instructionHeader = newHeader;
            }
        },
        addInstruction: (state, action) => {
            const { sectionId, newInstruction } = action.payload;
            state.currentRecipe.RecipeInstructionSections = state.currentRecipe.RecipeInstructionSections.map(section => {
                if (section.id === sectionId) {
                    // Determine the next step number
                    const maxStepNumber = section.RecipeInstructions.reduce((max, instruction) => Math.max(max, instruction.stepNumber), 0);
                    const instructionToAdd = { ...newInstruction, stepNumber: maxStepNumber + 1, isNew: true };
                    return {
                        ...section,
                        RecipeInstructions: [...section.RecipeInstructions, instructionToAdd],
                    };
                }
                return section;
            });
        },
        removeInstruction: (state, action) => {
            const { sectionId, instructionId } = action.payload;
            state.currentRecipe.RecipeInstructionSections = state.currentRecipe.RecipeInstructionSections.map(section => {
                if (section.id === sectionId) {
                    // Remove the instruction
                    const updatedInstructions = section.RecipeInstructions.filter(instruction => instruction.id !== instructionId);
                    // Re-sequence the stepNumber for remaining instructions
                    updatedInstructions.forEach((instruction, index) => {
                        instruction.stepNumber = index + 1;
                    });
                    return { ...section, RecipeInstructions: updatedInstructions };
                }
                return section;
            });
        },
        updateInstruction: (state, action) => {
            const { sectionId, instructionId, field, value } = action.payload;
            state.currentRecipe.RecipeInstructionSections = state.currentRecipe.RecipeInstructionSections.map(section => {
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
            const newSection = {
                instructionHeader: "New Instruction Header...",
                RecipeInstructions: [{
                    stepNumber: 1,
                    instruction: 'New instruction...'
                }],
                isNew: true
            };
            state.currentRecipe.RecipeInstructionSections.push(newSection);
        },
        removeInstructionSection: (state, action) => {
            const { sectionId } = action.payload;
            state.currentRecipe.RecipeInstructionSections = state.currentRecipe.RecipeInstructionSections.filter(section => section.id !== sectionId);
        },

        updateCurrentRecipeDetails: (state, action) => {
            state.currentRecipe = { ...state.currentRecipe, ...action.payload };
        },
        addNewNote: (state, action) => {
            const newNote = {
                id: Date.now(), // Temporary ID
                note: action.payload.noteText,
                isNew: true, // Flag to indicate it's a new note
            };
            state.currentRecipe.RecipeNotes.push(newNote);
        },

        // Updating a note
        updateNote: (state, action) => {
            const { noteId, newValue } = action.payload;
            const noteIndex = state.currentRecipe.RecipeNotes.findIndex(note => note.id === noteId);
            if (noteIndex !== -1) {
                // Update note content and remove isNew flag if present
                state.currentRecipe.RecipeNotes[noteIndex].note = newValue;
                if ('isNew' in state.currentRecipe.RecipeNotes[noteIndex]) {
                    delete state.currentRecipe.RecipeNotes[noteIndex].isNew;
                }
            }
        },
        deleteNote: (state, action) => {
            const noteId = action.payload;
            state.currentRecipe.RecipeNotes = state.currentRecipe.RecipeNotes.filter(note => note.id !== noteId);
        },
        updateIngredientUnit: (state, action) => {
            // Destructure the payload to get the sectionId, ingredientId, and new unit value
            const { sectionId, ingredientId, unit } = action.payload;

            // Find the section that contains the ingredient to be updated
            const sectionIndex = state.currentRecipe.RecipeSections.findIndex(section => section.id === sectionId);
            if (sectionIndex === -1) return; // Section not found, so do nothing

            // Find the ingredient within the section
            const ingredientIndex = state.currentRecipe.RecipeSections[sectionIndex].RecipeIngredients.findIndex(ingredient => ingredient.id === ingredientId);
            if (ingredientIndex === -1) return; // Ingredient not found, so do nothing

            // Update the unit of the ingredient
            state.currentRecipe.RecipeSections[sectionIndex].RecipeIngredients[ingredientIndex].unit = unit;
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
            })
            .addCase(fetchRecipeDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRecipeDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentRecipe = action.payload;
            })
            .addCase(fetchRecipeDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateRecipeDetails.fulfilled, (state, action) => {
                // Update the state with the new recipe data
                state.currentRecipe = action.payload;
            })
            .addCase(updateRecipeDetails.rejected, (state, action) => {
                // Handle any error
                state.error = action.payload;
            })
            .addCase(fetchUnitsAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUnitsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.units = action.payload;
            })
            .addCase(fetchUnitsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.units = action.payload || [];
            })
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
    updateRecipeDescription,
    addLabel,
    removeLabel,
    updateRecipeLabel,
    setCurrentRecipe,
    setIsEditing,
    cancelEditing,
    setAddingSection,
    handleError,
    handleTimeChange,
    setEditTimeFields,
    updateIngredientSectionHeader,
    updateInstructionSectionHeader,
    undo,
    redo,
    updateServings,
    addIngredientSection,
    addIngredient,
    removeIngredient,
    removeIngredientSection,
    updateIngredient,
    addInstruction,
    removeInstruction,
    updateInstruction,
    addInstructionSection,
    removeInstructionSection,
    updateCurrentRecipeDetails,
    handleRatingChange,
    setInitialRatings,
    addNewNote,
    updateNote,
    deleteNote,
    updateIngredientUnit,
    updateCookTime,
    updateRecipeName
} = recipeDetailSlice.actions;

export default recipeDetailSlice.reducer;

