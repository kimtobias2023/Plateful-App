
function mapJsonLdToInternalStructure(jsonData) {
    console.log(">>> Starting JSON-LD mapping process...");

    const recipeData = Array.isArray(jsonData) ? jsonData[0] : jsonData;

    function mapIngredientsWithSubHeaders(ingredientsList) {
        const parsedIngredients = [];
        let currentHeader = null;
        let currentItems = [];

        ingredientsList.forEach(entry => {
            // Assume 'entry' is a string. Determine if it's a sub-header
            if (entry.match(/^[A-Za-z ]+$/)) { // Simple check: entry is a string without numbers
                if (currentItems.length > 0 && currentHeader !== null) {
                    // Save the current section before starting a new one
                    parsedIngredients.push({ header: currentHeader, items: currentItems });
                    currentItems = [];
                }
                currentHeader = entry; // Start a new header section
            } else {
                // Assume 'entry' is a regular ingredient
                currentItems.push(entry);
            }
        });

        // Don't forget to add the last section
        if (currentHeader !== null) {
            parsedIngredients.push({ header: currentHeader, items: currentItems });
        }

        return parsedIngredients;
    }


    const getImageUrl = (imageData) => {

        // Direct URL string
        if (typeof imageData === 'string') {
            // Additional check to exclude page URLs or known non-image URLs
            if (!imageData.startsWith('http') || imageData.includes('/author/') || likelyPageUrl(imageData)) {
                return 'No image provided';
            }
            return imageData;
        }

        // Handle arrays by looking for the first valid image URL
        if (Array.isArray(imageData)) {
            for (const item of imageData) {
                const url = getImageUrl(item);
                if (url !== 'No image provided') {
                    return url;
                }
            }
        }

        // Object with properties
        else if (imageData && typeof imageData === 'object') {
            // Check for ImageObject type or url properties directly
            if ((imageData['@type'] === 'ImageObject' || imageData.url) && imageData.url.startsWith('http')) {
                return imageData.url;
            }

            // Try common properties that might contain the URL
            const possibleUrlProperties = ['url', 'src', 'link', 'href'];
            for (const prop of possibleUrlProperties) {
                if (imageData[prop] && imageData[prop].startsWith('http')) {
                    return imageData[prop];
                }
            }

            // Recursively search in nested objects for a URL
            for (const key in imageData) {
                if (typeof imageData[key] === 'object') {
                    const nestedUrl = getImageUrl(imageData[key]);
                    if (nestedUrl !== 'No image provided') {
                        return nestedUrl;
                    }
                }
            }
        }

        function likelyPageUrl(url) {
            // Check for absence of file extension typical for images
            if (!url.match(/\.(jpeg|jpg|gif|png|svg)$/i)) {
                // Additional checks for URL segments that typically don't belong to images
                const nonImagePatterns = ['/recipes/', '/cooking/', '/article/', '/how-to/'];
                return nonImagePatterns.some(pattern => url.includes(pattern));
            }
            return false;
        }

        // Fallback if no valid URL is found
        return 'No image provided';
    };


    // Enhanced handling of variability in author data
    const getAuthor = (authorData) => {
        // Directly return string values
        if (typeof authorData === 'string') return authorData;

        // Handle arrays of authors
        if (Array.isArray(authorData)) {
            return authorData.map(author => {
                if (typeof author === 'object' && author.name) return author.name;
                return author.toString(); // Fallback to converting to string if the structure is unexpected
            }).join(', ');
        }

        // Handle object structures
        if (typeof authorData === 'object') {
            if (authorData.name) return authorData.name; // Direct object with name property
            // Handle nested structures (e.g., { person: { name: "Author Name" } })
            for (const key in authorData) {
                if (typeof authorData[key] === 'object' && authorData[key].name) {
                    return authorData[key].name;
                }
            }
        }

        // Fallback for any unhandled formats
        return 'Unknown Author';
    };

    const mapNutrition = (nutritionData) => {
        if (!nutritionData || typeof nutritionData !== 'object') {
            return {};
        }
        // Standardize the extraction of nutritional values, ensuring fallbacks are provided where data is absent.
        const extractNutritionValue = (key) => {
            const value = nutritionData[key];
            if (!value) return 'No data provided';
            // Extract numerical value and unit for a more structured approach
            const match = value.match(/(\d+(\.\d+)?)(\s*[^ ]+)?/); // Match numeric value possibly followed by a unit
            return match ? `${match[1]}${match[3] || ''}`.trim() : 'No data provided';
        };

        return {
            calories: extractNutritionValue('calories'),
            proteinContent: extractNutritionValue('proteinContent'),
            fatContent: extractNutritionValue('fatContent'),
            carbohydrateContent: extractNutritionValue('carbohydrateContent'),
            saturatedFatContent: extractNutritionValue('saturatedFatContent'),
            unsaturatedFatContent: extractNutritionValue('unsaturatedFatContent'), // Note: Not always available
            fiberContent: extractNutritionValue('fiberContent'),
            cholesterolContent: extractNutritionValue('cholesterolContent'),
            sugarContent: extractNutritionValue('sugarContent'),
            sodiumContent: extractNutritionValue('sodiumContent'),
        };
    };

    function mapInstructions(instructions) {
        if (!instructions) return [];

        // Check for a flat list scenario
        if (instructions.length > 0 && instructions[0]['@type'] === 'HowToStep') {
            // Handle as a flat list of steps
            return [{
                header: '', // No specific header for a flat list
                items: instructions.map((step, index) => ({
                    stepNumber: index + 1,
                    instruction: step.text || "Instruction detail unavailable"
                })),
                sectionOrder: 1 // Entire list considered as a single section
            }];
        }

        // Logic for nested structure (HowToSection) or mixed
        return instructions.map((section, index) => {
            if (section['@type'] === 'HowToSection') {
                return {
                    header: section.name,
                    items: section.itemListElement.map((step, stepIndex) => {
                        if (step['@type'] === 'HowToStep') {
                            return {
                                stepNumber: stepIndex + 1,
                                instruction: step.text
                            };
                        }
                        return null; // Handle unexpected formats within itemListElement
                    }).filter(Boolean), // Remove nulls
                    sectionOrder: index + 1
                };
            } else if (section['@type'] === 'HowToStep') {
                // Handling for when the instructions directly include 'HowToStep' outside a 'HowToSection'
                return {
                    header: '', // Empty header for direct steps not within a section
                    items: [{
                        stepNumber: 1, // Only one step, so it's the first
                        instruction: section.text
                    }],
                    sectionOrder: index + 1
                };
            }
            return null; // Handle unexpected formats at the root level
        }).filter(Boolean); // Remove nulls
    }


    const mappedData = {
        recipeName: recipeData.name || 'No title provided',
        recipeDescription: recipeData.description || 'No description provided',
        imageUrl: getImageUrl(recipeData),
        author: getAuthor(recipeData.author),
        preparationTime: recipeData.prepTime || 'No prep time provided',
        cookingTime: recipeData.cookTime || 'No cook time provided',
        totalTime: recipeData.totalTime || 'No total time provided',
        servings: recipeData.recipeYield || 'No yield provided',
        course: recipeData.recipeCategory || 'No course provided',
        cuisine: recipeData.recipeCuisine || 'No cuisine provided',
        diet: recipeData.suitableForDiet || 'No diet provided',
        ingredients: mapIngredientsWithSubHeaders(recipeData.recipeIngredient || []),
        instructions: mapInstructions(recipeData.recipeInstructions),
        nutrition: mapNutrition(recipeData.nutrition)
    };

    console.log("Mapped Recipe Data:", JSON.stringify(mappedData, null, 2));
    return mappedData;
}


export default mapJsonLdToInternalStructure;



