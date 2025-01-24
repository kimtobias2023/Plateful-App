import cheerio from 'cheerio';

function normalizeKey(key) {
    const mapping = {
        'calories': 'calories',
        'fat': 'fatContent',
        'saturatedfat': 'saturatedFatContent',
        'carbohydrates': 'carbohydrateContent',
        'sugars': 'sugarContent',
        'protein': 'proteinContent',
        'fiber': 'fiberContent',
        'sodium': 'sodiumContent',
        // Add more mappings as necessary
    };
    const normalizedKey = key.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/gi, '');
    return mapping[normalizedKey] || normalizedKey;
}

function extractValueAndUnit(text) {
    const match = text.match(/(\d+\.?\d*)(\s*[a-zA-Z%]+)?/);
    if (match) {
        return {
            value: match[1],
            unit: match[2] ? match[2].trim() : ''
        };
    }
    return { value: text, unit: '' };
}

function extractNutritionData(htmlContent, config) {
    const $ = cheerio.load(htmlContent);
    const nutritionInfoContainer = $(config.nutritionContainer);

    let nutritionData = {};

    nutritionInfoContainer.find('p').each((_, el) => {
        const paragraphs = $(el).text().split(/,|\.|\n/); // Split by commas, periods, or new lines for separate facts

        paragraphs.forEach(paragraph => {
            const facts = paragraph.trim().split(/\s+(?=\d)/);
            facts.forEach(fact => {
                const [rawKey, ...rest] = fact.split(':'); // Split by colon in case of "Key: Value" format
                const rawValue = rest.join(':'); // Handle cases where the value might also contain colons
                const { value, unit } = extractValueAndUnit(rawValue.trim());
                const key = normalizeKey(rawKey);

                if (!nutritionData[key]) { // Prevent overwriting if the key already exists
                    nutritionData[key] = { value, unit };
                }
            });
        });
    });

    return nutritionData;
}

export default extractNutritionData;
