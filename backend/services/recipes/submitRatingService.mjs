import { Sequelize, Op } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';
import Label from '../../models/labels/Label.mjs';
import { Recipe, RecipeIngredientSection, RecipeInstructionSection, RecipeIngredient, RecipeInstruction, RecipeRatingsReview, RecipeLabel, RecipeNote } from '../../models/recipes/index.mjs';
import { CustomError } from '../../utils/errors/index.mjs';
import { User } from '../../models/users/basic-profile/index.mjs'; 



async function createRecipeService(recipeData, transaction = null) {
    const t = transaction || await sequelize.transaction();
    try {
        // Create the main recipe
        const newRecipe = await Recipe.create({
            ...recipeData,
            // Exclude RecipeIngredientSections and RecipeInstructionSections from main recipe creation
            RecipeIngredientSections: undefined,
            RecipeInstructionSections: undefined,
        }, { transaction: t });

        // Process RecipeIngredientSections if present
        if (recipeData.RecipeIngredientSections) {
            for (const sectionData of recipeData.RecipeIngredientSections) {
                const section = await RecipeIngredientSection.create({
                    ...sectionData,
                    recipeId: newRecipe.id,
                    RecipeIngredients: undefined, // Exclude RecipeIngredients for now
                }, { transaction: t });

                // Create associated RecipeIngredients
                if (sectionData.RecipeIngredients) {
                    for (const ingredientData of sectionData.RecipeIngredients) {
                        await RecipeIngredient.create({
                            ...ingredientData,
                            sectionId: section.id,
                        }, { transaction: t });
                    }
                }
            }
        }

        // Process RecipeInstructionSections if present
        if (recipeData.RecipeInstructionSections) {
            for (const sectionData of recipeData.RecipeInstructionSections) {
                const section = await RecipeInstructionSection.create({
                    ...sectionData,
                    recipeId: newRecipe.id,
                    RecipeInstructions: undefined, // Exclude RecipeInstructions for now
                }, { transaction: t });

                // Create associated RecipeInstructions
                if (sectionData.RecipeInstructions) {
                    for (const instructionData of sectionData.RecipeInstructions) {
                        await RecipeInstruction.create({
                            ...instructionData,
                            sectionId: section.id,
                        }, { transaction: t });
                    }
                }
            }
        }

        // Assuming RecipeNotes might be part of recipeData
        if (recipeData.RecipeNotes) {
            for (const noteData of recipeData.RecipeNotes) {
                await RecipeNote.create({
                    ...noteData,
                    recipeId: newRecipe.id,
                }, { transaction: t });
            }
        }

        // Complete transaction and return the new recipe with all its associations
        await t.commit();
        return await getFullRecipeByIdService(newRecipe.id, t);
    } catch (error) {
        await t.rollback();
        console.error("Error in createRecipeService:", error);
        throw error;
    }
}


async function submitRatingService({ recipeId, userId, tasteRating, timeRating, difficultyRating, healthRating }) {
    console.log('Received ratings in service:', { recipeId, userId, tasteRating, timeRating, difficultyRating, healthRating }); // Debugging
    try {
        // Assuming you want to create a new rating or update the existing one for the user-recipe pair
        const [rating, created] = await RecipeRatingsReview.upsert({
            recipeId,
            userId,
            tasteRating,
            timeRating,
            difficultyRating,
            healthRating
        }, {
            returning: true // This will return the updated/created rating object
        });

        return rating;
    } catch (error) {
        console.error("Error in submitRatingService:", error);
        throw error;
    }
}

export {
    createRecipeService,
    submitRatingService
};


