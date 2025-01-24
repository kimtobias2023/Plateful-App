// File: controllers/sequelize/menu/mealRatingsController.mjs

import {
    createMealRating,
    getMealRatingById,
    updateMealRatingById,
    deleteMealRatingById,
    listMealRatingsByUserId
} from '../../services/sequelize/menu/mealRatingService.mjs';

// Create a new meal rating
async function createMealRatingEntry(req, res) {
    try {
        const mealRating = await createMealRating(req.body);
        res.status(201).json(mealRating);
    } catch (error) {
        console.error("Controller Error: Failed to create meal rating", error);
        res.status(500).json({ error: 'Failed to create meal rating' });
    }
}

// Retrieve a meal rating by its ID
async function getMealRating(req, res) {
    try {
        const { id } = req.params;
        const mealRating = await getMealRatingById(id);
        if (!mealRating) {
            return res.status(404).json({ error: 'Meal rating not found' });
        }
        res.json(mealRating);
    } catch (error) {
        console.error("Controller Error: Failed to retrieve meal rating", error);
        res.status(500).json({ error: 'Failed to retrieve meal rating' });
    }
}

// Update a meal rating by its ID
async function updateMealRating(req, res) {
    try {
        const { id } = req.params;
        const updatedMealRating = await updateMealRatingById(id, req.body);
        res.json(updatedMealRating);
    } catch (error) {
        console.error("Controller Error: Failed to update meal rating", error);
        res.status(500).json({ error: 'Failed to update meal rating' });
    }
}

// Delete a meal rating by its ID
async function deleteMealRating(req, res) {
    try {
        const { id } = req.params;
        const deleted = await deleteMealRatingById(id);
        if (deleted) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Meal rating not found' });
        }
    } catch (error) {
        console.error("Controller Error: Failed to delete meal rating", error);
        res.status(500).json({ error: 'Failed to delete meal rating' });
    }
}

// List all meal ratings for a specific user
async function listUserMealRatings(req, res) {
    try {
        const { userId } = req.params;
        const mealRatings = await listMealRatingsByUserId(userId);
        res.json(mealRatings);
    } catch (error) {
        console.error("Controller Error: Failed to list meal ratings", error);
        res.status(500).json({ error: 'Failed to list meal ratings' });
    }
}

// Export the controller functions
export {
    createMealRatingEntry,
    getMealRating,
    updateMealRating,
    deleteMealRating,
    listUserMealRatings
};
