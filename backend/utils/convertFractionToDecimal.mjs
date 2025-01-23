import { evaluate } from 'mathjs';

/**
 * Convert a quantity string to a decimal number using mathjs.
 * @param {string} fractionString - The quantity string to convert (e.g., "3", "½", "3½").
 * @returns {number|null} The decimal representation of the quantity, or null if conversion fails.
 */

const fractionPattern = /^\s*(\d+)\s+(\d+)\/(\d+)\s*$|^\s*(\d+)\/(\d+)\s*$|^\s*(\d+)\s+(\d+)\/(\d+)\s*$|^\s*(\d+)\s+(\d+)\s*$|^\s*(\d+)(\s*\u00BC|\s*\u00BD|\s*\u00BE|\s*\u2150|\s*\u2151|\s*\u2152|\s*\u2153|\s*\u2154|\s*\u2155|\s*\u2156|\s*\u2157|\s*\u2158|\s*\u2159|\s*\u215A|\s*\u215B|\s*\u215C|\s*\u215D|\s*\u215E)?\s*|^\s*([^\d\s]+)\s*$/u;

function convertFractionToDecimal(fractionString) {
    try {
        if (!fractionPattern.test(fractionString)) {
            console.log(`Quantity does not match expected format: ${fractionString}`);
            return null; // Or handle this case as you see fit
        }

        // Handle Unicode fractions
        const unicodeFractions = {
            "½": "1/2",
            "⅓": "1/3",
            "⅔": "2/3",
            "¼": "1/4",
            "¾": "3/4",
            "⅕": "1/5",
            "⅖": "2/5",
            "⅗": "3/5",
            "⅘": "4/5",
            "⅙": "1/6",
            "⅚": "5/6",
            "⅛": "1/8",
            "⅜": "3/8",
            "⅝": "5/8",
            "⅞": "7/8"
        };

        // Replace Unicode fractions with standard fractions
        for (const [key, value] of Object.entries(unicodeFractions)) {
            fractionString = fractionString.replace(new RegExp(key, 'g'), value);
        }

        // Convert the normalized quantity string to a decimal number using mathjs
        return evaluate(fractionString);
    } catch (error) {
        console.error('Error converting quantity to decimal:', error.message);
        return null;
    }
}

export default convertFractionToDecimal;





