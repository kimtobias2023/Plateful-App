function parseIngredient(ingredient) {
    if (typeof ingredient !== 'string') {
        console.error("parseIngredient called with non-string argument", ingredient);
        return null;
    }
    try {
        const quantityRegex = /(\d+\/\d+|\d+\.?\d*)\s*/;
        // Adjusted unit regex to correctly handle plurals
        const unitRegex = /\b(cups?|tablespoons?|teaspoons?|ounces?|grams?|tbsps?|tsps?|oz|lbs?|g|ml|l)\b/i;
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

        // Fix to ensure 's' stays with the unit if originally present
        if (unit && unit.endsWith('s') && name.startsWith(' ')) {
            unit += 's'; // Append 's' back to unit
            name = name.substring(1); // Remove leading ' ' added by the split
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


