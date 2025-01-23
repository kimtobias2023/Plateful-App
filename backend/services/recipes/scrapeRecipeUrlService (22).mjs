
import sequelize from '../../config/sequelize-instance.mjs';
import puppeteer from 'puppeteer';
import recipeSitesConfig from '../../utils/recipeSitesConfig.mjs';
import { createRecipeService } from './createRecipeService.mjs';
import url from 'url';

const extractLabels = async (page, config) => {
    try {
        const { course, cuisine } = config; // Retrieve course and cuisine selectors from config
        if (!course || !cuisine) {
            console.log('Course or cuisine selectors not found in config. Skipping label extraction.');
            return {};
        }

        // Extract course label
        const courseElement = await page.$(course);
        const courseLabel = courseElement ? await courseElement.evaluate(node => node.textContent.trim()) : null;
        console.log('Extracted course label:', courseLabel);

        // Extract cuisine label
        const cuisineElement = await page.$(cuisine);
        const cuisineLabel = cuisineElement ? await cuisineElement.evaluate(node => node.textContent.trim()) : null;
        console.log('Extracted cuisine label:', cuisineLabel);

        return { courseLabel, cuisineLabel };
    } catch (error) {
        console.error('Error extracting labels:', error);
        return {};
    }
};


async function processLabels(page, config, recipeData) {
    try {
        const { courseLabel, cuisineLabel } = await extractLabels(page, config);

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
}

export { extractLabels, processLabels };




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


async function extractImageURL(page, config) {
    // Directly access 'recipeImageUrl' from 'config' without assuming it's under 'selectors'
    const recipeImageUrl = config.recipeImageUrl;
    if (!recipeImageUrl) {
        console.log("No recipe image URL selector found in config.");
        return ''; // If no selector is provided, return an empty string.
    }

    return await page.evaluate((selector) => {
        const imageElement = document.querySelector(selector);
        // Use the 'data-pin-media' attribute if available for a higher resolution image, or fall back to 'src'
        return imageElement ? (imageElement.getAttribute('data-pin-media') || imageElement.src) : '';
    }, recipeImageUrl);
}


async function extractGeneralFields(page, config, recipeData) {
    const fields = ['recipeName', 'recipeDescription', 'author', 'course', 'cuisine', 'servings', 'recipeNotes'];
    for (let field of fields) {
        const selector = config[field];
        if (selector) {
            try {
                const fieldValue = await page.$eval(selector, el => el?.innerText.trim() || '');
                recipeData[field] = fieldValue;
            } catch (error) {
                console.warn(`Optional field ${field} not found or error occurred:`, error);
                // Check if the field is recipeNotes
                if (field === 'recipeNotes') {
                    recipeData[field] = []; // Assign an empty array for recipeNotes
                } else {
                    recipeData[field] = 'N/A'; // Use 'N/A', an empty string, or any other placeholder for other fields
                }
            }
        } else {
            console.warn(`Selector for optional field ${field} not defined in config.`);
            recipeData[field] = 'N/A'; // Use 'N/A', an empty string, or any other placeholder for missing config selectors
        }
    }
}


async function extractTimeFields(page, config, recipeData) {
    const timeFields = ['preparationTime', 'cookingTime', 'totalTime'];

    for (const field of timeFields) {
        // Using the 'selectors' property from config if available
        const selector = config[field];
        if (selector) {
            try {
                const timeContent = await page.$eval(selector, el => el.innerText.trim());
                const match = timeContent.match(/(\d+)\s*(\w+)/);
                if (match) {
                    const [_, duration, unit] = match; // Ignore the full match using an underscore
                    recipeData[field] = duration;
                    recipeData[`${field}Unit`] = unit;
                } else {
                    // Handle cases where the time content does not match the expected pattern
                    recipeData[field] = null;
                    recipeData[`${field}Unit`] = null;
                }
            } catch (error) {
                // Handle cases where the selector is not found on the page
                console.warn(`Time field '${field}' not found on the page.`);
                recipeData[field] = null;
                recipeData[`${field}Unit`] = null;
            }
        } else {
            // Handle cases where the selector is not defined in the config for a time field
            console.warn(`Selector for time field '${field}' is not defined in the config.`);
            recipeData[field] = null;
            recipeData[`${field}Unit`] = null;
        }
    }
}


async function processIngredientSections(page, config, recipeData) {
    // Assuming config is already the correct configuration object for the specific site
    const ingredientSectionsExist = await page.$(config.ingredientSectionName) !== null;
    if (ingredientSectionsExist) {
        const ingredientSections = await page.$$(config.ingredientSectionName);
        console.log(`Found ${ingredientSections.length} ingredient section(s).`);

        for (const ingredientSection of ingredientSections) {
            let ingredientHeader = "Default Section"; // Fallback if section name is not found
            const sectionExists = await ingredientSection.$(config.ingredientHeader);
            if (sectionExists) {
                ingredientHeader = await ingredientSection.$eval(config.ingredientHeader, el => el.innerText.trim());
            }

            let section = {
                ingredientHeader,
                ingredients: [],
            };

            const ingredientElements = await ingredientSection.$$(config.ingredients);
            for (const element of ingredientElements) {
                const quantity = await element.$eval(config.quantity, el => el.innerText.trim()).catch(() => 'N/A');
                const unit = await element.$eval(config.unit, el => el.innerText.trim()).catch(() => 'N/A');
                const ingredientName = await element.$eval(config.ingredientName, el => el.innerText.trim()).catch(() => 'N/A');
                const ingredientNotes = await element.$eval(config.ingredientNotes, el => el.innerText.trim()).catch(() => '');

                section.ingredients.push({ quantity, unit, ingredientName, ingredientNotes });
            }

            console.log(`Ingredients for section "${ingredientHeader}":`, section.ingredients);

            const existingSectionIndex = recipeData.sections.findIndex(s => s.ingredientHeader === ingredientHeader);
            if (existingSectionIndex === -1) {
                recipeData.sections.push(section);
            } else {
                // Merge or update the ingredients for the existing section
                recipeData.sections[existingSectionIndex].ingredients = [...recipeData.sections[existingSectionIndex].ingredients, ...section.ingredients];
            }
        }
    } else {
        console.log("No distinct ingredient sections found. Proceeding with general extraction.");
    }
}


async function processInstructionSections(page, config, recipeData) {
    const instructionSectionsExist = await page.$(config.instructionSectionName) !== null;
    if (instructionSectionsExist) {
        const instructionSections = await page.$$(config.instructionSectionName);
        console.log(`Found ${instructionSections.length} instruction section(s).`);

        for (const instructionSection of instructionSections) {
            let instructionHeader = "Default Section"; // Fallback if no specific section name is found
            const sectionExists = await instructionSection.$(config.instructionHeader);
            if (sectionExists) {
                instructionHeader = await instructionSection.$eval(config.instructionHeader, el => el.innerText.trim());
            }

            let section = recipeData.sections.find(s => s.instructionHeader === instructionHeader) || {
                instructionHeader,
                instructions: []
            };

            const instructionsElements = await instructionSection.$$(config.instructions);
            for (const element of instructionsElements) {
                const instructionText = await element.$eval(config.instruction, el => el.innerText.trim()).catch(() => '');
                if (instructionText) { // Ensure non-empty instructions are added
                    section.instructions.push({
                        instruction: instructionText,
                        // stepNumber could be inferred from array index or some other attribute if available
                    });
                }
            }

            // Log for debugging
            console.log(`Instructions for section "${instructionHeader}":`, section.instructions);

            // Update or add the processed section in recipeData
            const existingIndex = recipeData.sections.findIndex(s => s.instructionHeader === instructionHeader);
            if (existingIndex === -1) {
                recipeData.sections.push(section);
            } else {
                // Might need to merge or replace instructions based on your exact requirements
                recipeData.sections[existingIndex].instructions = section.instructions;
            }
        }
    } else {
        console.log("No distinct instruction sections found. Proceeding with general extraction.");
    }
}

// Define a function to extract recipe notes from the page
const extractRecipeNotes = async (page, config) => {
    try {
        const { recipeNotes } = config;
        if (!recipeNotes) {
            console.log('Recipe notes selector not found in config. Skipping recipe notes extraction.');
            return [];
        }

        // Extract recipe notes using the provided selector
        const notes = await page.$$eval(recipeNotes, notes => notes.map(note => note.innerText.trim()));
        return notes;
    } catch (error) {
        console.error('Error extracting recipe notes:', error);
        return [];
    }
};


const navigateToPrintPage = async (page, config) => {
    // Validate config at the start of the function
    if (!config || !config.printButtonSelector) {
        console.error('Invalid config passed to navigateToPrintPage');
        return false; // Exit early if config is invalid
    }

    try {
        await page.waitForSelector(config.printButtonSelector, { timeout: 5000 });
        const printPageUrl = await page.$eval(config.printButtonSelector, el => el.href);
        await page.goto(printPageUrl, { waitUntil: 'networkidle0' });
        console.log('Successfully navigated to print page.');
        return true;
    } catch (error) {
        console.log('Print page navigation failed or not available, proceeding with standard page scraping.', error);
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

        browser = await puppeteer.launch({ headless: true });
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

        const recipeImageUrl = await extractImageURL(page, config);
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
        await extractGeneralFields(page, config, recipeData);
        await extractTimeFields(page, config, recipeData);

        // Process distinct ingredient and instruction sections if they exist
        await processIngredientSections(page, config, recipeData);
        await processInstructionSections(page, config, recipeData);

        // Extract recipe notes if available
        const recipeNotes = await extractRecipeNotes(page, config);
        if (recipeNotes && recipeNotes.length > 0) {
            console.log('Recipe Notes:', recipeNotes);
            recipeData.recipeNotes = recipeNotes;
        }

        // Extracted recipe data
        console.log('Scraped recipe data:', JSON.stringify(recipeData, null, 2));

        recipeData.userId = userId;

        transaction = await sequelize.transaction();

        // Create a new recipe using the createRecipeService function
        const newRecipe = await createRecipeService(recipeData, userId, transaction);

        console.log('New recipe created:', newRecipe);
        return newRecipe;

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


