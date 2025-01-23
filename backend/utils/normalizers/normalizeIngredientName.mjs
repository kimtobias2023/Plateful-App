export function normalizeIngredientName(name) {
    // Convert to lower case
    let normalizedName = name.toLowerCase();

    // List of words to be removed from ingredient names
    const wordsToRemove = ['fresh', 'granulated', 'natural', 'organic', 'raw'];

    // Remove the unnecessary words
    wordsToRemove.forEach((word) => {
        normalizedName = normalizedName.replace(word, '');
    });

    // Trim any excess whitespace
    normalizedName = normalizedName.trim();

    // Replace multiple spaces with a single space
    normalizedName = normalizedName.replace(/\s\s+/g, ' ');

    return normalizedName;
}

// Usage example:
const ingredientList = ['Granulated Sugar', 'Sugar', 'Fresh Strawberries', 'Strawberries'];
const normalizedIngredients = ingredientList.map(normalizeIngredientName);
