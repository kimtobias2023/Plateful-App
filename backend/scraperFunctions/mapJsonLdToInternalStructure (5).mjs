
function mapJsonLdToInternalStructure(jsonData) {
    console.log(">>> Starting JSON-LD mapping process...");

    // Check if jsonData is an array and take the first element if it is
    const recipeData = Array.isArray(jsonData) ? jsonData[0] : jsonData;

    const mappedData = {
        title: recipeData.name || 'No title provided',
        description: recipeData.description || 'No description provided',
        imageUrl: recipeData.image?.url || 'No image provided',
        author: recipeData.author?.[0]?.name || 'Unknown author',
        prepTime: recipeData.prepTime || 'No prep time provided',
        cookTime: recipeData.cookTime || 'No cook time provided',
        totalTime: recipeData.totalTime || 'No total time provided',
        yield: recipeData.recipeYield || 'No yield provided',
        course: recipeData.recipeCategory || 'No course provided',
        cuisine: recipeData.recipeCuisine || 'No cuisine provided',
        ingredients: recipeData.recipeIngredient || [],
        instructions: recipeData.recipeInstructions?.map(inst => typeof inst === 'object' ? inst.text : inst) || [],
        nutrition: recipeData.nutrition || {}
    };

    console.log("Mapped Recipe Data:", JSON.stringify(mappedData, null, 2));
    return mappedData;
}


export default mapJsonLdToInternalStructure;

function parseInstructions(instructionsData) {
    // Handling for undefined instructions data
    if (!instructionsData) return [];

    // If instructionsData is an array of objects (common case)
    if (Array.isArray(instructionsData)) {
        return instructionsData.flatMap(instruction => {
            // If instruction is a HowToStep with text
            if (instruction['@type'] === 'HowToStep' && instruction.text) {
                return instruction.text;
            }
            // If instruction is a HowToSection with itemListElement
            else if (instruction['@type'] === 'HowToSection' && instruction.itemListElement) {
                return instruction.itemListElement.flatMap(item => {
                    // Each item can be a HowToStep or another HowToSection
                    if (item['@type'] === 'HowToStep' && item.text) return item.text;
                    if (item['@type'] === 'HowToSection' && item.itemListElement) {
                        // Recursively handle nested sections
                        return parseInstructions(item.itemListElement);
                    }
                    return [];
                });
            }
            return [];
        });
    }
    // Handling single string instruction or single step not in an array
    else if (typeof instructionsData === 'object' && instructionsData.text) {
        return [instructionsData.text];
    }
    // Fallback for any other formats not accounted for
    return [];
}


const mapNutrition = (nutritionData) => {
    if (!nutritionData || typeof nutritionData !== 'object') {
        return {};
    }
    return {
        calories: nutritionData?.calories || 'No calories provided',
        proteinContent: nutritionData?.proteinContent || 'No protein content provided',
        fatContent: nutritionData?.fatContent || 'No fat content provided',
        carbohydrateContent: nutritionData?.carbohydrateContent || 'No carbohydrate content provided',
        saturatedFatContent: nutritionData?.saturatedFatContent || 'No saturated fat content provided',
        unsaturatedFatContent: nutritionData?.unsaturatedFatContent || 'No unsaturated fat content provided',
        fiberContent: nutritionData?.fiberContent || 'No fiber content provided',
        cholesterolContent: nutritionData?.cholesterolContent || 'No cholesterol content provided',
        sugarContent: nutritionData?.sugarContent || 'No sugar content provided',
        sodiumContent: nutritionData?.sodiumContent || 'No sodium content provided',
    };
}


