import MealRating from '../../models/sequelize/menu/MealRating.mjs';

async function createMealRating(data) {
    try {
        const mealRating = await MealRating.create(data);
        return mealRating;
    } catch (error) {
        console.error("Error creating meal rating:", error);
        throw error;
    }
}

async function getMealRatingById(id) {
    try {
        return await MealRating.findByPk(id);
    } catch (error) {
        console.error("Error fetching meal rating by ID:", error);
        throw error;
    }
}

async function updateMealRatingById(id, data) {
    try {
        const mealRating = await getMealRatingById(id);
        if (!mealRating) {
            throw new Error("MealRating not found");
        }
        await mealRating.update(data);
        return mealRating;
    } catch (error) {
        console.error("Error updating meal rating:", error);
        throw error;
    }
}

async function deleteMealRatingById(id) {
    try {
        const mealRating = await getMealRatingById(id);
        if (!mealRating) {
            throw new Error("MealRating not found");
        }
        await mealRating.destroy();
        return true;
    } catch (error) {
        console.error("Error deleting meal rating:", error);
        throw error;
    }
}

async function listMealRatingsByUserId(userId) {
    try {
        return await MealRating.findAll({
            where: {
                user_id: userId
            }
        });
    } catch (error) {
        console.error("Error listing meal ratings by user ID:", error);
        throw error;
    }
}

// Using named exports
export {
    createMealRating,
    getMealRatingById,
    updateMealRatingById,
    deleteMealRatingById,
    listMealRatingsByUserId
};

