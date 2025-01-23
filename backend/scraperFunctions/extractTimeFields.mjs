import cheerio from 'cheerio';

async function extractTimeFields(htmlContent, config, recipeData) {
    const timeFields = ['preparationTime', 'cookingTime', 'totalTime'];

    try {
        const $ = cheerio.load(htmlContent);

        for (const field of timeFields) {
            const selector = config[field];
            if (selector) {
                const timeContent = $(selector).text().trim();
                const match = timeContent.match(/(\d+)\s*(\w+)/);
                if (match) {
                    const [_, duration, unit] = match;
                    recipeData[field] = duration;
                    recipeData[`${field}Unit`] = unit;
                } else {
                    recipeData[field] = null;
                    recipeData[`${field}Unit`] = null;
                }
            } else {
                console.warn(`Selector for time field '${field}' is not defined in the config.`);
                recipeData[field] = null;
                recipeData[`${field}Unit`] = null;
            }
        }
    } catch (error) {
        console.error('Error extracting time fields:', error);
    }
}

export default extractTimeFields;