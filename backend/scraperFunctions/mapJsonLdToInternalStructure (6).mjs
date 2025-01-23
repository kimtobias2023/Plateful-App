
function mapJsonLdToInternalStructure(jsonData) {
    console.log(">>> Starting JSON-LD mapping process...");

    const recipeData = Array.isArray(jsonData) ? jsonData[0] : jsonData;
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

    const mappedData = {
        title: recipeData.name || 'No title provided',
        description: recipeData.description || 'No description provided',
        image: getImageUrl(recipeData),
        author: getAuthor(jsonData.author),
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



