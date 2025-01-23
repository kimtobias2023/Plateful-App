import { parseIngredient } from './parseIngredient.mjs';

// Example normalization function for a recipe
function normalizeRecipeData(scrapedData) {
    // Initial setup for normalized data object
    let normalizedData = {
        recipeName: scrapedData.recipeName || 'Untitled Recipe',
        recipeDescription: scrapedData.recipeDescription || 'No description available',
        imageUrl: scrapedData.imageUrl || 'default-image.jpg',
        author: scrapedData.author || 'Unknown Author',
        preparationTime: convertTimeFormat(scrapedData.preparationTime),
        cookingTime: convertTimeFormat(scrapedData.cookingTime),
        totalTime: convertTimeFormat(scrapedData.totalTime),
        servings: normalizeServings(scrapedData.yield || scrapedData.servings || "1 serving"),
        ingredients: [], // Placeholder, will be replaced by sections
        instructions: [], // This will be populated by normalizeInstructionSections
        nutrition: normalizeNutritionData(scrapedData.nutrition), 
        ingredientSections: [],
        instructionSections: []
    };

    // Assuming ingredientHeadersAndCounts have been extracted correctly
    if (scrapedData.ingredients && scrapedData.ingredientHeadersAndCounts) {
        normalizedData.ingredientSections = normalizeIngredientSections(scrapedData.ingredients, scrapedData.ingredientHeadersAndCounts);
    } else {
        // Fallback to default section if no headers and counts are provided
        normalizedData.ingredientSections = [{
            ingredientHeader: "",
            ingredients: scrapedData.ingredients.map(ingredient => parseIngredient(ingredient)),
            sectionOrder: 1,
        }];
    }

    // Handle null instructions
    if (scrapedData.instructions && scrapedData.instructions.every(instruction => instruction === null)) {
        // Scenario where instructions are not available; possibly add a default message or handle accordingly
        normalizedData.instructionSections.push({ instructionHeader: "Instructions", instructions: ["Instructions are not available for this recipe."], sectionOrder: 1 });
    } else {
        normalizedData.instructionSections = normalizeInstructionSections(scrapedData.instructions);
    }

    console.log('normalizedData before return:', normalizedData);
    return normalizedData;
}
function normalizeIngredientSections(ingredients, headersAndCounts) {
    let sections = [];
    let currentIndex = 0;

    headersAndCounts.forEach(header => {
        const { header: headerName, count } = header;
        const sectionIngredients = ingredients.slice(currentIndex, currentIndex + count).map(ingredient => parseIngredient(ingredient));
        sections.push({
            ingredientHeader: headerName,
            ingredients: sectionIngredients,
            sectionOrder: sections.length + 1
        });
        currentIndex += count; // Move to the next segment of ingredients
    });

    return sections;
}

function normalizeInstructionSections(instructions) {
    let instructionSections = [];
    let currentSection = { instructionHeader: "", instructions: [], sectionOrder: 1 };

    instructions.forEach((instruction, index) => {
        // Example condition to identify headers - this will vary based on your actual data
        if (instruction.match(/^[A-Z\s]+:$/) || instruction.toUpperCase() === instruction) {
            if (currentSection.instructions.length > 0) {
                // Save the current section before starting a new one
                instructionSections.push(currentSection);
                currentSection = { instructionHeader: "", instructions: [], sectionOrder: instructionSections.length + 1 };
            }
            currentSection.instructionHeader = instruction.replace(/:$/, ''); // Remove colon at the end if present
        } else {
            // Add instruction to the current section
            currentSection.instructions.push({ stepNumber: currentSection.instructions.length + 1, instruction: instruction });
        }
    });

    // Don't forget to add the last section if it has any instructions
    if (currentSection.instructions.length > 0) {
        instructionSections.push(currentSection);
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

