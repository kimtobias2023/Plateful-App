

const tastyRecipesConfigV2 = {
    printButtonSelector: 'a.button.tasty-recipes-print-button',
    recipeImageUrl: 'img[class*="attachment-thumbnail"][class*="size-thumbnail"][class*="wp-image"]',
    recipeName: 'h2.tasty-recipes-title',
    recipeDescription: 'div.tasty-recipes-description-body',
    author: '.tasty-recipes-author-name',
    preparationTime: '.tasty-recipes-prep-time',
    cookingTime: '.tasty-recipes-cook-time',
    totalTime: '.tasty-recipes-total-time',
    course: '.tasty-recipes-category',
    cuisine: '.tasty-recipes-cuisine',
    diet: '.tasty-recipes-diet',
    servings: '.tasty-recipes-yield',
    ingredientGroup: 'div.tasty-recipes-ingredients',
    ingredientHeader: 'div.tasty-recipes-ingredients-header',
    ingredient: 'div.tasty-recipes-ingredients-body',
    quantity: 'span[data-amount]',
    unit: 'span[data-unit]',
    ingredientName: 'strong',
    ingredientNotes: ':not([aria-label])',
    instructionGroup: 'div.tasty-recipes-instructions',
    instructionHeader: 'div.tasty-recipes-instructions-header',
    instruction: '#instruction-steps li',
    instructionList: 'div.tasty-recipes-instructions-body', // Adjust selector accordingly
    recipeNotes: '.tasty-recipes-notes-body li',


};

export { tastyRecipesConfigV2 };

