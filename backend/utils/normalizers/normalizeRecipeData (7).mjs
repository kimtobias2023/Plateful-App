import { parseIngredient } from './parseIngredient.mjs';

// Example normalization function for a recipe
function normalizeRecipeData(scrapedData, ingredientHeaders, instructionHeaders, recipeNotes) {

    let normalizedData = {
        recipeName: scrapedData.recipeName || 'Untitled Recipe',
        recipeDescription: scrapedData.recipeDescription || 'No description available',
        imageUrl: scrapedData.imageUrl || 'default-image.jpg',
        author: scrapedData.author || 'Unknown Author',
        preparationTime: 0,
        cookingTime: 0,
        totalTime: 0,
        servings: normalizeServings(scrapedData.yield || scrapedData.servings || "1 serving"),
        nutrition: normalizeNutritionData(scrapedData.nutrition),
        recipeNotes: recipeNotes || []
    };

    normalizedData.preparationTime = convertTimeFormat(scrapedData.preparationTime);
    normalizedData.cookingTime = convertTimeFormat(scrapedData.cookingTime);
    normalizedData.totalTime = convertTimeFormat(scrapedData.totalTime)

    // Normalize ingredients based on the existence of headers
    if (!ingredientHeaders || ingredientHeaders.length === 0 || (ingredientHeaders.length === 1 && ingredientHeaders[0].header.toLowerCase() === 'ingredients')) {
        console.log("Normalizing flat ingredients structure");
        if (scrapedData.ingredients && Array.isArray(scrapedData.ingredients)) {
            normalizedData.ingredients = scrapedData.ingredients.map(ingredients => parseIngredient(ingredients));
        } else {
            console.warn("No ingredients found or ingredients are not in an array format");
            // Handle the case where ingredients are not available as expected
        }

        console.log("Using ingredient sections based on headers");
        // This assumes scrapedData.ingredients is correctly formatted for sections, which might need adjustment
        normalizedData.ingredientSections = normalizeIngredientSections(scrapedData.ingredients, ingredientHeaders);
    }

// Similar logic for instructions as you've defined...


    // Assign ingredients to their respective headers
    normalizedData.ingredientSections = assignItemsToIngredientSections(scrapedData.ingredients, ingredientHeaders);

    // Determine if instructions should be treated as flat based on headers
    const shouldTreatInstructionsAsFlat = instructionHeaders.length === 1 &&
        (instructionHeaders[0].header.toLowerCase() === 'instructions' ||
            instructionHeaders[0].header.toLowerCase() === 'directions');

    if (shouldTreatInstructionsAsFlat || !instructionHeaders || instructionHeaders.length === 0) {
        console.log("Treating instructions as a flat list due to single explicit header or absence of headers");
        normalizedData.instructions = normalizeFlatInstructions(scrapedData.instructions);
    } else {
        console.log("Using instruction sections based on headers");
        normalizedData.instructionSections = normalizeInstructionSections(scrapedData.instructions, instructionHeaders);
    }

    // Check and normalize recipe notes if available
    if (Array.isArray(scrapedData.recipeNotes) && scrapedData.recipeNotes.length > 0) {
        normalizedData.recipeNotes = scrapedData.recipeNotes;
    }

    console.log('normalizedData before return:', normalizedData);
    return normalizedData;
}


//assignItemsToSections only applies to ingredients
function assignItemsToIngredientSections(items, headers) {
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
function normalizeFlatIngredients(ingredients) {
    console.log("normalizeFlatIngredients received ingredients:", JSON.stringify(ingredients, null, 2));
    // Check if the input is an array of strings and parse each string
    if (Array.isArray(ingredients)) {
        const normalized = ingredients.map((ingredient, index) => ({
            ...parseIngredient(ingredient),
            itemOrder: index + 1 // Add an itemOrder if you need to maintain order in a flat list
        }));
        console.log("Normalized ingredients:", JSON.stringify(normalized, null, 2));
        return normalized;
    }
    console.log("Ingredients not in expected format or not an array");
    return [];
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

function normalizeFlatInstructions(instructions) {
    console.log("normalizeFlatInstructions received instructions:", JSON.stringify(instructions, null, 2));

    // Check if the input is structured with an 'items' array and adjust accordingly
    if (Array.isArray(instructions) && instructions.length === 1 && instructions[0].items) {
        console.log("Detected 'items' structure, processing inner array");
        instructions = instructions[0].items; // Adjust to the inner array of instructions
    }

    if (Array.isArray(instructions)) {
        const normalized = instructions.map((step, index) => ({
            stepNumber: index + 1,
            instruction: step.instruction || "Instruction detail unavailable" // Assuming 'instruction' is the correct property
        }));
        console.log("Normalized instructions:", JSON.stringify(normalized, null, 2));
        return normalized;
    }
    console.log("Instructions not in expected format or not an array");
    // Return an empty array if the instructions are not in the expected format or not an array
    return [];
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
                sectionOrder: index + 1
            });
        } else {
            // Handle or log unexpected instruction formats
            console.warn(`Unexpected instruction format encountered for header: ${header.header}`);
        }
    });

    return instructionSections;
}


function normalizeServings(servingsData) {
    // Ensure servingsData is a string; convert array to string if necessary
    if (Array.isArray(servingsData)) {
        servingsData = servingsData.join(' ');
    } else if (typeof servingsData !== 'string') {
        // Handle non-string, non-array input by converting to string
        // This could be extended to handle specific non-string formats as needed
        servingsData = String(servingsData);
    }

    // Extract first integer from the string
    const match = servingsData.match(/\d+/);
    return match ? parseInt(match[0], 10) : 1; // Default to 1 serving if not extractable
}

function convertTimeFormat(timeString) {
    if (!timeString) return 0; // Return 0 minutes if the timeString is not provided

    // Extended regex to capture optional day, hours, and minutes, ignoring years and months
    const regex = /P(?:\d+Y)?(?:\d+M)?(?:\d+D)?T(?:(\d+)H)?(?:(\d+)M)?/;
    const match = timeString.match(regex);

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

