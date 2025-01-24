

function mapJsonLdToInternalStructure(jsonData) {
    let recipeData = {
        title: jsonData.name || '',
        description: jsonData.description || '',
        // Handle both single and array images
        image: Array.isArray(jsonData.image) ? jsonData.image[0]?.url || jsonData.image[0] : jsonData.image?.url || jsonData.image || '',
        // Handle both single and multiple authors
        author: Array.isArray(jsonData.author) ? jsonData.author.map(author => author.name).join(', ') : jsonData.author?.name || '',
        prepTime: jsonData.prepTime || '',
        cookTime: jsonData.cookTime || '',
        totalTime: jsonData.totalTime || '',
        yield: jsonData.recipeYield || '',
        ingredients: jsonData.recipeIngredient || [],
        instructions: [],
        nutrition: {}
    };

    // Extracting instructions with consideration for nested or simple structures
    if (Array.isArray(jsonData.recipeInstructions)) {
        recipeData.instructions = jsonData.recipeInstructions.flatMap(instruction => {
            if (instruction['@type'] === 'HowToStep') {
                return instruction.text;
            } else if (instruction['@type'] === 'HowToSection' && Array.isArray(instruction.itemListElement)) {
                return instruction.itemListElement.map(item => item.text);
            }
            return [];
        });
    }

    // Optional: Extracting nutrition information
    if (jsonData.nutrition) {
        recipeData.nutrition = {
            calories: jsonData.nutrition.calories || '',
            proteinContent: jsonData.nutrition.proteinContent || '',
            fatContent: jsonData.nutrition.fatContent || '',
            carbohydrateContent: jsonData.nutrition.carbohydrateContent || '',
        };
    }

    return recipeData;
}


export default mapJsonLdToInternalStructure;