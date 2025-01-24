import {
    tastyRecipesConfig,
    tastyRecipesConfigV2,
    wprmConfig,
}  from './siteConfigs/index.mjs';

const baseRecipeConfig = {
    // Print Button (if available, for navigating to a printer-friendly page)
    printButtonSelector: 'button.print, a.print-button, .print-recipe, a[rel="nofollow"][href*="print"], .recipe-print-link',
    // Recipe Image URL
    recipeImageUrl: [
        '[itemprop="image"], .recipe-image img, .featured-image img, .content-image img, figure img',
        'img.recipe-feature, div.image-container img, .recipe-image-wrapper img' // More variations
    ].join(', '),

    // Recipe Name
    recipeName: [
        'h1[itemprop="name"], h1.recipe-title, .entry-title, .recipe-title h1, .content-title',
        '.recipe-header h1, .post-title, .recipe-name' // Additional variations
    ].join(', '),

    // Recipe Description
    recipeDescription: [
        '[itemprop="description"], .recipe-description, .entry-summary, .recipe-summary, .description',
        'p.description, .recipe-desc, .recipe-intro, .post-summary' // More variations
    ].join(', '),
    // Author
    author: [
        '[itemprop="author"], .recipe-author, .author-name, .recipe-creator, .post-author',
        '.byline-name, .entry-author, .creator' // Including more general author-related selectors
    ].join(', '),
    // Preparation Time variations
    preparationTime: [
        '[itemprop="prepTime"], .prep-time, .recipe-meta-item--prep-time, .time-prep, .cook-time-prep',
        'meta[itemprop="prepTime"], .preparation-time', // Including meta tags for non-visible content
        '.label-prep-time, .prepTime, .recipe-time-prep' // More general selectors
    ].join(', '),

    // Cooking Time variations
    cookingTime: [
        '[itemprop="cookTime"], .cook-time, .recipe-meta-item--cook-time, .time-cook, .cook-time-cook',
        'meta[itemprop="cookTime"], .cooking-time', // Including meta tags for non-visible content
        '.label-cook-time, .cookTime, .recipe-time-cook' // More general selectors
    ].join(', '),

    // Total Time variations
    totalTime: [
        '[itemprop="totalTime"], .total-time, .recipe-meta-item--total-time, .time-total, .cook-time-total',
        'meta[itemprop="totalTime"], .total-time', // Including meta tags for non-visible content
        '.label-total-time, .totalTime, .recipe-time-total' // More general selectors
    ].join(', '),
    // Course variations
    course: [
        '[itemprop="recipeCategory"], .recipe-category, .recipe-meta-item--category, .post-categories li, .recipe-courses',
        'meta[itemprop="recipeCategory"], .course', // Including meta tags in case the content is not directly visible
        '.label-category, .category-title' // More general selectors
    ].join(', '),
    // Cuisine variations
    cuisine: [
        '[itemprop="recipeCuisine"], .recipe-cuisine, .recipe-meta-item--cuisine, .post-tags li, .recipe-cuisines',
        'meta[itemprop="recipeCuisine"], .cuisine', // Including meta tags for non-visible content
        '.label-cuisine, .cuisine-title' // More general selectors
    ].join(', '),
    // Servings variations
    servings: [
        '[itemprop="recipeYield"], .recipe-yield, .recipe-meta-item--servings, .post-yield li, .recipe-servings',
        'meta[itemprop="recipeYield"], .servings', // Including meta tags for non-visible content
        '.label-servings, .servings-title, .yield' // More general selectors
    ].join(', '),
    //Ingredient Section
    ingredientSection: [
        '.ingredients', '.ingredient-list', '#ingredients', 'div.ingredient', 'ul.ingredients-list', 'div.wprm-recipe-ingredients-container', 'div.structured-ingredients, section.section--ingredients', 
        'ol.ingredients-list', '.recipe-ingredients', '.recipeIngredients', 'section.ingredients', '.tasty-recipes-ingredients', // Existing selectors
        '.section-ingredients', 'div.ingredients-body.css-0.eno1xhi4', 'ul.recipe-ingredients',// Added new selector
    ].join(', '),
    // Ingredient Headers (Titles for ingredient sections)
    ingredientHeader: [
        'h4.ingredient-group-name, .ingredients-header, .ingredient-section-header, .ingredients-title, h4.recipe-ingredients-header', 'div.tasty-recipes-ingredients-header', 'h4', 'h3', 'h2',
        '.ingredients h3, .recipe-ingredient-group > h3, .recipePart > h3', 'h4.wprm-recipe-group-name', 'h3.section__title', '.structured-ingredients__list-heading', 'h3.css-fio36n.eno1xhi5', 'li.recipe-section',
    ].join(', '),
    // Ingredient Section Names (Wrappers for groups of ingredients)
    ingredientGroup: [
        '.ingredient-group, .ingredients-section, .recipe-ingredients, .ingredient-list, .recipe-ingredient-group', 'div.tasty-recipes-ingredients', 
        '.ingredients ul, .recipePart > ul, section.ingredients', '.wprm-recipe-ingredient-group', 'li', // Broader matches for list wrappers
    ].join(', '),
    // Ingredients (Individual ingredients within a section)
    ingredient: [
        'li.ingredient-item, .ingredients-list li, .recipe-ingredient, .ingredient, .recipeIngredients li', 'div.tasty-recipes-ingredients-body',
        '.ingredient-group li, .ingredients-section li, .recipe-ingredients li, [itemprop="recipeIngredient"]', 'li.wprm-recipe-ingredient', // Using itemprop for semantic markup
        'div.ingredient, div.ingredient-name', 'li.structured-ingredients__list-item',
    ].join(', '),
    quantity: [
        '.ingredient-quantity, .quantity, [itemprop="recipeIngredient"] span.quantity, .ingredients-list .amount, .recipe-ingredient-quantity',
        'span.ingredient-amount, .ingredient_measure, .recipeIngredientAmount' // Additional patterns observed
    ].join(', '),

    // Unit of measure for each ingredient
    unit: [
        '.ingredient-unit, .unit, [itemprop="recipeIngredient"] span.unit, .ingredients-list .unit, .recipe-ingredient-unit',
        'span.ingredient-measure, .ingredient_unit, .recipeIngredientUnit' // Looking for both explicit and implicit unit indicators
    ].join(', '),

    // Name of the ingredient
    ingredientName: [
        '.ingredient-name, .name, [itemprop="recipeIngredient"] span.name, .ingredients-list .ingredient, .recipe-ingredient-name',
        'span.ingredient-item-name, .ingredient_name, .recipeIngredientName, .ingredients-list .name' // Capturing both the name and potential additional descriptive elements
    ].join(', '),
    // Notes about the ingredient (optional, extra instructions or substitutions)
    ingredientNotes: [
        '.ingredient-notes, .notes, [itemprop="recipeIngredient"] span.notes, .ingredients-list .notes, .recipe-ingredient-notes',
        'span.ingredient-comments, .ingredient_note, .recipeIngredientNotes, .ingredient-instructions' // Including selectors for comments or special instructions associated with ingredients
    ].join(', '),
    instructionSection: [
        '.instructions', '.instruction-list', '#instructions', 'div.instruction', 'ul.instructions-list', '.wprm-recipe-instructions-container', '.tasty-recipes-instructions', '.recipe__steps-content_1-0' ,
        'ol.instructions-list', '.recipe-instructions', '.recipeInstructions', 'section.instructions', 'div.steps', '.step-by-step-instructions', // Descriptive class name for step-by-step instructions
    ].join(', '),
    // Instruction Headers (Titles for instruction sections)
    ingredientHeader: [
        'h4.ingredient-group-name', '.ingredients-header', '.ingredient-section-header',
        '.ingredients-title', 'h4.recipe-ingredients-header', 'div.tasty-recipes-ingredients-header',
        'h4', '.ingredients h3', '.recipe-ingredient-group > h3', '.recipePart > h3',
        'h4.wprm-recipe-group-name', 'h3.section__title', '.structured-ingredients__list-heading'
    ].join(', '),
    // Instruction Section Names (Wrappers for groups of instructions)
    instructionGroup: [
        '.instruction-group, .instructions-section, .recipe-instructions, .directions, .recipe-directions', 'div.tasty-recipes-instructions',
        '.method-section, .steps-section, article.instructions, section.directions', '.wprm-recipe-instruction-group', // Existing selectors
        '.recipe__steps, .recipe__steps-content' // Added new selector
    ].join(', '),
    // Grouped Instructions (Lists of instructions)
    instructionList: [
        'ol.instructions, ul.steps, ol.recipe-steps, ul.directions-list', 'div.tasty-recipes-instructions-body',
        'ol.method-list, ul.step-list, .instructions ol, .directions ol', 'li.wprm-recipe-instruction', // Ordered lists within specific classed sections
    ].join(', '),
    // Individual Instructions (Single steps within a section)
    instruction: [
        '.instruction-text, .steps li, .instructions-list li, .recipe-step, .direction-step', '#instruction-steps li',
        '.method-step, .recipe-instruction, .step-instruction, div.step, p.instruction', '.wprm-recipe-instruction-text', // Divs and paragraphs used in some layouts
    ].join(', '),
    // Recipe Notes (Additional tips, variations, or advisories)
    recipeNotes: [
        '.recipe-notes, [itemprop="notes"], .notes-section, .cooking-notes, .recipe-tips', 'div.wprm-recipe-notes',
        '.directions-notes, .tips-and-tricks, aside.notes, .additional-notes', '.tasty-recipes-notes-body li',
    ].join(', '),
    //Nutrition
    nutritionContainer: [
        // General selectors for sites using Schema.org/Recipe schema
        'div[itemprop="nutrition"], [itemtype*="schema.org/NutritionInformation"]', 'div.mntl-sc-block-universal-callout__body',

        // Common class names and IDs used for nutrition information
        '.nutrition-container, .nutrition-facts, #nutrition, .recipe-nutrition, .nutrition-info',
        '.nutrition-label, .recipe-nutrition__container, .nutrition-information, #nutrition-facts',

        // Specific selectors for popular cooking or recipe platforms that might use unique class names
        '.recipe__nutrition, .post-nutrition, .nutritionBlock, .recipeNutrition, .entry-nutrition',
        '.nutrition-summary, .food-nutrition, .nutrition-content, .nutritional-info',

        // More variations
        'aside.nutrition-details, .recipeNutritionWidget, .nutrition-widget, .nutritional-information',
        '.nutrition-section, .recipebox-nutrition, .nutrition-table, .nutritionLabel, .recipe-nutrition-info',

        // Nested structures, sometimes nutrition is within an aside or a specific section
        'aside .nutrition, section.nutrition, div.nutrition-details, section.nutritional-information',

        // For sites that might include nutrition details directly within an article or post body
        'article .nutrition-info, .post-body .nutrition, .article-content .nutrition-facts',

        // Selectors targeting specifically formatted lists that may contain nutrition facts
        'ul.nutrition-list, ol.nutrition-details, .nutrition-listing, ul.nutrition-facts-list'
    ].join(', '),
    // Calories
    calories: [
        '[itemprop="calories"], .nutrition-calories, .nutrition__label--calories, .recipe-nutrition__calories',
        '.calories, .nutr-calories' // Additional variations
    ].join(', '),

    // Protein Content
    proteinContent: [
        '[itemprop="proteinContent"], .nutrition-protein, .nutrition__label--protein, .recipe-nutrition__protein',
        '.protein, .nutr-protein' // Additional variations
    ].join(', '),

    // Fat Content
    fatContent: [
        '[itemprop="fatContent"], .nutrition-fat, .nutrition__label--fat, .recipe-nutrition__fat',
        '.fat, .nutr-fat' // Additional variations
    ].join(', '),

    // Carbohydrate Content
    carbohydrateContent: [
        '[itemprop="carbohydrateContent"], .nutrition-carbs, .nutrition__label--carbs, .recipe-nutrition__carbs',
        '.carbohydrates, .nutr-carbs' // Additional variations
    ].join(', '),

    // Saturated Fat Content
    saturatedFatContent: [
        '[itemprop="saturatedFatContent"], .nutrition-saturated-fat, .nutrition__label--saturated-fat, .recipe-nutrition__saturated-fat',
        '.saturated-fat, .nutr-sat-fat' // Additional variations
    ].join(', '),

    // Unsaturated Fat Content (Note: This might not be directly available on all sites)
    unsaturatedFatContent: [
        '.nutrition-unsaturated-fat, .nutrition__label--unsaturated-fat, .recipe-nutrition__unsaturated-fat',
        '.unsaturated-fat, .nutr-unsat-fat' // Additional variations
    ].join(', '),

    // Fiber Content
    fiberContent: [
        '[itemprop="fiberContent"], .nutrition-fiber, .nutrition__label--fiber, .recipe-nutrition__fiber',
        '.fiber, .nutr-fiber' // Additional variations
    ].join(', '),

    // Cholesterol Content
    cholesterolContent: [
        '[itemprop="cholesterolContent"], .nutrition-cholesterol, .nutrition__label--cholesterol, .recipe-nutrition__cholesterol',
        '.cholesterol, .nutr-cholesterol' // Additional variations
    ].join(', '),

    // Sugar Content
    sugarContent: [
        '[itemprop="sugarContent"], .nutrition-sugar, .nutrition__label--sugar, .recipe-nutrition__sugar',
        '.sugar, .nutr-sugar' // Additional variations
    ].join(', '),

    // Sodium Content
    sodiumContent: [
        '[itemprop="sodiumContent"], .nutrition-sodium, .nutrition__label--sodium, .recipe-nutrition__sodium',
        '.sodium, .nutr-sodium' // Additional variations
    ].join(', '),
};

