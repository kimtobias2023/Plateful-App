import { Sequelize, Op } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';
import Label from '../../models/labels/Label.mjs';
import { Recipe, RecipeIngredientSection, RecipeInstructionSection, RecipeIngredient, RecipeInstruction, RecipeRatingsReview, RecipeLabel, RecipeNote } from '../../models/recipes/index.mjs';
import { getFullRecipeByIdService } from './getFullRecipeByIdService.mjs';


async function createRecipeService(recipeData, userId, transaction = null) {
    let t; // Declare transaction variable
    try {
        if (transaction) {
            t = transaction; // Use provided transaction if available
        } else {
            t = await sequelize.transaction(); // Create new transaction if not provided
        }

        // Create the main recipe
        console.log("Creating main recipe...");
        const newRecipe = await Recipe.create({
            ...recipeData,
            userId: userId,
            RecipeIngredientSections: undefined,
            RecipeInstructionSections: undefined,
        }, { transaction: t });

        // Process RecipeIngredientSections if present
        console.log("Processing RecipeIngredientSections...");
        if (recipeData.RecipeIngredientSections) {
            for (const sectionData of recipeData.RecipeIngredientSections) {
                const section = await RecipeIngredientSection.create({
                    ...sectionData,
                    recipeId: newRecipe.id,
                    RecipeIngredients: undefined,
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
        console.log("Processing RecipeInstructionSections...");
        if (recipeData.RecipeInstructionSections) {
            for (const sectionData of recipeData.RecipeInstructionSections) {
                const section = await RecipeInstructionSection.create({
                    ...sectionData,
                    recipeId: newRecipe.id,
                    RecipeInstructions: undefined,
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

        // Process RecipeNotes if present
        console.log("Processing RecipeNotes...");
        if (recipeData.RecipeNotes) {
            for (const noteData of recipeData.RecipeNotes) {
                await RecipeNote.create({
                    ...noteData,
                    recipeId: newRecipe.id,
                }, { transaction: t });
            }
        }

        // Process Labels if present
        console.log("Processing Labels...");
        if (recipeData.labels && recipeData.labels.length) {
            for (const labelData of recipeData.labels) {
                let label = await Label.findOne({
                    where: { labelName: labelData.labelName },
                    transaction: t,
                });

                if (!label) {
                    label = await Label.create({
                        labelName: labelData.labelName,
                        labelType: labelData.labelType,
                    }, { transaction: t });
                }

                await RecipeLabel.create({
                    recipeId: newRecipe.id,
                    labelId: label.id,
                }, { transaction: t });
            }
        }

        console.log("Committing transaction...");
        await t.commit();
        console.log("Transaction committed successfully.");

        console.log("Fetching full recipe by ID...");
        return await getFullRecipeByIdService(newRecipe.id, t);
    } catch (error) {
        if (t) {
            await t.rollback();
        }
        console.error("Error in createRecipeService:", error);
        throw error;
    }
}

export { createRecipeService };





