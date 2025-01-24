
import sequelize from '../../../config/sequelize-instance.mjs';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { createRecipeService } from './createRecipeService.mjs';
import { normalizeRecipeData } from '../../../utils/normalizers/index.mjs';
import {
    recipeSitesConfig,
    mapJsonLdToInternalStructure,
    extractMicroData,
    extractDataUsingSelectors,
    extractRecipeNotes,
    extractInstructionHeaders,
    extractNutritionData,
    extractIngredientHeaders
} from '../../scraperFunctions/index.mjs';

function truncateWebsiteUrl(originalUrl) {
    const trimmedUrl = originalUrl.trim();
    const domainIndex = trimmedUrl.indexOf('.com/');
    if (domainIndex !== -1) {
        return trimmedUrl.substring(0, domainIndex + 5); // Adding 5 to include '.com/'
    } else {
        return trimmedUrl;
    }
}
function mapDirectRecipe(jsonData) {
    console.log("Mapping direct Recipe data...");

    // Direct mapping logic here
    return mapJsonLdToInternalStructure(jsonData);
}

function mapGraphRecipe(jsonData) {
    console.log("Mapping Recipe data from @graph structure...");
    // Find the Recipe node within the @graph array
    const recipeNode = jsonData['@graph'].find(node => node['@type'] === 'Recipe');
    if (!recipeNode) {
        console.error("No Recipe type found in @graph.");
        return {}; // Early return if no Recipe type is found
    }
    return mapJsonLdToInternalStructure(recipeNode);
}

function mapComplexJsonLdStructure(jsonData) {
    // This example assumes jsonData is an array or a complex object; adjust logic as needed.
    let recipeNode;
    if (Array.isArray(jsonData)) {
        recipeNode = jsonData.find(item => item['@type'] === 'Recipe' || (Array.isArray(item['@type']) && item['@type'].includes('Recipe')));
    } else if (jsonData['@type'] && Array.isArray(jsonData['@type']) && jsonData['@type'].includes('Recipe')) {
        recipeNode = jsonData;
    }

    // Handle nested @graph structures
    if (!recipeNode && jsonData['@graph']) {
        recipeNode = jsonData['@graph'].find(node => node['@type'] === 'Recipe');
    }

    if (!recipeNode) {
        console.error("No Recipe type found in complex structure.");
        return {}; // Early return if no Recipe type is found
    }
    return mapJsonLdToInternalStructure(recipeNode);
}

function extractStructuredData(htmlContent) {
    const $ = cheerio.load(htmlContent);
    let recipeData = {};

    $('script[type="application/ld+json"]').each((index, element) => {
        if (Object.keys(recipeData).length) return false; // Skip if already found

        try {
            const jsonData = JSON.parse($(element).html());

            if (jsonData['@type'] === 'Recipe') {
                console.log("Found direct Recipe type.");
                recipeData = mapDirectRecipe(jsonData);
            } else if (jsonData['@graph']) {
                console.log("Found @graph structure.");
                recipeData = mapGraphRecipe(jsonData);
            } else if (Array.isArray(jsonData) || jsonData['@type'].includes('Recipe')) {
                console.log("Handling complex or mixed JSON-LD structure.");
                recipeData = mapComplexJsonLdStructure(jsonData);
            } else {
                console.log("Unhandled JSON-LD structure.");
            }
        } catch (e) {
            console.error("Error parsing JSON-LD", e);
        }
    });

    return recipeData;
}



