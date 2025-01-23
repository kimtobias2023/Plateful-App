import { parseIngredient } from './parseIngredient.mjs';

// Example normalization function for a recipe
function normalizeRecipeData(scrapedData, ingredientHeaders, instructionHeaders, recipeNotes) {

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
        instructionSections: [],
        recipeNotes: recipeNotes || []
    };
    // Assuming extractSectionHeaders is successfully extracting headers and counts
    if (scrapedData.ingredientHeaders && Array.isArray(scrapedData.ingredientHeaders)) {
        normalizedData.ingredientSections = normalizeIngredientSections(scrapedData.ingredients, scrapedData.ingredientHeaders);
    }

    if (scrapedData.instructionHeaders && Array.isArray(scrapedData.instructionHeaders)) {
        normalizedData.instructionSections = normalizeInstructionSections(scrapedData.instructions, scrapedData.instructionHeaders);
    }

    // Normalize recipe notes if they are available
    if (scrapedData.recipeNotes && scrapedData.recipeNotes.length > 0) {
        normalizedData.recipeNotes = scrapedData.recipeNotes;
    }
    // Assign ingredients to their respective headers
    normalizedData.ingredientSections = assignItemsToSections(scrapedData.ingredients, ingredientHeaders);


    console.log('normalizedData before return:', normalizedData);
    return normalizedData;
}

// Adjust the `assignItemsToSections` function to handle both ingredients and instructions correctly.
function assignItemsToSections(items, headers) {
    let sections = [];
    let currentIndex = 0;

    headers.forEach(header => {
        const { header: headerTitle, count } = header;
        let sectionItems = items.slice(currentIndex, currentIndex + count);

        sections.push({
            header: headerTitle,
            items: sectionItems,
            sectionOrder: sections.length + 1
        });

        currentIndex += count; // Update currentIndex for the next section
    });

    return sections;
}

function normalizeIngredientSections(ingredients, ingredientHeaders) {
    const sections = [];
    let currentIndex = 0;

    ingredientHeaders.forEach((ingredientHeader) => {
        const { header, count } = ingredientHeader;
        const end = currentIndex + count;
        const sectionIngredients = ingredients.slice(currentIndex, end).map(ingredient => {

            if (typeof ingredient === 'string') {
                return parseIngredient(ingredient);
            } else if (typeof ingredient === 'object' && ingredient !== null) {
                const { quantity, unit, name, notes } = ingredient; // Destructure with default values
                return { quantity: quantity || null, unit: unit || null, name: name || "Unknown Ingredient", notes: notes || null };
            } else {
                console.error("Unsupported ingredient format:", ingredient);
                return null; // Return null to exclude this ingredient
            }
        }).filter(Boolean); // Remove any null entries

        sections.push({
            ingredientHeader: header,
            ingredients: sectionIngredients,
            sectionOrder: sections.length + 1
        });

        currentIndex = end; // Move the index for the next section
    });

    return sections;
}



function normalizeInstructionSections(instructions, instructionHeaders) {
    const instructionSections = [];

    instructionHeaders.forEach((header, index) => {
        const section = instructions.find(section => section.header === header.header);
        if (section && Array.isArray(section.items)) {
            const mappedInstructions = section.items.map((item, stepIndex) => ({
                stepNumber: stepIndex + 1,
                instruction: typeof item === 'string' ? item : item.instruction
            }));

            instructionSections.push({
                header: section.header,
                instructions: mappedInstructions,
                sectionOrder: header.sectionOrder
            });
        } else {
            // Handle or log unexpected instruction formats
            console.warn(`Unexpected instruction format encountered for header: ${header.header}`);
        }
    });

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

