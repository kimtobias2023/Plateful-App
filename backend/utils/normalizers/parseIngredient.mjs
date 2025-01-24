function preprocessIngredient(ingredient) {
    const rangePattern = /(\d+)\s*to\s*(\d+)/;
    const match = ingredient.match(rangePattern);

    if (match) {
        const lowerBound = parseInt(match[1], 10);
        const upperBound = parseInt(match[2], 10);
        const average = (lowerBound + upperBound) / 2;
        // Replace the range with the average in the ingredient string
        return ingredient.replace(rangePattern, average.toString());
    }

    return ingredient;
}

function parseIngredient(ingredient) {
    if (typeof ingredient !== 'string') {
        console.error("parseIngredient called with non-string argument", ingredient);
        return null;
    }
    // Apply preprocessing to handle ranges
    ingredient = preprocessIngredient(ingredient);

    ingredient = ingredient.replace(/▢\s*/g, '').trim();
    ingredient = ingredient.replace(/1⁄2/g, '1/2');

    try {
        const quantityRegex = /(\d+\/\d+|\d+\.?\d*)\s*/;
        const unitRegex = /\b(cups?|tablespoons?|teaspoons?|ounces?|grams?|tbsps?|tsps?|oz|lbs?|g|ml|l|pounds?)\b/i
        const notesRegex = /\(([^)]+)\)/;

        const quantityMatch = ingredient.match(quantityRegex);
        const unitMatch = ingredient.match(unitRegex);
        const notesMatch = ingredient.match(notesRegex);

        let quantity = quantityMatch ? quantityMatch[0].trim() : null;
        let unit = unitMatch ? unitMatch[0].trim() : null;
        let notesFromParentheses = notesMatch ? notesMatch[1].trim() : '';

        // Split the ingredient on the first comma, if present, to separate notes
        const [namePart, notesPart] = ingredient.split(/,(.+)/);

        // Cleanup the name part by removing the quantity, unit, and any parentheses notes
        let name = namePart
            .replace(quantityRegex, '')
            .replace(unitRegex, '')
            .replace(notesRegex, '')
            .trim();

        // Adjustments for unit and name
        if (unit && unit.endsWith('s') && name.startsWith(' ')) {
            unit += 's';
            name = name.substring(1);
        }

        let notes = notesFromParentheses;
        if (notesPart) {
            notes = notes ? notes + ', ' + notesPart : notesPart;
        }

        return { quantity, unit, name, notes };
    } catch (error) {
        console.error("Error parsing ingredient:", ingredient, error);
        return null;
    }
}

export { parseIngredient };



