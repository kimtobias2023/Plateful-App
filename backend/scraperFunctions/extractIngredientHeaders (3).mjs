import cheerio from 'cheerio';

/**
 * Extract ingredients with their headers, subheaders, or as a flat list,
 * updating counts and structure based on the specified logic.
 * @param {string} htmlContent - The HTML content of the page.
 * @param {string} sectionSelector - CSS selector for the ingredients section.
 * @param {Array<string>} headerSelectors - CSS selectors for main and sub-headers.
 * @param {string} listItemSelector - CSS selector for list items under each header.
 * @returns {Array} An array of objects, each representing a header (or subheader) and its associated items.
 */
function extractIngredientHeaders(htmlContent, sectionSelector, headerSelectors, listItemSelector = 'li') {
    const $ = cheerio.load(htmlContent);
    const sections = [];
    let currentSection = null;
    let explicitIngredientsHeaderFound = false; // Track if 'Ingredients' header is explicitly found

    $(sectionSelector).each((_, sectionElem) => {
        $(sectionElem).find('*').each((_, elem) => {
            const $elem = $(elem);
            const isHeader = headerSelectors.some(selector => $elem.is(selector));
            const isListItem = $elem.is(listItemSelector);

            if (isHeader) {
                const headerText = $elem.text().trim();

                if (headerText.toLowerCase() === 'ingredients') {
                    explicitIngredientsHeaderFound = true; // Mark that we found an explicit 'Ingredients' header
                }

                // Start a new section for this header
                currentSection = { header: headerText, items: [] };
                sections.push(currentSection);
            } else if (isListItem && currentSection) {
                // Add items to the current section
                currentSection.items.push($elem.text().trim());
            }
        });
    });

    // Check and correct the first section's header if needed
    if (sections.length > 1 && !explicitIngredientsHeaderFound) {
        // If we have more than one section but didn't find an explicit 'Ingredients' header,
        // assume the first section should be named 'Ingredients'
        sections[0].header = 'Ingredients';
    }

    return sections;
}

export default extractIngredientHeaders;










