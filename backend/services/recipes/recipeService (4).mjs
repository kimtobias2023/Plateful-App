import { Sequelize, Op } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';
import Label from '../../models/labels/Label.mjs';
import { Recipe, RecipeIngredientSection, RecipeInstructionSection, RecipeIngredient, RecipeInstruction, RecipeRatingsReview, RecipeLabel, RecipeNote } from '../../models/recipes/index.mjs';
import { CustomError } from '../../utils/errors/index.mjs';
import { User } from '../../models/users/basic-profile/index.mjs'; 



async function addRecipe(recipeData, transaction = null) {
    try {
        const newRecipe = await Recipe.create(recipeData, { transaction });
        return newRecipe;
    } catch (error) {
        console.error("Error in addRecipe:", error);
        throw error;
    }
}

async function getRecipeByIdService(recipeId, transaction = null) {
    try {
        const recipe = await Recipe.findByPk(recipeId, {
            include: [{
                model: User,
                as: 'user', // Use the same alias as defined in the association
                attributes: ['id'] // Fetch only necessary attributes
            }],
            transaction
        });

        if (!recipe) {
            throw new CustomError(404, `Recipe not found with ID: ${recipeId}`);
        }

        return recipe;
    } catch (error) {
        console.error(`Error in getRecipeById for recipe ID ${recipeId}:`, error);
        throw new CustomError(500, 'Failed to retrieve recipe');
    }
}


async function getAllRecipes(transaction = null) {
    try {
        return await Recipe.findAll({ transaction });
    } catch (error) {
        console.error("Error in getAllRecipes:", error);
        throw error;
    }
}

