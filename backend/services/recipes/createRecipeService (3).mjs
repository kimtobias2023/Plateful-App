import { Sequelize, Op } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';
import Label from '../../models/labels/Label.mjs';
import { Recipe, RecipeIngredientSection, RecipeInstructionSection, RecipeIngredient, RecipeInstruction, RecipeRatingsReview, RecipeLabel, RecipeNote } from '../../models/recipes/index.mjs';
import { getFullRecipeByIdService } from './getFullRecipeByIdService.mjs';


async function createRecipeService(recipeData, userId, transaction = null) {
    let t; // Declare transaction variable
    try {
        console.log("Received recipe data:", recipeData); // Log the received recipe data
        console.log("User ID:", userId); // Log the user ID
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
        console.log("New recipe created:", newRecipe);


        // Process RecipeIngredientSections if present
        if (recipeData.sections) {
            console.log("Processing RecipeIngredientSections...");
            for (const section of recipeData.sections) {
                if (section.ingredients && section.ingredients.length > 0) {
                    // Get the ingredientHeader from the current section
                    const ingredientHeader = section.ingredientHeader;

                    const newIngredientSection = await RecipeIngredientSection.create({
                        ingredientHeader: ingredientHeader,
                        recipeId: newRecipe.id,
                    }, { transaction: t });

                    for (const ingredient of section.ingredients) {
                        await RecipeIngredient.create({
                            sectionId: newIngredientSection.id,
                            quantity: ingredient.quantity,
                            unit: ingredient.unit,
                            ingredientNotes: ingredient.ingredientNotes,
                            ingredientName: ingredient.ingredientName,
                        }, { transaction: t });
                    }
                }
            }
        }

        // Process RecipeInstructionSections if present
        if (recipeData.sections) {
            console.log("Processing RecipeInstructionSections...");
            for (const section of recipeData.sections) {
                if (section.instructions && section.instructions.length > 0) {
                    // Get the instructionHeader from the current section
                    const instructionHeader = section.instructionHeader;

                    const newInstructionSection = await RecipeInstructionSection.create({
                        instructionHeader: instructionHeader,
                        recipeId: newRecipe.id,
                    }, { transaction: t });

                    for (const instruction of section.instructions) {
                        await RecipeInstruction.create({
                            sectionId: newInstructionSection.id,
                            stepNumber: instruction.stepNumber, // Add stepNumber if available
                            instruction: instruction.instruction,
                        }, { transaction: t });
                    }
                }
            }
        }



        // Process RecipeNotes if present
        console.log("Processing RecipeNotes...");
        if (recipeData.RecipeNotes) {
            console.log("RecipeNotes:", recipeData.RecipeNotes); // Log the recipe notes data
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
            console.log("Labels:", recipeData.labels); // Log the labels data
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






