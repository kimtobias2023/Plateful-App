/**
 * Convert a Unicode fraction string to a decimal number.
 * @param {string} fractionString - The Unicode fraction string to convert (e.g., "½").
 * @returns {number|null} The decimal representation of the Unicode fraction, or null if conversion fails.
 */
const unicodeFractionToDecimal = (fractionString) => {
    // Normalize the fraction string to ensure consistent formatting
    fractionString = fractionString.normalize("NFKC");

    // Split the fraction string into numerator and denominator
    const [numeratorString, denominatorString] = fractionString.split('/').map(str => str.trim());

    // Parse numerator and denominator as integers
    const numerator = parseInt(numeratorString, 10);
    const denominator = parseInt(denominatorString, 10);

    // Check if numerator and denominator are valid numbers
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
        return null; // Return null if conversion fails
    }

    // Calculate the decimal value
    return numerator / denominator;
};
export { unicodeFractionToDecimal };