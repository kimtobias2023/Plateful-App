import cheerio from 'cheerio';

/**
 * Extracts ingredients with their headers, considering optional garnishes or subheaders.
 * @param {string} htmlContent - The HTML content of the page.
 * @param {string} sectionSelector - CSS selector for the specific section (ingredients or instructions).
 * @param {Array<string>} headerSelectors - Array of CSS selectors for headers within the section.
 * @param {string} listItemSelector - CSS selector for list items under each header.
 * @returns {Array} An array of objects, each containing a header and its associated ingredients.
 */
function extractIngredientHeaders(htmlContent, sectionSelector, headerSelectors, listItemSelector = 'li') {
    const $ = cheerio.load(htmlContent);
    const ingredients = [];
    $(sectionSelector).each((_, elem) => {
        // Traverse through each section to find headers and their list items
        $(elem).children().each((_, child) => {

            const isHeader = $(child).is(headerSelectors.join(', '));
            const isList = $(child).is('ul, ol');

            if (isHeader) {
                const headerText = $(child).text().trim();
                const nextList = $(child).nextAll('ul, ol').first();
                const items = nextList.find(listItemSelector).map((_, item) => $(item).text().trim()).get();

                if (items.length > 0) {
                    // Push the header and its items to the ingredients array
                    ingredients.push({ header: headerText, items });
                }
            } else if (isList && ingredients.length === 0) {
                // Handle case where there's a list without a preceding header
                const items = $(child).find(listItemSelector).map((_, item) => $(item).text().trim()).get();
                if (items.length > 0) {
                    ingredients.push({ header: 'Ingredients', items }); // Default header for lists without a detected header
                }
            }
        });
    });

    return ingredients;
}

export default extractIngredientHeaders;
