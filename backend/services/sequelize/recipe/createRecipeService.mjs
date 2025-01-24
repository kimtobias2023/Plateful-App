
import Label from '../../../models/sequelizelabel/Label.mjs';
import { Recipe, RecipeIngredientSection, RecipeInstructionSection, RecipeIngredient, RecipeInstruction, RecipeLabel, RecipeNote, RecipeNutrition } from '../../models/sequelize/recipe/index.mjs';
import { getFullRecipeByIdService } from './getFullRecipeByIdService.mjs';


async function createRecipeService(normalizedData, userId, transaction, commitTransaction = false) {
    try {
        // Create the main recipe with normalized basic info
        const newRecipe = await Recipe.create({
            recipeName: normalizedData.recipeName,
            recipeDescription: normalizedData.recipeDescription,
            recipeImageUrl: normalizedData.imageUrl,
            recipeLink: normalizedData.recipeLink,
            websiteUrl: normalizedData.websiteUrl,
            author: normalizedData.author,
            preparationTime: normalizedData.preparationTime,
            cookingTime: normalizedData.cookingTime,
            totalTime: normalizedData.totalTime,
            servings: normalizedData.servings,
            userId: userId,
        }, { transaction });

        console.log("New recipe created:", newRecipe);

        // Process and create ingredient sections
        for (const section of normalizedData.ingredientSections) {
            const newIngredientSection = await RecipeIngredientSection.create({
                "ingredientHeader": section.header, // Adjusted from header to ingredientHeader
                "sectionOrder": section.sectionOrder,
                "recipeId": newRecipe.id,
            }, { transaction });

            for (const item of section.items) {
                await RecipeIngredient.create({
                    "sectionId": newIngredientSection.id,
                    "ingredientName": item.name, // Ensure this matches your RecipeIngredient model's expectation
                    "quantity": item.quantity,
                    "unit": item.unit,
                    "ingredientNotes": item.notes, // Adjust the property name as per your model
                }, { transaction });
            }
        }


        // Process and create instruction sections
        for (const section of normalizedData.instructionSections) {
            const newInstructionSection = await RecipeInstructionSection.create({
                header: section.header,
                sectionOrder: section.sectionOrder,
                recipeId: newRecipe.id,
            }, { transaction });

            for (const instruction of section.instructions) {
                await RecipeInstruction.create({
                    sectionId: newInstructionSection.id,
                    stepNumber: instruction.stepNumber,
                    instruction: instruction.instruction,
                }, { transaction });
            }
        }

        // Process labels (course, cuisine, diet)
        for (const labelData of normalizedData.labels) {
            // Check if labelData.labelName is an array
            if (Array.isArray(labelData.labelName)) {
                for (const name of labelData.labelName) {
                    await processLabel(name, labelData.labelType, newRecipe.id, transaction);
                }
            } else if (typeof labelData.labelName === 'string') {
                await processLabel(labelData.labelName, labelData.labelType, newRecipe.id, transaction);
            } else {
                console.error('Unexpected labelName type:', labelData.labelName);
                // Handle the unexpected type appropriately
            }
        }

        async function processLabel(name, type, recipeId, transaction) {
            // Ensure name is treated as a lowercase string for consistency
            const labelNameLower = name.toLowerCase();

            // Find or create the label
            let [label, created] = await Label.findOrCreate({
                where: { labelName: labelNameLower, labelType: type },
                defaults: { labelName: labelNameLower, labelType: type },
                transaction
            });

            // Create the recipe-label association
            await RecipeLabel.create({
                recipeId: recipeId,
                labelId: label.id,
            }, { transaction });
        }



        // Process recipe notes
        for (const note of normalizedData.recipeNotes) {
            await RecipeNote.create({
                note: note,
                recipeId: newRecipe.id,
            }, { transaction });
        }

        // Check if nutrition data is present and insert it
        if (normalizedData.nutrition && Object.keys(normalizedData.nutrition).length > 0) {
            await RecipeNutrition.create({
                recipeId: newRecipe.id,
                calories: normalizedData.nutrition.calories,
                proteinContent: normalizedData.nutrition.proteinContent,
                fatContent: normalizedData.nutrition.fatContent,
                carbohydrateContent: normalizedData.nutrition.carbohydrateContent,
                saturatedFatContent: normalizedData.nutrition.saturatedFatContent,
                unsaturatedFatContent: normalizedData.nutrition.unsaturatedFatContent,
                fiberContent: normalizedData.nutrition.fiberContent,
                cholesterolContent: normalizedData.nutrition.cholesterolContent,
                sugarContent: normalizedData.nutrition.sugarContent,
                sodiumContent: normalizedData.nutrition.sodiumContent,
                servingSize: normalizedData.nutrition.servingSize // assuming servingSize is included in your normalized data
            }, { transaction });
        } else {
            console.log("No nutrition data provided for this recipe.");
        }

        if (commitTransaction) {
            await transaction.commit();
            console.log("Transaction committed successfully.");
            const fullRecipeData = await getFullRecipeByIdService(newRecipe.id);
            console.log("Full recipe data retrieved successfully. Recipe ID:", fullRecipeData.id); // Log the recipe ID specifically
            return fullRecipeData; // This should include the recipe ID
        }

    } catch (error) {
        if (commitTransaction && transaction) {
            await transaction.rollback();
        }
        console.error("Error in createRecipeService:", error);
        throw error;
    }
}


export { createRecipeService };





