// utils/adjustStepNumbers.mjs

/**
 * Adjusts the step numbers of a list of instructions to ensure sequential order.
 * @param {Array} instructions - Array of instruction objects.
 * @returns {Array} - Array of instructions with adjusted step numbers.
 */
export function adjustStepNumbers(instructions) {
    // Sort instructions by their current step number to handle unsorted inputs
    const sortedInstructions = [...instructions].sort((a, b) => a.stepNumber - b.stepNumber);

    // Assign a new step number based on the array index to ensure sequentiality
    return sortedInstructions.map((instruction, index) => ({
        ...instruction,
        stepNumber: index + 1, // Assuming step number starts at 1
    }));
}
