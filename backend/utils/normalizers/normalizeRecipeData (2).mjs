import { parseIngredient } from './parseIngredient.mjs';

// Example normalization function for a recipe
function normalizeRecipeData(scrapedData) {
    // Preliminary checks and setup
    const servingsSource = scrapedData.yield || scrapedData.servings || scrapedData.nutrition?.servingSize || "1";

    // Initialize the normalizedData object
    let normalizedData = {
        recipeName: scrapedData.recipeName || 'Untitled Recipe',
        recipeDescription: scrapedData.recipeDescription || 'No description available',
        imageUrl: scrapedData.imageUrl || 'default-image.jpg',
        author: scrapedData.author || 'Unknown Author',
        preparationTime: convertTimeFormat(scrapedData.preparationTime),
        cookingTime: convertTimeFormat(scrapedData.cookingTime),
        totalTime: convertTimeFormat(scrapedData.totalTime),
        servings: normalizeServings(servingsSource),
        ingredients: [], // This will be populated by normalizeIngredientSections
        instructions: [], // This will be populated by normalizeInstructionSections
        nutrition: normalizeNutritionData(scrapedData.nutrition), // Ensure this function returns the correct structure
    };

    // Normalize ingredients and instructions
    normalizedData.ingredientSections = normalizeIngredientSections(scrapedData.ingredients);
    normalizedData.instructionSections = normalizeInstructionSections(scrapedData.instructions);

    // Log to see the structure before returning
    console.log('normalizedData before return:', normalizedData);

    // Return the normalized data
    return normalizedData;
}


function normalizeIngredientSections(ingredientData) {
    let ingredientSections = [];
    let currentSection = { ingredientHeader: "", ingredients: [] };
    let sectionOrder = 1;

    ingredientData.forEach(ingredientLine => {
        // Assuming headers are denoted in a specific way, e.g., ending with a colon
        if (ingredientLine.endsWith(":")) {
            // Save the current section if it contains ingredients
            if (currentSection.ingredients.length > 0 || currentSection.ingredientHeader) {
                ingredientSections.push({ ...currentSection, sectionOrder });
                sectionOrder++;
            }
            // Start a new section with the new header
            currentSection = { ingredientHeader: ingredientLine.replace(":", ""), ingredients: [] };
        } else {
            // Parse the ingredient line and add to the current section
            const parsedIngredient = parseIngredient(ingredientLine);
            if (parsedIngredient) {
                currentSection.ingredients.push(parsedIngredient);
            }
        }
    });

    // Add the last section if it contains ingredients
    if (currentSection.ingredients.length > 0 || currentSection.ingredientHeader) {
        ingredientSections.push({ ...currentSection, sectionOrder });
    }

    return ingredientSections;
}

function normalizeInstructionSections(instructionData) {
    let instructionSections = [];
    let currentSection = { instructionHeader: "", instructions: [] };
    let sectionOrder = 1;

    instructionData.forEach((instruction, index) => {
        // Assuming headers are denoted in a specific way, e.g., ending with a colon
        if (instruction.endsWith(":")) {
            if (currentSection.instructions.length > 0 || currentSection.instructionHeader) {
                // If there's a current section with content, add it to the sections array
                instructionSections.push({ ...currentSection, sectionOrder });
                sectionOrder++;
            }
            // Start a new section with the new header
            currentSection = { instructionHeader: instruction.replace(":", ""), instructions: [] };
        } else {
            // Add the instruction to the current section as a step
            currentSection.instructions.push({ stepNumber: currentSection.instructions.length + 1, instruction });
        }
    });

    // Add the last section if it contains instructions
    if (currentSection.instructions.length > 0 || currentSection.instructionHeader) {
        instructionSections.push({ ...currentSection, sectionOrder });
    }

    return instructionSections;
}

function normalizeServings(servingsData) {
    // Convert array to string if necessary
    if (Array.isArray(servingsData)) {
        servingsData = servingsData.join(' ');
    }

    // Extract first integer from the string
    const match = servingsData.match(/\d+/);
    return match ? parseInt(match[0], 10) : 1; // Default to 1 serving if not extractable
}

function convertTimeFormat(timeString) {
    if (!timeString) return 0; // Return 0 minutes if the timeString is not provided

    // Use non-capturing groups for 'H' and 'M' and capture only numbers
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
    const match = timeString.match(regex);

    // Ensure the match was successful and the groups exist before parsing
    const hours = match && match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match && match[2] ? parseInt(match[2], 10) : 0;

    return hours * 60 + minutes; // Convert hours to minutes and add to minutes
}

function normalizeNutritionData(nutritionData) {
    if (!nutritionData) {
        return {};
    }

    // Helper function to extract numeric values from strings
    const extractNumericValue = (valueString) => {
        const numericValue = parseFloat(valueString);
        return isNaN(numericValue) ? 0 : numericValue;
    };

    // Helper function to convert to grams if needed (assuming all input is either in grams or milligrams)
    const toGrams = (value, unit) => {
        return unit === 'mg' ? value / 1000 : value;
    };

    // Normalize each nutritional element inside the function
    const normalizedNutrition = {
        calories: extractNumericValue(nutritionData.calories || "0 kcal"),
        carbohydrateContent: toGrams(extractNumericValue(nutritionData.carbohydrateContent || "0 g"), 'g'),
        cholesterolContent: toGrams(extractNumericValue(nutritionData.cholesterolContent || "0 mg"), 'mg'),
        fiberContent: toGrams(extractNumericValue(nutritionData.fiberContent || "0 g"), 'g'),
        proteinContent: toGrams(extractNumericValue(nutritionData.proteinContent || "0 g"), 'g'),
        saturatedFatContent: toGrams(extractNumericValue(nutritionData.saturatedFatContent || "0 g"), 'g'),
        sodiumContent: extractNumericValue(nutritionData.sodiumContent || "0 mg"), // Assuming sodium is already in mg
        sugarContent: toGrams(extractNumericValue(nutritionData.sugarContent || "0 g"), 'g'),
        fatContent: toGrams(extractNumericValue(nutritionData.fatContent || "0 g"), 'g'),
        unsaturatedFatContent: toGrams(extractNumericValue(nutritionData.unsaturatedFatContent || "0 g"), 'g')
    };

    return normalizedNutrition;
}


export { normalizeRecipeData };

