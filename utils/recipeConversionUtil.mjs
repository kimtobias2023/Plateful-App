// recipeConversionUtil.mjs

// Greatest common divisor function
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// This function tries to correct floating point errors by rounding to a fixed precision
const fixPrecision = (number) => {
    const tolerance = 1e-7; // Adjust the tolerance as needed
    return Math.round(number + tolerance);
};

export const decimalToFraction = (decimal) => {
    // Check for NaN first
    if (isNaN(decimal)) {
        return null;
    }

    // Handle common fractions
    const commonFractions = {
        0.3333: '1/3',
        0.6666: '2/3',
        // ... add more as needed
    };

    // Check if the decimal is close to any common fraction
    for (let key in commonFractions) {
        if (Math.abs(parseFloat(key) - decimal) < 0.01) { // Adjust this threshold as needed
            return commonFractions[key];
        }
    }

    // Continue with the normal process for other decimals
    const whole = Math.floor(decimal);
    decimal -= whole;
    if (decimal === 0) {
        return whole.toString(); // Return 'whole' if there is no fractional part
    }

    let top = fixPrecision(decimal * 10000); // Scale the decimal
    let bottom = 10000; // The scale factor

    const greatestCommonDivisor = gcd(top, bottom);
    top /= greatestCommonDivisor;
    bottom /= greatestCommonDivisor;

    // If whole is 0, just return the fraction part
    return whole ? `${whole} ${top}/${bottom}` : `${top}/${bottom}`;
};


// Converts a fraction to a decimal
export const fractionToDecimal = (fraction) => {
    const [numerator, denominator] = fraction.split('/').map(Number);
    if (denominator > 0) {
        return numerator / denominator;
    } else {
        throw new Error('Invalid fraction');
    }
};

