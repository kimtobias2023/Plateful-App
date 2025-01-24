import parseIngredient from './parseIngredient.mjs';

function mapJsonLdToInternalStructure(jsonData) {
    console.log(">>> Starting JSON-LD mapping process...");

    // Handle variability in image data
    const getImageUrl = (imageData) => {
        if (Array.isArray(imageData)) {
            // Handling for arrays of image objects or URLs
            const firstImage = imageData[0];
            return typeof firstImage === 'object' ? firstImage.url : firstImage;
        } else if (typeof imageData === 'object' && imageData.url) {
            // Handling for single image object
            return imageData.url;
        }
        // Handling for single image URL
        return imageData;
    };

    // Handle variability in author data
    const getAuthor = (authorData) => {
        if (Array.isArray(authorData)) {
            return authorData.map(author => typeof author === 'object' ? author.name : author).join(', ');
        } else if (typeof authorData === 'object') {
            return authorData.name;
        }
        return authorData;
    };

    let recipeData = {
        title: jsonData.name || '',
        description: jsonData.description || '',
        image: getImageUrl(jsonData.image),
        author: getAuthor(jsonData.author),
        prepTime: jsonData.prepTime || '',
        cookTime: jsonData.cookTime || '',
        totalTime: jsonData.totalTime || '',
        yield: jsonData.recipeYield || '',
        ingredients: jsonData.recipeIngredient ? parseIngredient(jsonData.recipeIngredient) : [],
        instructions: parseInstructions(jsonData.recipeInstructions),
        nutrition: parseNutrition(jsonData.nutrition || {})
    };

    console.log("Mapped Recipe Data:", recipeData);
    return recipeData;
}

function parseInstructions(instructionsData) {
    if (!instructionsData) return [];
    if (Array.isArray(instructionsData)) {
        return instructionsData.flatMap(instruction => {
            if (instruction['@type'] === 'HowToStep') {
                return instruction.text;
            } else if (instruction['@type'] === 'HowToSection' && instruction.itemListElement) {
                return instruction.itemListElement.map(item => item.text || '');
            }
            return [];
        });
    }
    // Handling for single instruction text
    return [instructionsData];
}

function parseNutrition(nutritionData) {
    if (!nutritionData) return {};
    return {
        calories: nutritionData.calories || '',
        proteinContent: nutritionData.proteinContent || '',
        fatContent: nutritionData.fatContent || '',
        carbohydrateContent: nutritionData.carbohydrateContent || '',
        saturatedFatContent: nutritionData.saturatedFatContent || '',
        unsaturatedFatContent: nutritionData.unsaturatedFatContent || '',
        fiberContent: nutritionData.fiberContent || '',
        cholesterolContent: nutritionData.cholesterolContent || '',
        sugarContent: nutritionData.sugarContent || '',
        sodiumContent: nutritionData.sodiumContent || '',
    };
}

export default mapJsonLdToInternalStructure;
