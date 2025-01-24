import { parseIngredient } from './parseIngredient.mjs';
import convertFractionToDecimal from '../convertFractionToDecimal.mjs';
// Example normalization function for a recipe
function normalizeRecipeData(scrapedData, ingredientHeaders, instructionHeaders, recipeNotes) {
    // Define the initial structure of the normalized data
    let normalizedData = {
        recipeLink: scrapedData.recipeLink, 
        websiteUrl: scrapedData.websiteUrl,
        recipeName: scrapedData.recipeName || 'No title available',  
        recipeDescription: scrapedData.recipeDescription || 'No description available',
        imageUrl: scrapedData.imageUrl || 'default-image.jpg',
        author: scrapedData.author || 'Unknown Author',
        preparationTime: parseCookingTime(scrapedData.preparationTime),
        cookingTime: parseCookingTime(scrapedData.cookingTime),
        totalTime: parseCookingTime(scrapedData.totalTime),
        servings: normalizeServings(scrapedData.yield || scrapedData.servings || "1 serving"),
        ingredients: [],
        ingredientSections: normalizeIngredientSections(scrapedData.ingredients || [], ingredientHeaders),
        instructions: shouldTreatInstructionsAsFlat(instructionHeaders) ?
            normalizeFlatInstructions(scrapedData.instructions) :
            [],
        instructionSections: shouldTreatInstructionsAsFlat(instructionHeaders) ?
            [] :
            normalizeInstructionSections(scrapedData.instructions, instructionHeaders),
        recipeNotes: recipeNotes || [],
        nutrition: normalizeNutritionData(scrapedData.nutrition),
        labels: [] // Initialize labels array to store course, cuisine, and diet
    };

    normalizedData.preparationTime = convertTimeFormat(scrapedData.preparationTime);
    normalizedData.cookingTime = convertTimeFormat(scrapedData.cookingTime);
    normalizedData.totalTime = convertTimeFormat(scrapedData.totalTime)

    // Add course, cuisine, and diet to labels if they exist
    addLabel(normalizedData.labels, scrapedData.course, 'course');
    addLabel(normalizedData.labels, scrapedData.cuisine, 'cuisine');
    addLabel(normalizedData.labels, scrapedData.diet, 'diet');
 
    console.log("ingredientHeaders:", JSON.stringify(ingredientHeaders, null, 2));

    normalizedData.ingredientSections = normalizeIngredientSections(scrapedData.ingredients || [], ingredientHeaders);


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
    console.log("normalizedData.ingredientSections:", JSON.stringify(normalizedData.ingredientSections, null, 2));

    return normalizedData;
}

// Helper function to add a label to the labels array if it's available
function addLabel(labelsArray, labelValue, labelType) {
    if (labelValue && labelValue !== `No ${labelType} available`) {
        labelsArray.push({
            labelName: labelValue,
            labelType: labelType
        });
    }
}

// Assuming this function checks if instructions should be treated as flat
function shouldTreatInstructionsAsFlat(instructionHeaders) {
    return instructionHeaders.length === 1 &&
        (instructionHeaders[0].header.toLowerCase() === 'instructions' ||
            instructionHeaders[0].header.toLowerCase() === 'directions');
}

function normalizeIngredientSections(ingredients, ingredientHeaders) {
    const sections = [];

    if (ingredientHeaders && ingredientHeaders.length > 0) {
        // Logic for when ingredientHeaders are provided
        ingredientHeaders.forEach(headerInfo => {
            const { header, items } = headerInfo;
            const sectionIngredients = items.map(ingredientString => {
                const ingredient = parseIngredient(ingredientString);
                if (ingredient && ingredient.quantity) {
                    // Directly using convertFractionToDecimal here for clarity
                    ingredient.quantity = convertFractionToDecimal(ingredient.quantity);
                }
                return ingredient;
            }).filter(item => item !== null);

            sections.push({
                header: header,
                items: sectionIngredients,
                sectionOrder: sections.length + 1
            });
        });
    } else if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
        // Logic for when ingredients are a flat list without headers
        const items = ingredients.map(ingredientString => {
            const ingredient = parseIngredient(ingredientString);
            if (ingredient && ingredient.quantity) {
                ingredient.quantity = convertFractionToDecimal(ingredient.quantity);
            }
            return ingredient;
        }).filter(item => item !== null);

        sections.push({
            header: 'Ingredients',
            items: items,
            sectionOrder: 1
        });
    }

    return sections;
}


function normalizeFlatInstructions(instructions) {

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
        return normalized;
    }
    console.log("Instructions not in expected format or not an array");
    // Return an empty array if the instructions are not in the expected format or not an array
    return [];
}


function normalizeInstructionSections(instructions, instructionHeaders) {
    console.log("Starting to normalize instruction sections with explicit counts.");
    let instructionSections = [];

    // Assuming instructionHeaders are derived directly from JSON-LD and accurately reflect sections
    instructions.forEach((section) => {
        const items = section.items.map((item, index) => ({
            stepNumber: index + 1,
            instruction: item.instruction
        }));

        // If a section is expected to have items but doesn't, add a placeholder
        if (items.length === 0) {
            items.push({
                stepNumber: 1,
                instruction: "No specific steps provided."
            });
        }

        instructionSections.push({
            header: section.header,
            instructions: items,
            sectionOrder: section.sectionOrder
        });

        console.log(`Processed section: ${section.header} with ${items.length} instruction(s).`);
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


function parseCookingTime(timeString) {
    if (!timeString) return 0; // Return 0 if the timeString is not provided

    // First, try to parse ISO 8601 duration format
    const isoRegex = /P(?:\d+Y)?(?:\d+M)?(?:\d+D)?T(?:(\d+)H)?(?:(\d+)M)?/;
    const isoMatch = timeString.match(isoRegex);
    if (isoMatch) {
        const hours = isoMatch[1] ? parseInt(isoMatch[1], 10) * 60 : 0; // Convert hours to minutes
        const minutes = isoMatch[2] ? parseInt(isoMatch[2], 10) : 0;
        return hours + minutes;
    }

    // Regex patterns to match hours and minutes in various human-readable formats
    const hourPatterns = [/(\d+)\s*hours?/, /(\d+)\s*h/];
    const minutePatterns = [/(\d+)\s*minutes?/, /(\d+)\s*min/];

    // Helper function to extract time in minutes from a matched pattern
    const extractTime = (patterns, multiplier) => {
        for (const pattern of patterns) {
            const match = timeString.match(pattern);
            if (match) {
                return parseInt(match[1], 10) * multiplier;
            }
        }
        return 0;
    };

    // Extract hours and minutes and convert to total minutes
    const hoursInMinutes = extractTime(hourPatterns, 60);
    const minutes = extractTime(minutePatterns, 1);

    // Some strings might only contain a number (assumed to be minutes)
    const plainNumber = parseInt(timeString, 10);
    if (!isNaN(plainNumber) && plainNumber > 0) {
        return plainNumber;
    }

    return hoursInMinutes + minutes;
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

