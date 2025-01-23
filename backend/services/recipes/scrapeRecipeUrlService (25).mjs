
import sequelize from '../../config/sequelize-instance.mjs';
import puppeteer from 'puppeteer';
import { createRecipeService } from './createRecipeService.mjs';
import url from 'url';
import {
    recipeSitesConfig,
    extractGeneralFields,
    extractLabels,
    extractImageURL,
    extractTimeFields,
    processIngredientSections,
    processInstructionSections,
    extractRecipeNotes,
    mapJsonLdToInternalStructure,
    extractMicroData,
    extractDataUsingSelectors
} from '../../scraperFunctions/index.mjs';

// Function to process labels
const processLabels = async (page, config, recipeData) => {
    try {
        const htmlContent = await page.content();
        const { courseLabel, cuisineLabel } = extractLabels(htmlContent, config);

        if (courseLabel) {
            console.log('Course label:', courseLabel);
            recipeData.labels.push({ labelName: courseLabel, labelType: 'course' });
        }

        if (cuisineLabel) {
            console.log('Cuisine label:', cuisineLabel);
            recipeData.labels.push({ labelName: cuisineLabel, labelType: 'cuisine' });
        }
    } catch (error) {
        console.error('Error processing labels:', error);
    }
};

import cheerio from 'cheerio';

async function extractStructuredData(htmlContent) {
    const $ = cheerio.load(htmlContent);

    // Extract and log JSON-LD data
    const jsonLdScriptTags = $('script[type="application/ld+json"]');
    jsonLdScriptTags.each((index, element) => {
        try {
            const jsonLdData = JSON.parse($(element).html());
            console.log("Extracted JSON-LD Data:", jsonLdData);

            // Handle direct Recipe objects
            if (jsonLdData['@type'] === 'Recipe') {
                return mapJsonLdToInternalStructure(jsonLdData);
            }

            // Handle nested JSON-LD within @graph
            if (jsonLdData['@graph']) {
                const recipeData = jsonLdData['@graph'].find(item => item['@type'] === 'Recipe');
                if (recipeData) {
                    return mapJsonLdToInternalStructure(recipeData);
                }
            }
        } catch (e) {
            console.error("Error parsing JSON-LD", e);
        }
    });

    return recipeDataFound;
}
export default extractStructuredData;



// Function to check if a URL is valid
function isValidUrl(str) {
    // Parse the URL using the 'url' module
    const parsedUrl = url.parse(str);

    // Check if the protocol (e.g., http, https) and hostname are present
    return !!parsedUrl.protocol && !!parsedUrl.hostname;
}

function truncateWebsiteUrl(originalUrl) {
    const trimmedUrl = originalUrl.trim();
    const domainIndex = trimmedUrl.indexOf('.com/');
    if (domainIndex !== -1) {
        return trimmedUrl.substring(0, domainIndex + 5); // Adding 5 to include '.com/'
    } else {
        return trimmedUrl;
    }
}

async function scrapeUsingFallbackMethods(page, originalUrl, config) {
    // Assuming extractImageURL, processLabels, extractGeneralFields, extractTimeFields, processIngredientSections, processInstructionSections, and extractRecipeNotes
    // are adjusted to work directly with the `page` object or with `htmlContent` as needed.

    const htmlContent = await page.content();

    // Attempt to extract the recipe image URL
    const recipeImageUrl = await extractImageURL(htmlContent, config);
    if (!recipeImageUrl || !isValidUrl(recipeImageUrl)) {
        console.warn('Invalid or empty recipe image URL. Continuing without it.');
    }

    // Extract the truncated website URL based on the original URL
    const truncatedWebsiteUrl = truncateWebsiteUrl(originalUrl);

    // Initialize the recipe data structure
    let recipeData = {
        sections: [],
        recipeImageUrl: recipeImageUrl || '', // Use an empty string if the URL is invalid
        websiteUrl: truncatedWebsiteUrl,
        recipeLink: originalUrl,
        recipeNotes: [],
        labels: []
    };

    // Process additional data using the available content and configurations
    // Note: If these functions require the Puppeteer `page` object or modifications to work with static HTML content, ensure they're adjusted accordingly.
    await processLabels(page, config, recipeData);
    await extractGeneralFields(htmlContent, config, recipeData);
    await extractTimeFields(htmlContent, config, recipeData);
    await processIngredientSections(htmlContent, config, recipeData);
    await processInstructionSections(htmlContent, config, recipeData);

    // Extract recipe notes if available
    const recipeNotes = await extractRecipeNotes(htmlContent, config);
    if (recipeNotes && recipeNotes.length > 0) {
        console.log('Recipe Notes:', recipeNotes);
        recipeData.recipeNotes = recipeNotes;
    }

    return recipeData;
}

