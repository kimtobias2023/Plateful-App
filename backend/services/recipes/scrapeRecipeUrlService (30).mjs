
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
} from '../../scraperFunctions/index.mjs';

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
        'title', 'author', 'image', 'description',
        'prepTime', 'cookTime', 'totalTime', 'ingredients',
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
        await setupRequestInterception(page);
        await page.goto(originalUrl, { waitUntil: 'networkidle0' });

        const htmlContent = await page.content();
        let recipeData = await extractStructuredData(htmlContent);

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

            // Log the final extracted data
            if (!recipeData || Object.keys(recipeData).length === 0) {
                console.log('Failed to extract recipe data using all methods.');
            } else {
                console.log('Recipe data successfully extracted using alternative methods.');
                console.log(JSON.stringify(recipeData, null, 2));
            }
        }

        recipeData.userId = userId;

        transaction = await sequelize.transaction();

        // Create a new recipe using the createRecipeService function
        const newRecipe = await createRecipeService(recipeData, userId, transaction);

        console.log('New recipe created:', newRecipe);
        return { ...newRecipe, id: newRecipe.id };

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




