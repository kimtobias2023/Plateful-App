import { Sequelize, Op } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';
import Label from '../../models/labels/Label.mjs';
import { Recipe, RecipeIngredientSection, RecipeInstructionSection, RecipeIngredient, RecipeInstruction, RecipeRatingsReview, RecipeLabel, RecipeNote, RecipeNutrition } from '../../models/recipes/index.mjs';

async function getFullRecipeByIdService(recipeId, userId) {
    try {
        const includeArray = [
            {
                model: RecipeIngredientSection,
                as: 'RecipeIngredientSections',
                include: [{ model: RecipeIngredient, as: 'RecipeIngredients' }],
                order: [['sectionOrder', 'ASC']],
            },
            {
                model: RecipeInstructionSection,
                as: 'RecipeInstructionSections',
                include: [{
                    model: RecipeInstruction,
                    as: 'RecipeInstructions',
                    order: [['stepNumber', 'ASC']] // Ensure step numbers are ordered
                }],
                order: [['sectionOrder', 'ASC']],
            },
            { model: Label, as: 'Labels', through: { attributes: [] } },
            { model: RecipeNote, as: 'RecipeNotes', required: false, order: [['createdAt', 'ASC']] }, // Ensure notes are ordered by creation time
            { model: RecipeNutrition, as: 'Nutrition' }, // Add the nutrition model to the include array
        ];

        if (typeof userId === 'number' && !isNaN(userId)) {
            includeArray.push({
                model: RecipeRatingsReview,
                as: 'RecipeRatingsReviews',
                where: { userId: userId },
                limit: 1,
                order: [['updatedAt', 'DESC']],
                required: false,
            });
        }

        const recipe = await Recipe.findByPk(recipeId, {
            include: includeArray,
        });

        if (!recipe) {
            throw new Error('Recipe not found');
        }

        // Format labels and possibly notes for the front-end
        const formattedLabels = recipe.Labels.map(label => ({
            id: label.dataValues.id,
            labelName: label.dataValues.labelName,
            labelType: label.dataValues.labelType
        }));

        const formattedNotes = recipe.RecipeNotes.map(note => ({
            id: note.id,
            note: note.note, // Assuming note.note is the correct attribute for the note text
        }));

        const formattedNutrition = recipe.Nutrition ? {
            calories: recipe.Nutrition.calories,
            proteinContent: recipe.Nutrition.proteinContent,
            fatContent: recipe.Nutrition.fatContent,
            carbohydrateContent: recipe.Nutrition.carbohydrateContent,
            saturatedFatContent: recipe.Nutrition.saturatedFatContent,
            unsaturatedFatContent: recipe.Nutrition.unsaturatedFatContent,
            fiberContent: recipe.Nutrition.fiberContent,
            cholesterolContent: recipe.Nutrition.cholesterolContent,
            sugarContent: recipe.Nutrition.sugarContent,
            sodiumContent: recipe.Nutrition.sodiumContent,
            servingSize: recipe.Nutrition.servingSize,
            // ... more nutrition fields
        } : {};

        // User rating handling
        const userRating = recipe.RecipeRatingsReviews && recipe.RecipeRatingsReviews[0] ? {
            tasteRating: recipe.RecipeRatingsReviews[0].tasteRating,
            timeRating: recipe.RecipeRatingsReviews[0].timeRating,
            difficultyRating: recipe.RecipeRatingsReviews[0].difficultyRating,
            healthRating: recipe.RecipeRatingsReviews[0].healthRating,
        } : null;

        return {
            ...recipe.toJSON(),
            labels: formattedLabels,
            userRating,
            RecipeNotes: formattedNotes, // Ensure we're using RecipeNotes for consistency
            nutrition: formattedNutrition,
        };

    } catch (error) {
        console.error('getFullRecipeByIdService - Error:', error);
        throw error;
    }
}


export { getFullRecipeByIdService };