function createSiteConfig(overrides) {
    return { ...baseRecipeConfig, ...overrides };
}


const recipeSitesConfig = {
    '1000.menu': createSiteConfig({/* site-specific overrides */ }),
    'allrecipes.com': createSiteConfig({/* site-specific overrides */ }),
    'aniagotuje.pl': createSiteConfig({/* site-specific overrides */ }),
    'bbcgoodfood.com': createSiteConfig({/* site-specific overrides */ }),
    'bonappetit.com': createSiteConfig({/* site-specific overrides */ }),
    'chefkoch.de': createSiteConfig({/* site-specific overrides */ }),
    'cookieandkate.com': createSiteConfig(tastyRecipesConfigV2),
    'cookpad.com': createSiteConfig({/* site-specific overrides */ }),
    'cuisineactuelle.com': createSiteConfig({/* site-specific overrides */ }),
    'cuisineaz.com': createSiteConfig({/* site-specific overrides */ }),
    'delish.com': createSiteConfig({/* site-specific overrides */ }),
    'delishkitchen.tv': createSiteConfig({/* site-specific overrides */ }),
    'eatingwell.com': createSiteConfig({/* site-specific overrides */ }),
    'einfachbacken.de': createSiteConfig({/* site-specific overrides */ }),
    'food.com': createSiteConfig({/* site-specific overrides */ }),
    'foodandwine.com': createSiteConfig({/* site-specific overrides */ }),
    'foodnetwork.com': createSiteConfig({/* site-specific overrides */ }),
    'giallozafferano.it': createSiteConfig({/* site-specific overrides */ }),
    'healthdigest.com': createSiteConfig({/* site-specific overrides */ }),
    'kurashiru.com': createSiteConfig({/* site-specific overrides */ }),
    'lettuceclub.net': createSiteConfig({/* site-specific overrides */ }),
    'loveandlemons.com': createSiteConfig({/* site-specific overrides */ }),
    'macaro-ni.jp': createSiteConfig({/* site-specific overrides */ }),
    'marmiton.org': createSiteConfig({/* site-specific overrides */ }),
    'natashaskitchen.com': createSiteConfig({/* site-specific overrides */ }),
    'nefisyemektarifleri.com': createSiteConfig({/* site-specific overrides */ }),
    'oceans-nadia.com': createSiteConfig({/* site-specific overrides */ }),
    'onceuponachef.com': createSiteConfig({/* site-specific overrides */ }),
    'omnivorescookbook.com': createSiteConfig({/* site-specific overrides */ }),
    'parade.com': createSiteConfig({/* site-specific overrides */ }),
    'recipetineats.com': createSiteConfig({/* site-specific overrides */ }),
    'redhousespice.com': createSiteConfig({/* site-specific overrides */ }),
    'russianfood.com': createSiteConfig({/* site-specific overrides */ }),
    'sallysbakingaddiction.com': createSiteConfig(tastyRecipesConfig),
    'secret-msg.com': createSiteConfig({/* site-specific overrides */ }),
    'seriouseats.com': createSiteConfig({/* site-specific overrides */ }),
    'simplyrecipes.com': createSiteConfig({/* site-specific overrides */ }),
    'sirogohan.com': createSiteConfig({/* site-specific overrides */ }),
    'spendwithpennies.com': createSiteConfig({/* site-specific overrides */ }),
    'tasteofhome.com': createSiteConfig({/* site-specific overrides */ }),
    'tastesbetterfromscratch.com': createSiteConfig({/* site-specific overrides */ }),
    'tastingtable.com': createSiteConfig({/* site-specific overrides */ }),
    'teafortumeric.com': createSiteConfig({/* site-specific overrides */ }),
    'thekitchn.com': createSiteConfig({/* site-specific overrides */ }),
    'themediterraneandish.com': createSiteConfig(wprmConfig),
    'thepioneerwoman.com': createSiteConfig(wprmConfig),
    'thespruceeats.com': createSiteConfig({/* site-specific overrides */ }),
    'vickypham.com': createSiteConfig({/* site-specific overrides */ }),


};

export default recipeSitesConfig;
