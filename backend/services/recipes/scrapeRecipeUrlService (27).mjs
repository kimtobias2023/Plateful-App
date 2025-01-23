
import sequelize from '../../config/sequelize-instance.mjs';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { createRecipeService } from './createRecipeService.mjs';
import url from 'url';
import {
    recipeSitesConfig,
    extractLabels,
    mapJsonLdToInternalStructure,
    extractMicroData,
    extractDataUsingSelectors,
    parseIngredient,
    parseNutrition
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


async function extractStructuredData(htmlContent) {
    const $ = cheerio.load(htmlContent);
    let recipeData = {}; // Initialize as an empty object to prevent null access errors.

    $('script[type="application/ld+json"]').each((index, element) => {
        if (Object.keys(recipeData).length) return false; // If data has already been found, exit the loop
        try {
            const jsonData = JSON.parse($(element).html());
            console.log("Extracted JSON-LD Data:", JSON.stringify(jsonData, null, 2)); // Stringify for deep object logging

            if (jsonData['@type'] === 'Recipe') {
                recipeData = mapJsonLdToInternalStructure(jsonData);
            } else if (jsonData['@graph']) {
                recipeData = jsonData['@graph'].find(item => item['@type'] === 'Recipe');
                if (recipeData) {
                    recipeData = mapJsonLdToInternalStructure(recipeData);
                }
            }
        } catch (e) {
            console.error("Error parsing JSON-LD", e);
        }
    });

    return recipeData;
}

export default extractStructuredData;


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

        if (!recipeData || Object.keys(recipeData).length === 0) {
            console.log('JSON-LD data not found or incomplete, attempting microdata extraction...');
            recipeData = await extractMicroData(htmlContent) || recipeData;
        } else {
            console.log('JSON-LD data successfully extracted.');
        }


        // Fallback to selectors if both structured data and microdata extraction are unsuccessful
        if (!recipeData || Object.keys(recipeData).length === 0) {
            recipeData = await extractDataUsingSelectors(htmlContent, config); // Assuming extractDataUsingSelectors can handle HTML content directly
        }

        // Further fallback to print page if necessary
        if (!recipeData || Object.keys(recipeData).length === 0 && config.printButtonSelector) {
            console.log('Attempting navigation to print page for better data extraction...');
            const printPageSuccess = await navigateToPrintPage(page, config);
            if (printPageSuccess) {
                const htmlContent = await page.content();
                recipeData = await extractMicroData(htmlContent) || await extractDataUsingSelectors(page, config) || recipeData;
            }
        }

        if (!recipeData || Object.keys(recipeData).length === 0) {
            console.log('Failed to extract recipe data using all methods.');
        } else {
            console.log('Recipe data successfully extracted.');
            console.log(JSON.stringify(recipeData, null, 2))
        }

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



