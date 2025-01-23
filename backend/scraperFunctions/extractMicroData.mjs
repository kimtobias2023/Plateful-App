import cheerio from 'cheerio';


async function extractMicroData(htmlContent) {
    const $ = cheerio.load(htmlContent);
    let recipe = {};

    // Extracting the primary Recipe schema
    const recipeSchema = $('*[itemtype="http://schema.org/Recipe"]').first();

    // Basic recipe information
    recipe.title = recipeSchema.find('*[itemprop="name"]').text().trim();
    recipe.description = recipeSchema.find('*[itemprop="description"]').text().trim();
    recipe.image = recipeSchema.find('*[itemprop="image"]').attr('src');
    recipe.author = recipeSchema.find('*[itemprop="author"]').text().trim() || recipeSchema.find('*[itemprop="author"] *[itemprop="name"]').text().trim();
    recipe.prepTime = recipeSchema.find('*[itemprop="prepTime"]').text().trim();
    recipe.cookTime = recipeSchema.find('*[itemprop="cookTime"]').text().trim();
    recipe.totalTime = recipeSchema.find('*[itemprop="totalTime"]').text().trim();
    recipe.yield = recipeSchema.find('*[itemprop="recipeYield"]').text().trim();

    // Extracting raw ingredients array
    recipe.ingredients = recipeSchema.find('*[itemprop="recipeIngredient"]').map((_, el) => $(el).text().trim()).get();

    // Extracting raw instructions array
    const instructionsEl = recipeSchema.find('*[itemprop="recipeInstructions"]');
    recipe.instructions = instructionsEl.map((i, el) => $(el).text().trim()).get();

    // Nutrition information (optional)
    const nutritionSchema = recipeSchema.find('*[itemtype="http://schema.org/NutritionInformation"]');
    if (nutritionSchema.length) {
        recipe.nutrition = {
            calories: nutritionSchema.find('*[itemprop="calories"]').text().trim(),
            proteinContent: nutritionSchema.find('*[itemprop="proteinContent"]').text().trim(),
            fatContent: nutritionSchema.find('*[itemprop="fatContent"]').text().trim(),
            carbohydrateContent: nutritionSchema.find('*[itemprop="carbohydrateContent"]').text().trim(),
            saturatedFatContent: nutritionSchema.find('*[itemprop="saturatedFatContent"]').text().trim(),
            unsaturatedFatContent: nutritionSchema.find('*[itemprop="unsaturatedFatContent"]').text().trim(),
            fiberContent: nutritionSchema.find('*[itemprop="fiberContent"]').text().trim(),
            cholesterolContent: nutritionSchema.find('*[itemprop="cholesterolContent"]').text().trim(),
            sugarContent: nutritionSchema.find('*[itemprop="sugarContent"]').text().trim(),
            sodiumContent: nutritionSchema.find('*[itemprop="sodiumContent"]').text().trim(),
        };
    }

    return Object.keys(recipe).length > 0 ? recipe : null; // Return the recipe object or null if not found
}

export default extractMicroData;
