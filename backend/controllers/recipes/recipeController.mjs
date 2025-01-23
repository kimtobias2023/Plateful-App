// Import the necessary functions from recipeService
import {
    createRecipeService,
    getRecipeByIdService,
    getAllRecipesService,
    updateRecipeService,
    searchRecipeService,
    deleteRecipeService,
    getFullRecipeByIdService,
    submitRatingService
} from '../../services/recipes/index.mjs'; // Update the import path as needed


// Define your controller functions here
const createRecipeController = async (req, res) => {
    try {
        const recipeData = req.body;
        const newRecipe = await createRecipeService(recipeData);
        res.status(201).json(newRecipe);
    } catch (error) {
        console.error("Error in createRecipe:", error);
        res.status(500).json({ error: "Failed to create recipe" });
    }
};

const getRecipe = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const recipe = await getRecipeByIdService(recipeId);

        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.json(recipe);
    } catch (error) {
        console.error("Error in getRecipe:", error);
        res.status(500).json({ error: "Failed to retrieve recipe" });
    }
};

const getAllRecipeController = async (req, res) => {
    try {
        const recipes = await getAllRecipesService();
        res.json(recipes);
    } catch (error) {
        console.error("Error in getAllRecipe:", error);
        res.status(500).json({ error: "Failed to retrieve recipes" });
    }
};

const updateRecipeController = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const updatedData = req.body;

        // Log the incoming data for debugging (you can remove this in production)
        console.log("Updated data received:", updatedData);

        // Ensure that updatedData is in the expected format
        if (!updatedData || typeof updatedData !== 'object') {
            return res.status(400).json({ error: "Invalid update data" });
        }

        // Additional validation checks can be added here if necessary

        const updatedRecipe = await updateRecipeService(recipeId, updatedData);

        // The updatedRecipe should not be null or undefined if update was successful
        if (!updatedRecipe) {
            return res.status(404).json({ error: "Recipe not found or update failed" });
        }

        res.json(updatedRecipe);
    } catch (error) {
        console.error("Error in updateRecipeController:", error);
        res.status(500).json({ error: "Failed to update recipe" });
    }
};



const removeRecipe = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const result = await deleteRecipeService(recipeId);

        if (result === 0) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.json({ message: "Recipe removed successfully" });
    } catch (error) {
        console.error("Error in removeRecipe:", error);
        res.status(500).json({ error: "Failed to remove recipe" });
    }
};

const searchRecipeController = async (req, res) => {
    try {
        const searchTerm = req.query.query || '';
        const filters = { ...req.query };
        delete filters.query;

        // Transform filter values from strings to arrays or other necessary formats
        Object.keys(filters).forEach(key => {
            if (Array.isArray(req.query[key])) {
                filters[key] = req.query[key];
            } else if (typeof filters[key] === 'string' && filters[key].includes(',')) {
                filters[key] = filters[key].split(',');
            }
        });

        // Inside searchRecipeController
        if (filters.labels) {
            // Ensure filters.labels is always an array
            if (typeof filters.labels === 'string') {
                filters.labels = [filters.labels];
            }
            filters.labels = filters.labels.map(label => label.trim().toLowerCase());
        }


        console.log("Search Term:", searchTerm);
        console.log("Filters:", filters);

        const recipes = await searchRecipeService(searchTerm, filters);
        res.json(recipes);
    } catch (error) {
        console.error("Error in searchRecipes:", error);
        res.status(500).json({ error: "Failed to search recipes" });
    }
};

const getFullRecipeByIdController = async (req, res) => {
    try {
        console.log("User ID from req.user:", req.user.id);
        const { recipeId } = req.params;

        // Extract userId from req.user provided by authMiddleware
        const userId = req.user.id;

        const recipe = await getFullRecipeByIdService(recipeId, userId);
        console.log("recipeCardController - Recipe fetched successfully:", recipe);
        res.json(recipe);
    } catch (error) {
        console.error("recipeCardController - Error:", error);
        res.status(404).json({ message: error.message });
    }
};

const submitRatingController = async (req, res) => {
    const { recipeId } = req.params;
    const { userId, taste, time, difficulty, health } = req.body;

    // Validate the input data here (e.g., types, range)
    if (!isValidInput(recipeId, userId, taste, time, difficulty, health)) {
        return res.status(400).json({ error: "Invalid input" });
    }

    try {
        // Check user authentication and authorization here
        if (!isUserAuthorized(userId, recipeId)) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const rating = await submitRatingService({
            recipeId,
            userId,
            tasteRating: taste,
            timeRating: time,
            difficultyRating: difficulty,
            healthRating: health
        });

        res.status(201).json({ message: "Rating submitted successfully", rating });
    } catch (error) {
        console.error("Error in submitRatingController:", error);
        res.status(500).json({ error: "Failed to submit rating" });
    }
};

const isValidInput = (recipeId, userId, taste, time, difficulty, health) => {
    // Check if all inputs are defined
    if ([recipeId, userId, taste, time, difficulty, health].includes(undefined)) {
        return false;
    }

    // Check if ratings are integers and within the range of 1-5
    const ratings = [taste, time, difficulty, health];
    return ratings.every(rating => Number.isInteger(rating) && rating >= 1 && rating <= 5);
};


const isUserAuthorized = (userId, recipeId) => {
    // Temporarily allow all users to submit ratings for all recipes
    return true;
};


export {
    createRecipeController,
    getRecipe,
    getAllRecipeController,
    updateRecipeController,
    searchRecipeController,
    getFullRecipeByIdController,
    removeRecipe,
    submitRatingController
};
