import { Sequelize, Op } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';
import Label from '../../models/labels/Label.mjs';
import { Recipe, RecipeIngredientSection, RecipeInstructionSection, RecipeIngredient, RecipeInstruction, RecipeLabel, RecipeNote } from '../../models/recipes/index.mjs';
import { getFullRecipeByIdService } from './getFullRecipeByIdService.mjs';
import convertFractionToDecimal from '../../utils/convertFractionToDecimal.mjs';

async function createRecipeService(recipeData, userId, transaction, commitTransaction = false) {
    try {
        // Create the main recipe
        console.log("Creating main recipe...");
        const newRecipe = await Recipe.create({
            ...recipeData,
            userId: userId,
            RecipeIngredientSections: undefined,
            RecipeInstructionSections: undefined,
        }, { transaction });
        console.log("New recipe created:", newRecipe);


        // Process RecipeIngredientSections if present
        if (recipeData.sections) {
            console.log("Processing RecipeIngredientSections...");
            let ingredientSectionOrder = 1;
            for (const section of recipeData.sections) {
                if (section.ingredients && section.ingredients.length > 0) {
                    // Get the ingredientHeader from the current section
                    const ingredientHeader = section.ingredientHeader;

                    const newIngredientSection = await RecipeIngredientSection.create({
                        ingredientHeader: ingredientHeader,
                        recipeId: newRecipe.id,
                        sectionOrder: ingredientSectionOrder, // Use order based on ingredientHeader
                    }, { transaction });

                    for (const ingredient of section.ingredients) {
                        let quantityDecimal = ingredient.quantity;
                        console.log(`Before conversion - Original quantity: ${quantityDecimal}`);
                        const fractionPattern = /^\s*(\d+)\s+(\d+)\/(\d+)\s*$|^\s*(\d+)\/(\d+)\s*$|^\s*(\d+)\s+(\d+)\/(\d+)\s*$|^\s*(\d+)\s+(\d+)\s*$|^\s*(\d+)(\s*\u00BC|\s*\u00BD|\s*\u00BE|\s*\u2150|\s*\u2151|\s*\u2152|\s*\u2153|\s*\u2154|\s*\u2155|\s*\u2156|\s*\u2157|\s*\u2158|\s*\u2159|\s*\u215A|\s*\u215B|\s*\u215C|\s*\u215D|\s*\u215E)?\s*|^\s*([^\d\s]+)\s*$/u;

                        if (quantityDecimal && fractionPattern.test(quantityDecimal)) {
                            // Convert fraction to decimal
                            quantityDecimal = convertFractionToDecimal(quantityDecimal);
                            console.log(`After conversion - Decimal quantity: ${quantityDecimal}`);
                        } else {
                            console.log(`Quantity not in expected format: ${quantityDecimal}`);
                        }


                        await RecipeIngredient.create({
                            sectionId: newIngredientSection.id,
                            quantity: quantityDecimal,
                            unit: ingredient.unit,
                            ingredientNotes: ingredient.ingredientNotes,
                            ingredientName: ingredient.ingredientName,
                        }, { transaction });
                    }

                    // Increment section order
                    ingredientSectionOrder++;
                }
            }
        }

        // Process RecipeInstructionSections if present
        if (recipeData.sections) {
            console.log("Processing RecipeInstructionSections...");
            let instructionSectionOrder = 1;
            for (const section of recipeData.sections) {
                if (section.instructions && section.instructions.length > 0) {
                    // Get the instructionHeader from the current section
                    const instructionHeader = section.instructionHeader;

                    const newInstructionSection = await RecipeInstructionSection.create({
                        instructionHeader: instructionHeader,
                        recipeId: newRecipe.id,
                        sectionOrder: instructionSectionOrder, // Use order based on instructionHeader
                    }, { transaction });

                    // Initialize step number counter
                    let stepNumber = 1;

                    for (const instruction of section.instructions) {
                        await RecipeInstruction.create({
                            sectionId: newInstructionSection.id,
                            stepNumber: instruction.stepNumber || stepNumber, // Use provided step number or generate one
                            instruction: instruction.instruction,
                        }, { transaction });

                        // Increment step number
                        stepNumber++;
                    }

                    // Increment section order
                    instructionSectionOrder++;
                }
            }
        }

        // Process RecipeNotes if present
        console.log("Processing RecipeNotes...");
        if (recipeData.recipeNotes && recipeData.recipeNotes.length > 0) {
            console.log("RecipeNotes:", recipeData.recipeNotes); // Log the recipe notes data
            // Process and save recipe notes individually
            for (const note of recipeData.recipeNotes) {
                // Ensure that the note is not null before creating the RecipeNote
                if (note !== null) {
                    console.log("Creating RecipeNote with note:", note); // Log the note value
                    // Save each non-null note to the RecipeNotes table
                    await RecipeNote.create({
                        note: note,
                        recipeId: newRecipe.id,
                    }, { transaction });
                } else {
                    console.log("Skipping null note.");
                }
            }
        } else {
            console.log("No recipe notes found or recipeNotes is null.");
        }

        // Process Labels if present
        console.log("Processing Labels...");
        if (recipeData.labels && recipeData.labels.length > 0) {
            console.log("Labels:", recipeData.labels); // Log the labels data
            for (const labelData of recipeData.labels) {
                // Convert labelName to lowercase
                const lowercaseLabelName = labelData.labelName.toLowerCase();

                let label = await Label.findOne({
                    where: { labelName: lowercaseLabelName },
                    transaction,
                });

                if (!label) {
                    label = await Label.create({
                        labelName: lowercaseLabelName,
                        labelType: labelData.labelType,
                    }, { transaction });
                }

                await RecipeLabel.create({
                    recipeId: newRecipe.id,
                    labelId: label.id,
                }, { transaction });
            }
        } else {
            console.log("No labels found or labels is null.");
        }

        if (commitTransaction) {
            console.log("Committing transaction...");
            await transaction.commit();
            console.log("Transaction committed successfully.");
        }

        console.log("Fetching full recipe by ID...");
        // Assuming `getFullRecipeByIdService` does not require a transaction
        const fullRecipeData = await getFullRecipeByIdService(newRecipe.id);
        return fullRecipeData;
    } catch (error) {
        if (commitTransaction && transaction) {
            await transaction.rollback();
        }
        console.error("Error in createRecipeService:", error);
        throw error;
    }
}

export { createRecipeService };





