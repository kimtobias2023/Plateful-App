
function mapJsonLdToInternalStructure(jsonData) {
    console.log(">>> Starting JSON-LD mapping process...");

    const recipeData = Array.isArray(jsonData) ? jsonData[0] : jsonData;
    // Handle variability in image data
    // Enhanced function to handle image extraction more robustly
    const getImageUrl = (imageData) => {
        // Handling when imageData is directly a URL string
        if (typeof imageData === 'string') {
            return imageData;
        }
        // Handling when imageData is an array
        else if (Array.isArray(imageData)) {
            // If the array contains strings, return the first string
            if (typeof imageData[0] === 'string') {
                return imageData[0];
            }
            // If the array contains objects, return the url of the first object
            else if (typeof imageData[0] === 'object' && imageData[0].url) {
                return imageData[0].url;
            }
        }
        // Handling when imageData is an object with a url property
        else if (imageData && typeof imageData === 'object' && imageData.url) {
            return imageData.url;
        }
        // Fallback in case none of the above conditions are met
        return 'No image provided';
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
        author: getAuthor(recipeData.author),
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



