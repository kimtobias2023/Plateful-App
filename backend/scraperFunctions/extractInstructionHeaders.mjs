import cheerio from 'cheerio';

/**
 * Extracts headers and counts the number of items (ingredients or instructions) under each header,
 * considering potentially nested structures and varied selectors.
 * @param {string} htmlContent - The HTML content of the page.
 * @param {string} sectionSelector - CSS selector for the specific section (ingredients or instructions).
 * @param {Array<string>} headerSelectors - Array of CSS selectors for headers within the section.
 * @param {string} listItemSelector - CSS selector for list items under each header.
 * @returns {Array} An array of objects, each containing a header and the count of items under it.
 */
function extractSectionHeaders(htmlContent, sectionSelector, headerSelectors = ['h2', 'h3', 'h4'], listItemSelector = 'li') {
    const $ = cheerio.load(htmlContent);
    const results = [];
    const section = $(sectionSelector);

    // Combine header selectors into a single string
    const headerSelector = headerSelectors.join(', ');

    section.find(headerSelector).each((index, header) => {
        const headerText = $(header).text().trim();

        // Find the closest following sibling that matches a container of list items (ul or ol)
        let list = $(header).nextAll('ul, ol').first();
        const count = list.find(listItemSelector).length;

        // Only add to results if there are items found under the header
        if (count > 0) {
            results.push({ header: headerText, count });
        }
    });

    return results;
}

export default extractSectionHeaders;



