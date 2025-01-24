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
    let sections = [];
    let subheadersCount = 0;
    let items = [];
    let subheaderItemsCount = {}; // Key: subheader text, Value: item count

    $(sectionSelector).each((_, sectionElem) => {
        $(sectionElem).find('*').each((_, elem) => {
            const $elem = $(elem);
            const isHeader = headerSelectors.some(selector => $elem.is(selector));
            const isListItem = $elem.is(listItemSelector);

            if (isHeader) {
                const headerText = $elem.text().trim();
                // Increment subheader count and prepare to track items for this subheader
                subheadersCount++;
                subheaderItemsCount[headerText] = 0;
                // If items exist before finding a subheader, assume they belong to 'Ingredients'
                if (items.length > 0 && subheadersCount === 1) {
                    sections.push({ header: 'Ingredients', items: [...items] });
                    items = []; // Reset items for next section
                }
            } else if (isListItem) {
                items.push($elem.text().trim());
                if (subheadersCount > 0) {
                    // Track items count for the latest subheader
                    const lastSubheader = Object.keys(subheaderItemsCount).pop();
                    subheaderItemsCount[lastSubheader]++;
                }
            }
        });
    });

    // After collecting all items, distribute them based on subheaders count
    if (subheadersCount === 0) {
        // No subheaders, treat everything as 'Ingredients'
        sections.push({ header: 'Ingredients', items });
    } else if (subheadersCount >= 1) {
        // For subheaders, distribute items to their corresponding sections
        let accumulatedItemsCount = 0;
        Object.entries(subheaderItemsCount).forEach(([header, count], index) => {
            let sectionItems = items.slice(accumulatedItemsCount, accumulatedItemsCount + count);
            accumulatedItemsCount += count;
            sections.push({ header: (index === 0 && sections.length === 0) ? 'Ingredients' : header, items: sectionItems });
        });
    }

    return sections;
}

export default extractIngredientHeaders;