async function updateRecipeService(recipeId, updateData, transaction = null) {
    const t = transaction || await sequelize.transaction();
    try {
        console.log("Update data in service:", JSON.stringify(updateData, null, 2));

        // Validate websiteUrl if present
        if ('websiteUrl' in updateData && updateData.websiteUrl) {
            const urlPattern = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+[/#?]?.*$/;
            if (!urlPattern.test(updateData.websiteUrl)) {
                console.error("Invalid URL format for websiteUrl");
                delete updateData.websiteUrl; // Remove the field
            }
        }

        // Update main recipe (excluding nested associations)
        console.log("Attempting to update the main recipe details for ID:", recipeId);
        const [updateCount, updatedRecipes] = await Recipe.update(updateData, {
            where: { id: recipeId },
            returning: true,
            transaction: t
        });

        if (updateCount === 0) {
            throw new Error('No matching recipe found to update.');
        }


        // Assuming `updateData` contains updated data for RecipeIngredientSections
        if (updateData.RecipeIngredientSections) {
            console.log(`Processing ${updateData.RecipeIngredientSections.length} ingredient sections`);

            // Fetch current sections to identify deletions, correctly using the alias in the include
            const currentSections = await RecipeIngredientSection.findAll({
                where: { recipeId: recipeId },
                include: [{
                    model: RecipeIngredient,
                    as: 'RecipeIngredients' // Correctly specifying the alias as defined in the association
                }],
                transaction: t
            });

            // Identify section IDs from update data for comparison
            const updatedSectionIds = updateData.RecipeIngredientSections.map(section => section.id).filter(id => id);

            // Determine sections to delete (not present in updated data)
            const sectionsToDelete = currentSections.filter(section => !updatedSectionIds.includes(section.id));

            for (const section of sectionsToDelete) {
                console.log(`Deleting ingredient section with ID: ${section.id}`);
                await section.destroy({ transaction: t });
            }

            // Process updated and new sections
            for (const section of updateData.RecipeIngredientSections) {
                let sectionEntity;

                if (section.id) {
                    // Existing section, update it
                    console.log(`Updating existing ingredient section with ID: ${section.id}`);
                    await RecipeIngredientSection.update(section, {
                        where: { id: section.id, recipeId: recipeId },
                        transaction: t
                    });
                    sectionEntity = await RecipeIngredientSection.findByPk(section.id, {
                        include: [{
                            model: RecipeIngredient,
                            as: 'RecipeIngredients'
                        }],
                        transaction: t
                    });
                } else {
                    // New section, create it
                    console.log(`Adding new ingredient section`);
                    sectionEntity = await RecipeIngredientSection.create({ ...section, recipeId: recipeId }, { transaction: t });
                }

                // Assuming section.RecipeIngredients holds updated ingredients
                if (section.RecipeIngredients) {
                    // Determine ingredients to delete (not present in updated data)
                    const updatedIngredientIds = section.RecipeIngredients.map(ingredient => ingredient.id).filter(id => id);
                    const ingredientsToDelete = sectionEntity.RecipeIngredients.filter(ingredient => !updatedIngredientIds.includes(ingredient.id));

                    for (const ingredient of ingredientsToDelete) {
                        console.log(`Deleting ingredient with ID: ${ingredient.id}`);
                        await ingredient.destroy({ transaction: t });
                    }

                    // Update existing ingredients and add new ones
                    for (const ingredient of section.RecipeIngredients) {
                        if (ingredient.id) {
                            // Existing ingredient, update it
                            console.log(`Updating ingredient with ID: ${ingredient.id}`);
                            await RecipeIngredient.update(ingredient, {
                                where: { id: ingredient.id, sectionId: sectionEntity.id },
                                transaction: t
                            });
                        } else {
                            // New ingredient, create it
                            console.log(`Adding new ingredient`);
                            await RecipeIngredient.create({ ...ingredient, sectionId: sectionEntity.id }, { transaction: t });
                        }
                    }
                }
            }
        }


        // Fetch current instruction sections and their instructions, using the correct alias if needed
        const currentInstructionSections = await RecipeInstructionSection.findAll({
            where: { recipeId: recipeId },
            include: [{
                model: RecipeInstruction,
                as: 'RecipeInstructions' // Use the correct alias as defined in your associations
            }],
            transaction: t
        });

        // Identify instruction sections to delete
        const instructionSectionIdsToDelete = currentInstructionSections
            .filter(section => !updateData.RecipeInstructionSections.some(updateSection => updateSection.id === section.id))
            .map(section => section.id);

        // Delete identified instruction sections
        for (const sectionId of instructionSectionIdsToDelete) {
            await RecipeInstructionSection.destroy({ where: { id: sectionId }, transaction: t });
        }

        // Update and add new instruction sections and instructions
        for (const section of updateData.RecipeInstructionSections) {
            let sectionEntity;
            if (section.id) {
                // Update existing instruction section
                await RecipeInstructionSection.update(section, {
                    where: { id: section.id, recipeId: recipeId },
                    transaction: t
                });
                sectionEntity = await RecipeInstructionSection.findByPk(section.id, {
                    include: [{
                        model: RecipeInstruction,
                        as: 'RecipeInstructions'
                    }],
                    transaction: t
                });
            } else {
                // Add new instruction section
                sectionEntity = await RecipeInstructionSection.create({ ...section, recipeId: recipeId }, { transaction: t });
            }

            // Update or create RecipeInstructions
            if (section.RecipeInstructions) {
                // Determine instructions to delete (not present in updated data)
                const updatedInstructionIds = section.RecipeInstructions.map(instruction => instruction.id).filter(id => id);
                const instructionsToDelete = sectionEntity.RecipeInstructions.filter(instruction => !updatedInstructionIds.includes(instruction.id));

                // Delete identified instructions
                for (const instruction of instructionsToDelete) {
                    await RecipeInstruction.destroy({ where: { id: instruction.id }, transaction: t });
                }

                // Update existing instructions and add new ones
                for (const instruction of section.RecipeInstructions) {
                    if (instruction.id) {
                        // Update existing instruction
                        await RecipeInstruction.update(instruction, {
                            where: { id: instruction.id, sectionId: sectionEntity.id },
                            transaction: t
                        });
                    } else {
                        // Add new instruction
                        await RecipeInstruction.create({ ...instruction, sectionId: sectionEntity.id }, { transaction: t });
                    }
                }
            }
        }


        // Assuming updateData might contain a `Notes` array for the recipe
        if (updateData.RecipeNotes && Array.isArray(updateData.RecipeNotes)) {
            // Filter out any notes that might have null or undefined values in the 'note' property
            const filteredNotes = updateData.RecipeNotes.filter(note => note !== null && note.note !== null);

            // Remove all existing notes for the recipe
            await RecipeNote.destroy({
                where: { recipeId: recipeId },
                transaction: t
            });

            // Iterate over filteredNotes instead of updateData.Notes
            for (const noteData of filteredNotes) {
                console.log("Creating note with data:", noteData); // Log the full note object
                if (!noteData.note) {
                    console.warn("Skipping note due to missing content:", noteData);
                    continue; // Skip this note if it lacks content
                }
                await RecipeNote.create({
                    recipeId: recipeId,
                    note: noteData.note,
                }, { transaction: t });
            }
        }

        // Remove the Notes property from updateData to prevent issues when updating the Recipe model directly
        delete updateData.RecipeNotes;


        console.log(`Updating labels for recipe ${recipeId} with:`, updateData.Labels);

        // Updating Labels
        if (updateData.Labels) {
            // Remove all existing label associations for this recipe
            await RecipeLabel.destroy({
                where: { recipeId: recipeId },
                transaction: t
            });

            // Process each label type (diet, cuisine, course)
            for (const [labelType, labelName] of Object.entries(updateData.Labels)) {
                if (labelName) {
                    // Find or create the label based on labelType and labelName
                    const [label] = await Label.findOrCreate({
                        where: { labelType, labelName },
                        defaults: { labelType, labelName },
                        transaction: t
                    });

                    // Associate recipe with this label
                    await RecipeLabel.create({
                        recipeId,
                        labelId: label.id
                    }, { transaction: t });
                } else {
                    // If labelName is null, disassociate any label of this type from the recipe
                    const label = await Label.findOne({
                        where: { labelType },
                        transaction: t
                    });

                    if (label) {
                        await RecipeLabel.destroy({
                            where: { recipeId, labelId: label.id },
                            transaction: t
                        });
                    }
                }
            }
        }

        // After commit, re-fetch the updated recipe with all its associations
        const fullUpdatedRecipe = await getFullRecipeByIdService(recipeId, t);

        await t.commit();
        console.log(`Recipe ${recipeId} updated successfully.`);
        return fullUpdatedRecipe;
    } catch (error) {
        await t.rollback();
        console.error("Error in updateRecipe:", error);
        throw error;
    }
}



async function deleteRecipe(recipeId, transaction = null) {
    try {
        const result = await Recipe.destroy({
            where: { id: recipeId },
            transaction
        });
        return result;  // Returns the number of records deleted (should be 0 or 1)
    } catch (error) {
        console.error("Error in deleteRecipe:", error);
        throw error;
    }
}

async function searchRecipeService(query, filters, transaction = null) {
    try {
        let whereClause = {};
        let include = [];
        let searchConditions = [];

        // Apply search query
        if (query) {
            searchConditions = [
                { recipeName: { [Op.iLike]: `%${query}%` } },
                { recipeDescription: { [Op.iLike]: `%${query}%` } },
                { author: { [Op.iLike]: `%${query}%` } }
            ];
        }

        // Handle label filters
        if (filters.labels && filters.labels.length) {
            const labelConditions = filters.labels.map(labelStr => {
                const [type, name] = labelStr.split(':').map(str => str.trim());
                return {
                    [Op.and]: [
                        { labelType: type },
                        { labelName: name }
                    ]
                };
            });

            include.push({
                model: Label,
                as: 'Labels', // Ensure this alias matches the one used in associations
                through: {
                    model: RecipeLabel, // Specify the join table
                    as: 'RecipeLabel' // Alias for the join table (if used in associations)
                },
                where: { [Op.or]: labelConditions },
                required: true
            });

        }


        console.log("Constructed Include Array:", JSON.stringify(include, null, 2));

        // Combine searchConditions into whereClause
        if (searchConditions.length) {
            whereClause = { [Op.or]: searchConditions };
        }

        console.log("Constructed Where Clause:", JSON.stringify(whereClause, null, 2));

        // Fetch recipes with filters and include JOINs
        const recipes = await Recipe.findAll({
            where: whereClause,
            include: include,
            transaction
        });

        return recipes;
    } catch (error) {
        console.error("Error in searchRecipeService:", error);
        throw error;
    }
}

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
        };
    } catch (error) {
        console.error('getFullRecipeByIdService - Error:', error);
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
    addRecipe,
    getRecipeByIdService,
    getAllRecipes,
    updateRecipeService,
    searchRecipeService,
    deleteRecipe,
    getFullRecipeByIdService,
    submitRatingService
};


