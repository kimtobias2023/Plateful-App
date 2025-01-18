// validateRecipeData.mjs
export const validateRecipeData = (data) => {
    let errors = {};

    // Validate recipe name
    if (!data.recipeName || data.recipeName.trim() === '' || data.recipeName.length > 255) {
        errors.recipeName = 'Recipe name is required and must be less than 255 characters.';
    }

    // Validate servings
    if (!Number.isInteger(data.servings) || data.servings <= 0) {
        errors.servings = 'Servings must be a positive integer.';
    }

    // Validate author name
    if (data.author && data.author.length > 255) {
        errors.author = 'Author name must be less than 255 characters.';
    }

    // Validate section name
    if (!data.sectionName || data.sectionName.trim() === '' || data.sectionName.length > 255) {
        errors.sectionName = 'Section name is required and must be less than 255 characters.';
    }

    // Validate ingredients
    data.RecipeSections.forEach((section, sectionIndex) => {
        section.RecipeSectionIngredients.forEach((ingredient, ingredientIndex) => {
            // Validate quantity
            if (ingredient.quantity !== null && (!/^\d*\.?\d*$/.test(ingredient.quantity) || parseFloat(ingredient.quantity) <= 0)) {
                errors[`quantity_${sectionIndex}_${ingredientIndex}`] = 'Quantity must be a positive number.';
            }

            // Validate unit
            if (ingredient.quantity && !ingredient.unit) {
                errors[`unit_${sectionIndex}_${ingredientIndex}`] = 'Unit is required when a quantity is provided.';
            }

            // Validate ingredient name
            if ((!ingredient.ingredientName || ingredient.ingredientName.trim() === '') && (ingredient.quantity || ingredient.unit)) {
                errors[`ingredientName_${sectionIndex}_${ingredientIndex}`] = 'Ingredient name is required when a quantity or unit is provided.';
            } else if (ingredient.ingredientName && ingredient.ingredientName.length > 255) {
                errors[`ingredientName_${sectionIndex}_${ingredientIndex}`] = 'Ingredient name must be less than 255 characters.';
            }
        });
    });

    return errors;
};

export default validateRecipeData;
