
const mntlConfig = {
    printButtonSelector: 'form.mntl-print-button button.mntl-print-button__btn',
    recipeImageUrl: 'img[data-src]',
    recipeName: 'h1.article-heading',
    recipeDescription: 'p.article-subheading',
    author: 'span.mntl-attribution__item-name',
    preparationTime: 'div.mntl-recipe-details__label:contains("Prep Time:") + div.mntl-reicpe-details__value',
    cookingTime: 'div.mntl-recipe-details__label:contains("Cook Time:") + div.mntl-recipe-details__value',
    totalTime: 'div.mntl-recipe-details__label:contains("Total Time:") + div.mntl-recipe-details__value',
    course: null,
    cuisine: null,
    servings: 'div.mntl-recipe-details__label:contains("Servings:") + div.mntl-recipe-details__value',
    ingredientSectionName: 'div.mntl-structured-ingredients',
    ingredientHeader: 'h2.mntl-structured-ingredients__heading',
    ingredients: 'ul.mntl-structured-ingredients__list',
    quantity: 'span[data-ingredient-quantity="true"]',
    unit: 'span[data-ingredient-unit="true"]',
    ingredientName: 'span[data-ingredient-name="true"]',
    ingredientNotes: 'li.mntl-structured-ingredients__list-item:not([aria-label])',
    instructionGroup: 'div.recipe__steps',
    instructionHeader: 'h2.recipe__steps-heading',
    instruction: 'ol.mntl-sc-block-group--OL li.comp.mntl-sc-block-group--LI',
    instructionList: 'ol.mntl-sc-block-group--OL',
    recipeNotes: 'div.allrecipes-sc-block-callout__body p',
};

export { mntlConfig };



