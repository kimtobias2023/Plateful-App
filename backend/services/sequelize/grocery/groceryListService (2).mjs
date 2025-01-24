// services/groceryListService.mjs
import { GroceryList, LongShelfLifeItem, GroceryListItem, GroceryItem } from '../../models/groceries/index.mjs';
import { RecipeSection, RecipeIngredient } from '../../models/recipes/index.mjs';
import { fuzzyMatchingUtil } from '../../utils/fuzzyMatchingUtil.mjs';
import { ingredientShelfLifeUtil } from '../../utils/ingredientShelfLifeUtil.mjs';
import { normalizeIngredientName } from '../../utils/normalizeIngredientName.mjs';

async function getOrCreateGroceryItem(itemName) {
    // This method ensures that a GroceryItem is either fetched from the database or created if it doesn't exist
    const [groceryItem, created] = await GroceryItem.findOrCreate({
        where: { name: itemName },
        defaults: { name: itemName } // add other defaults if needed
    });

    return groceryItem;
}

async function createListService(listData) {
    try {
        let aggregatedIngredients = {};

        // Iterate over recipes in listData to get sections and ingredients
        for (const recipeId of listData.recipeIds) {
            const sections = await RecipeSection.findAll({ where: { recipeId } });

            for (const section of sections) {
                const ingredients = await RecipeIngredient.findAll({
                    where: { sectionId: section.id },
                    include: [{
                        model: LongShelfLifeItem,
                        as: 'ShelfLives',
                        through: { attributes: [] }
                    }]
                });

                // ... within your loop for ingredients
                for (const ingredient of ingredients) {
                    const ingredientKey = normalizeIngredientName(ingredient.ingredientName);

                    // Check if ingredient matches a long shelf life item and get its ID
                    const shelfLifeItemId = await fuzzyMatchingUtil(ingredientKey);

                    // Aggregate ingredients
                    if (aggregatedIngredients[ingredientKey]) {
                        // Assuming you want to sum quantities even if they have different units.
                        aggregatedIngredients[ingredientKey].quantity += ingredient.quantity;
                    } else {
                        aggregatedIngredients[ingredientKey] = {
                            name: ingredient.ingredientName,
                            quantity: ingredient.quantity,
                            unit: ingredient.unit, // Include the unit
                            shelfLifeItemId // Store the shelf life item ID if there is a match
                        };
                    }

                    // If a long shelf life item is found, associate it with the ingredient
                    if (shelfLifeItemId !== null) {
                        await ingredientShelfLifeUtil(ingredient.id, shelfLifeItemId);
                    }
                }
            }
        }

        // Create the new GroceryList
        const newList = await GroceryList.create({
            userId: listData.userId
        });

        // Iterate over aggregated ingredients to create GroceryListItems
        for (const ingredientKey in aggregatedIngredients) {
            const ingredient = aggregatedIngredients[ingredientKey];

            // Get or create the GroceryItem
            const groceryItem = await getOrCreateGroceryItem(ingredient.name);

            // Create GroceryListItem
            await GroceryListItem.create({
                groceryListId: newList.id,
                groceryItemId: groceryItem.id,
                quantity: ingredient.quantity,
                unit: ingredient.unit // Make sure this is supported by your model
            });
        }


        // Optionally, if you need to return the GroceryList with its items:
        const populatedList = await GroceryList.findByPk(newList.id, {
            include: [{ model: GroceryListItem, include: [GroceryItem] }]
        });

        return populatedList;
    } catch (error) {
        console.error("Error in createListService:", error);
        throw error;
    }
}


async function checkLongShelfLifeService(ingredientName) {
    try {
        // Normalize the ingredient name for comparison
        const normalizedIngredient = ingredientName.toLowerCase().replace(/[\s\-]/g, '');

        // Check for an exact match in the IngredientShelfLife table
        const exactMatch = await LongShelfLifeItem.findOne({
            where: { longShelfLifeKeyWords: normalizedIngredient }
        });

        if (exactMatch) return true;

        // Perform fuzzy matching if no exact match is found
        return performFuzzyMatchingUtil(normalizedIngredient);
    } catch (error) {
        console.error("Error in checkLongShelfLife:", error);
        throw error;
    }
}

async function getListByIdService(listId) {
    try {
        return await GroceryList.findByPk(listId);
    } catch (error) {
        console.error("Error in getListById:", error);
        throw error;
    }
}

async function getAllListsByUserIdService(userId) {
    try {
        // Fetch only the grocery lists without the GroceryListItem association
        return await GroceryList.findAll({
            where: { userId },
            // Optionally, include other necessary associations here
        });
    } catch (error) {
        console.error("Error in getAllListsByUserId:", error);
        throw error;
    }
}


async function updateListService(listId, updatedData) {
    try {
        const result = await GroceryList.update(updatedData, {
            where: { id: listId }
        });
        if (result[0] === 1) {
            return await GroceryList.findByPk(listId);
        } else {
            throw new Error('Update failed or no matching grocery list found.');
        }
    } catch (error) {
        console.error("Error in updateList:", error);
        throw error;
    }
}

async function deleteListService(listId) {
    try {
        const result = await GroceryList.destroy({
            where: { id: listId }
        });
        return result;  // Returns the number of records deleted (should be 0 or 1)
    } catch (error) {
        console.error("Error in deleteList:", error);
        throw error;
    }
}

export {
    createListService,
    checkLongShelfLifeService,
    getListByIdService,
    getAllListsByUserIdService,
    updateListService,
    deleteListService
};

