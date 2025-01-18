

// Utility function to transform label data
export const transformLabelData = (labelsData) => {
    const transformed = {};
    labelsData.forEach(label => {
        const { labelType, labelName, id: labelId } = label;
        if (!transformed[labelType]) {
            transformed[labelType] = [];
        }
        transformed[labelType].push({ labelName, labelId });
    });
    return transformed;
};