const navigateToPrintPage = async (page, config) => {
    if (!config || !config.printButtonSelector) {
        console.error('Invalid config passed to navigateToPrintPage');
        return false;
    }

    try {
        await page.waitForSelector(config.printButtonSelector, { timeout: 5000 });

        const newPagePromise = new Promise(resolve => page.once('popup', resolve));

        await page.click(config.printButtonSelector);

        const newPage = await newPagePromise;
        await newPage.waitForNavigation({ waitUntil: 'networkidle2' }).catch(e => console.log("Navigation to new tab completed with timeout or other navigation issue.", e));

        console.log('New tab with print page is open');
        return true;
    } catch (error) {
        console.error('Error navigating to print page:', error);
        return false;
    }
};

async function setupRequestInterception(page) {
    await page.setRequestInterception(true);
    page.on('request', req => {
        const url = req.url();
        const blockDomains = ['doubleclick.net', 'googlesyndication.com'];
        const blockTypes = ['image', 'stylesheet', 'font'];

        if (blockTypes.includes(req.resourceType()) || blockDomains.some(domain => url.includes(domain))) {
            req.abort();
        } else {
            req.continue();
        }
    });
}


function normalizeHostname(url) {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, ''); // Removes 'www.' if present
}


// Define the scrapeRecipeUrlService function
const scrapeRecipeUrlService = async (originalUrl, userId) => {
    let browser;
    try {
        if (userId === undefined) {
            throw new Error('userId is undefined');
        }

        // Corrected: Remove the second declaration of `config`
        const hostname = normalizeHostname(originalUrl);
        let config = recipeSitesConfig[hostname]; // Use `let` if you plan to reassign `config`, otherwise `const` is fine here if `config` will not be reassigned
        if (!config) {
            throw new Error(`No configuration found for URL: ${originalUrl}`);
        }

        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await setupRequestInterception(page);
        await page.goto(originalUrl, { waitUntil: 'networkidle0' }); // Ensures page is fully loaded
        console.log('Page fully loaded, attempting to extract JSON-LD structured data...');

        // Fetch the HTML content after the page is fully loaded
        const htmlContent = await page.content();

        // Attempt structured data extraction (JSON-LD) with the HTML content
        let recipeData = await extractStructuredData(htmlContent);

        // If JSON-LD extraction was unsuccessful, attempt microdata extraction
        if (!recipeData || Object.keys(recipeData).length === 0) {
            recipeData = await extractMicroData(htmlContent) || recipeData;
        }

        console.log('JSON-LD data not found or incomplete, attempting microdata extraction...');

        // Fallback to selectors if both structured data and microdata extraction are unsuccessful
        if (!recipeData || Object.keys(recipeData).length === 0) {
            recipeData = await extractDataUsingSelectors(htmlContent, config); // Assuming extractDataUsingSelectors can handle HTML content directly
        }

        console.log('Attempting navigation to print page for better data extraction...');

        // Further fallback to print page if necessary
        if (!recipeData || Object.keys(recipeData).length === 0 && config.printButtonSelector) {
            const printPageSuccess = await navigateToPrintPage(page, config);
            if (printPageSuccess) {
                const htmlContent = await page.content();
                recipeData = await extractMicroData(htmlContent) || await extractDataUsingSelectors(page, config) || recipeData;
            }
        }

        console.log('Scraped recipe data:', JSON.stringify(recipeData, null, 2));
        return recipeData;

    } catch (error) {
        console.error("Error scraping recipe:", error);
        throw new Error('Failed to scrape the recipe');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

export { scrapeRecipeUrlService };



