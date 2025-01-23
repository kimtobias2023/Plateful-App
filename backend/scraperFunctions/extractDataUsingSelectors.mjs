import cheerio from 'cheerio';
import he from 'he'; // Import the he library

async function extractDataUsingSelectors(htmlContent, config) {
    const $ = cheerio.load(htmlContent);

    const extractText = (selector) => he.decode($(selector).first().text().trim()) || null; // Decode entities in single text
    const extractList = (selector) => $(selector).map((_, el) => he.decode($(el).text().trim())).get(); // Decode entities in list items


    let data = {
        printButtonSelector: extractText(config.printButtonSelector),
        imageUrl: extractText(config.recipeImageUrl),
        title: extractText(config.recipeName),
        description: extractText(config.recipeDescription),
        author: extractText(config.author),
        prepTime: extractText(config.preparationTime),
        cookTime: extractText(config.cookingTime),
        totalTime: extractText(config.totalTime),
        course: extractText(config.course),
        cuisine: extractText(config.cuisine),
        diet: extractText(config.diet),
        servings: extractText(config.servings),
        ingredientSection: extractText(config.ingredientSection),
        ingredientHeaders: extractList(config.ingredientHeader),
        ingredientGroup: extractText(config.ingredientGroup),
        ingredients: extractList(config.ingredients),
        quantity: extractList(config.quantity),
        unit: extractList(config.unit),
        ingredientName: extractList(config.ingredientName),
        ingredientNotes: extractList(config.ingredientNotes),
        instructionSection: extractText(instructionSection),
        instructionGroup: extractText(config.instructionGroup),
        instructionHeader: extractText(config.instructionHeader),
        instructions: extractList(config.instruction),
        recipeNotes: extractText(config.recipeNotes),
        nutritionContainer: extractText(config.nutritionContainer),
        calories: extractText(config.calories),
        proteinContent: extractText(config.proteinContent),
        fatContent: extractText(config.fatContent),
        carbohydrateContent: extractText(config.carbohydrateContent),
        saturatedFatContent: extractText(config.saturatedFatContent),
        unsaturatedFatContent: extractText(config.unsaturatedFatContent),
        fiberContent: extractText(config.fiberContent),
        cholesterolContent: extractText(config.cholesterolContent),
        sugarContent: extractText(config.sugarContent),
        sodiumContent: extractText(config.sodiumContent)
    };

    // Post-processing for nutrition data: Convert to numerical values where applicable
    const nutritionFields = ['calories', 'proteinContent', 'fatContent', 'carbohydrateContent', 'saturatedFatContent', 'unsaturatedFatContent', 'fiberContent', 'cholesterolContent', 'sugarContent', 'sodiumContent'];
    nutritionFields.forEach(field => {
        // Attempt to extract the numerical part of the string
        const valueMatch = data[field]?.match(/[\d\.]+/);
        if (valueMatch) {
            data[field] = parseFloat(valueMatch[0]);
        } else {
            // If no numerical value found, set to null or a default value
            data[field] = null;
        }
    });

    return data;
}

export default extractDataUsingSelectors;