// Helper function to check if the recipe data is complete
function isRecipeDataComplete(recipeData) {
    const essentialFields = [
        'recipeName', 'author', 'imageUrl', 'recipeDescription',
        'preparationTime', 'cookingTime', 'totalTime', 'ingredients',
        'instructions'
    ];

    return essentialFields.every(field => {
        const isComplete = Array.isArray(recipeData[field]) ? recipeData[field].length > 0 : recipeData[field] && recipeData[field].length > 0;
        if (!isComplete) console.log(`Field incomplete: ${field}`);
        return isComplete;
    });
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


const scrapeRecipeUrlService = async (originalUrl, userId) => {
    let browser;
    let transaction;
    try {
        if (userId === undefined) {
            throw new Error('userId is undefined');
        }

        const hostname = normalizeHostname(originalUrl);
        let config = recipeSitesConfig[hostname];
        if (!config) {
            throw new Error(`No configuration found for URL: ${originalUrl}`);
        }

        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
        await page.setJavaScriptEnabled(false);
        await setupRequestInterception(page);
        await page.goto(originalUrl, { waitUntil: 'networkidle0' });

        const htmlContent = await page.content();
        let recipeData = await extractStructuredData(htmlContent);

        if (!Array.isArray(config.ingredientHeader)) {
            config.ingredientHeader = config.ingredientHeader.split(',').map(s => s.trim());
        }

        // Extract ingredient headers and counts
        const ingredientHeaders = extractIngredientHeaders(htmlContent, config.ingredientSection, config.ingredientHeader, 'li');
        console.log("Ingredient headers and counts extracted:", ingredientHeaders);

        // Extract instruction headers and counts
        const instructionHeaders = extractInstructionHeaders(htmlContent, config.instructionGroup, ['h2', 'h3', 'h4'], 'li');
        console.log("Instruction headers and counts extracted:", instructionHeaders);

        console.log("Extracting recipe notes...");
        recipeData.recipeNotes = extractRecipeNotes(htmlContent, config);

        // Log extracted recipe notes
        if (recipeData.recipeNotes && recipeData.recipeNotes.length > 0) {
        } else {
            console.log("No recipe notes found or extracted.");
        }

        // Check if the extracted JSON-LD data contains all required fields
        if (isRecipeDataComplete(recipeData)) {
            console.log('JSON-LD data successfully extracted and complete. No need for further extraction.');
        } else {
            // Proceed with microdata extraction if JSON-LD data is not found or incomplete
            console.log('JSON-LD data not found or incomplete, attempting microdata extraction...');
            let alternativeData = await extractMicroData(htmlContent);

            if (!alternativeData || Object.keys(alternativeData).length === 0) {
                console.log('Microdata extraction unsuccessful, attempting data extraction using selectors...');
                alternativeData = await extractDataUsingSelectors(htmlContent, config);
            }

            // Combine the data if alternative methods were used
            if (alternativeData && Object.keys(alternativeData).length > 0) {
                recipeData = { ...recipeData, ...alternativeData };
            }

            if (recipeData && Object.keys(recipeData).length > 0) {
                console.log('Recipe data successfully extracted. Normalizing data...');

            } else {
                console.log('Recipe data successfully extracted using alternative methods.');
                console.log(JSON.stringify(recipeData, null, 2));
            }
        }

        recipeData.ingredientHeaders = ingredientHeaders;
        recipeData.instructionHeaders = instructionHeaders;

        // Add a condition to check if nutrition data needs to be extracted using selectors
        if (!recipeData.nutrition || Object.keys(recipeData.nutrition).length === 0) {
            console.log('Nutrition data not found or incomplete, attempting data extraction using selectors...');
            const nutritionData = extractNutritionData(htmlContent, config.nutritionContainer);

            if (nutritionData && Object.keys(nutritionData).length > 0) {
                console.log('Nutrition data successfully extracted using selectors.');
                recipeData.nutrition = nutritionData;
            } else {
                console.log('No nutrition data found or extracted using selectors.');
            }
        }

        const truncatedWebsiteUrl = truncateWebsiteUrl(originalUrl); // Use your existing function or logic to truncate URL

        // Assuming 'recipeData' is your object that collects all scraped data
        recipeData.websiteUrl = truncatedWebsiteUrl;
        recipeData.recipeLink = originalUrl;

        const transaction = await sequelize.transaction();
        const normalizedRecipeData = normalizeRecipeData(recipeData, ingredientHeaders, instructionHeaders, recipeData.recipeNotes);
        normalizedRecipeData.userId = userId;

        const newRecipeData = await createRecipeService(normalizedRecipeData, userId, transaction, true); // Ensure to commit the transaction correctly
        console.log('New recipe created:', newRecipeData);
        if (newRecipeData && newRecipeData.id) {
            console.log('Recipe ID:', newRecipeData.id); // Log the recipe ID specifically
        } else {
            console.error('New recipe data is missing ID:', newRecipeData);
        }
        return newRecipeData;

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Error scraping recipe:", error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
};

export { scrapeRecipeUrlService };




