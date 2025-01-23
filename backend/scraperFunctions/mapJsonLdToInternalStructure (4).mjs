
function mapJsonLdToInternalStructure(jsonData) {
    console.log(">>> Starting JSON-LD mapping process...");
    console.log(jsonData)

    // Extracting the URL from an image object or direct image URL
    const getImageUrl = (imageData) => {
        if (Array.isArray(imageData)) {
            return imageData[0]?.url || imageData[0];
        } else if (typeof imageData === 'object' && imageData?.url) {
            return imageData.url;
        }
        return 'No image provided';
    };

    // Handling author data which can be an object or an array of objects
    const getAuthor = (authorData) => {
        if (Array.isArray(authorData)) {
            return authorData.map(author => author?.name).join(', ') || 'Unknown author';
        } else if (typeof authorData === 'object' && authorData?.name) {
            return authorData.name;
        }
        return 'Unknown author';
    };

    // Simplifying ingredients and instructions extraction
    const parseIngredient = (ingredients) => ingredients || [];


    let recipeData = {
        title: jsonData?.name || 'No title provided',
        description: jsonData?.description || 'No description provided',
        imageUrl: getImageUrl(jsonData?.image),
        author: getAuthor(jsonData?.author),
        prepTime: jsonData?.prepTime || 'No prep time provided',
        cookTime: jsonData?.cookTime || 'No cook time provided',
        totalTime: jsonData?.totalTime || 'No total time provided',
        yield: jsonData?.recipeYield || 'No yield provided',
        course: jsonData?.recipeCategory ? jsonData.recipeCategory.join(', ') : 'No course provided',
        cuisine: jsonData?.recipeCuisine ? jsonData.recipeCuisine.join(', ') : 'No cuisine provided',
        ingredients: parseIngredient(jsonData?.recipeIngredient),
        instructions: parseInstructions(jsonData?.recipeInstructions),
        nutrition: mapNutrition(jsonData?.nutrition),
    };

    console.log("Mapped Recipe Data:", JSON.stringify(recipeData, null, 2));
    return recipeData;
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


