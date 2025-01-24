

const tastyRecipesConfig = {
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
    ingredientSection: '.tasty-recipes-ingredients',
    ingredientHeader: 'div.tasty-recipes-ingredients-header',
    ingredientGroup: 'div.tasty-recipes-ingredients',
    ingredient: 'div.tasty-recipes-ingredients-body',
    quantity: 'span[data-amount]',
    unit: 'span[data-unit]',
    ingredientName: 'strong',
    ingredientNotes: ':not([aria-label])',
    instructionSection: '.tasty-recipes-instructions',
    instructionGroup: 'div.tasty-recipes-instructions',
    instructionHeader: 'div.tasty-recipes-instructions-header',
    instructionList: 'div.tasty-recipes-instructions-body',
    instruction: '#instruction-steps li',
    recipeNotes: '.tasty-recipes-notes-body li',
    nutritionContainer: '.tasty-recipe-nut',

};

export { tastyRecipesConfig };

