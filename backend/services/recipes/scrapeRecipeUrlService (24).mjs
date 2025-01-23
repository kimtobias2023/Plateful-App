
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
    extractRecipeNotes
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

const navigateToPrintPage = async (page, config) => {
    if (!config || !config.printButtonSelector) {
        console.error('Invalid config passed to navigateToPrintPage');
        return false;
    }

    try {
        await page.waitForSelector(config.printButtonSelector, { timeout: 5000 });

        const [newPage] = await Promise.all([
            new Promise(resolve => page.once('popup', resolve)), // Listen for the new tab
            page.click(config.printButtonSelector), // Click the button to open new tab
        ]);

        // Wait for the new page to load if necessary
        await newPage.waitForNavigation({ waitUntil: 'networkidle0' });
        console.log('New tab with print page is open');

        // Perform your actions on the newPage here

        return true;
    } catch (error) {
        console.error('Error navigating to print page:', error);
        return false;
    }
};


function normalizeHostname(url) {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, ''); // Removes 'www.' if present
}

// Define the scrapeRecipeUrlService function
const scrapeRecipeUrlService = async (originalUrl, userId) => {
    let browser;
    let transaction;
    try {

        if (userId === undefined) {
            throw new Error('userId is undefined');
        }

        const hostname = normalizeHostname(originalUrl);
        const config = recipeSitesConfig[hostname];

        if (!config) {
            throw new Error(`No configuration found for URL: ${originalUrl}`);
        }

        browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on('request', req => {
            const resourcesToBlock = ['image', 'stylesheet', 'font'];
            if (resourcesToBlock.includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto(originalUrl, { waitUntil: 'networkidle0' });

        const onPrintPage = await navigateToPrintPage(page, config);
        if (!onPrintPage) {
            console.log('Print page navigation failed or not available, proceeding with standard page scraping.');
        }

        const htmlContent = await page.content();

        const recipeImageUrl = await extractImageURL(htmlContent, config);
        if (!recipeImageUrl || !isValidUrl(recipeImageUrl)) {
            throw new Error('Invalid or empty recipe image URL');
        }
        console.log(`Extracted recipe image URL: ${recipeImageUrl}`);

        // Extract the truncated websiteUrl based on the recipe name
        const truncatedWebsiteUrl = truncateWebsiteUrl(originalUrl);

        const recipeData = {
            sections: [], // Initialize sections as an empty array
            recipeImageUrl: recipeImageUrl,
            websiteUrl: truncatedWebsiteUrl,
            recipeLink: originalUrl, // Saving the original URL as recipeLink
            recipeNotes: [],
            labels: [] // Initialize labels array
        };


        // After extracting recipe notes
        await processLabels(page, config, recipeData);

        // Dynamically extract specified fields and handle optional time fields
        await extractGeneralFields(htmlContent, config, recipeData);
        await extractTimeFields(htmlContent, config, recipeData);

        // Process distinct ingredient and instruction sections if they exist
        await processIngredientSections(htmlContent, config, recipeData);
        await processInstructionSections(htmlContent, config, recipeData);

        // Extract recipe notes if available
        const recipeNotes = await extractRecipeNotes(htmlContent, config);
        if (recipeNotes && recipeNotes.length > 0) {
            console.log('Recipe Notes:', recipeNotes);
            recipeData.recipeNotes = recipeNotes;
        }

        // Extracted recipe data
        console.log('Scraped recipe data:', JSON.stringify(recipeData, null, 2));

        /*recipeData.userId = userId;

        transaction = await sequelize.transaction();

        // Create a new recipe using the createRecipeService function
        const newRecipe = await createRecipeService(recipeData, userId, transaction);

        console.log('New recipe created:', newRecipe);
        return { ...newRecipe, id: newRecipe.id };*/


         return recipeData;
        
    
    } catch (error) {
        // Rollback the transaction if an error occurs
        if (transaction) {
            await transaction.rollback();
        }
        console.error("Error scraping recipe:", error);
        throw new Error('Failed to scrape the recipe');
    } finally {
        if (browser) {
            console.log('Attempting to close browser...');
            await browser.close().catch(error => console.error("Error closing browser:", error));
            console.log('Browser closed.');
        }
    }
};

export { scrapeRecipeUrlService };


