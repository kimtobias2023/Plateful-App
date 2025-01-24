import { LongShelfLifeItem } from '../models/sequelize/grocery/index.mjs';
import levenshtein from 'fast-levenshtein';

function calculateSimilarity(str1, str2) {
    const distance = levenshtein.get(str1, str2);
    const longestLength = Math.max(str1.length, str2.length);
    if (longestLength === 0) return 1;
    return 1 - (distance / longestLength);
}

async function fuzzyMatchingUtil(ingredientName) {
    const longShelfLifeItems = await LongShelfLifeItem.findAll({
        attributes: ['id', 'longShelfLifeItems']
    });

    // Split the ingredient name into words
    const ingredientWords = ingredientName.toLowerCase().split(' ');

    for (const item of longShelfLifeItems) {
        const keyword = item.longShelfLifeItems.toLowerCase();

        // Check similarity for each word in ingredient name
        for (const word of ingredientWords) {
            const similarity = calculateSimilarity(word, keyword);
            if (similarity > 0.7) {
                return item.id; // Return the ID of the matched item
            }
        }
    }

    return null; // No match found
}

export { fuzzyMatchingUtil };

