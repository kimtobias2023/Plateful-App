import cheerio from 'cheerio';

// Function to extract general fields using Cheerio
const extractGeneralFields = (htmlContent, config, recipeData) => {
    const $ = cheerio.load(htmlContent);
    const fields = ['recipeName', 'recipeDescription', 'author', 'course', 'cuisine', 'servings'];
    fields.forEach(field => {
        const selector = config[field];
        if (selector) {
            try {
                const fieldValue = $(selector).text().trim();
                recipeData[field] = fieldValue || 'N/A';
            } catch (error) {
                console.warn(`Optional field ${field} not found or error occurred:`, error);
                recipeData[field] = 'N/A';
            }
        } else {
            console.warn(`Selector for optional field ${field} not defined in config.`);
            recipeData[field] = 'N/A';
        }
    });
};

export default extractGeneralFields;






