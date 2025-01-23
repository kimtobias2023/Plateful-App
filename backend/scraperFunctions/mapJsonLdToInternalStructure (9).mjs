
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
        ingredients: recipeData.recipeIngredient || [],
        instructions: mapInstructions(recipeData.recipeInstructions),
        nutrition: recipeData.nutrition || {}
    };

    console.log("Mapped Recipe Data:", JSON.stringify(mappedData, null, 2));
    return mappedData;
}


export default mapJsonLdToInternalStructure;



