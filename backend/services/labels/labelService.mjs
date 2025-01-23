// services/labelService.mjs
import Recipe from '../../models/recipes/Recipe.mjs';
import Label from '../../models/labels/Label.mjs';
import RecipeLabel from '../../models/recipes/RecipeLabel.mjs';

async function addLabelService(data) {
    try {
        const newLabel = await Label.create(data);
        return newLabel;
    } catch (error) {
        console.error("Error in addLabel:", error);
        throw error;
    }
}

async function getLabelByIdService(id) {
    try {
        return await Label.findByPk(id);
    } catch (error) {
        console.error("Error in getLabelById:", error);
        throw error;
    }
}

async function getAllLabelsService() {
    try {
        const labels = await Label.findAll();
        return labels;
    } catch (error) {
        console.error("Error in getAllLabels:", error);
        throw error;
    }
}

async function updateLabelService(id, updatedData) {
    try {
        const result = await Label.update(updatedData, {
            where: { id }
        });
        if (result[0] === 1) {
            return await Label.findByPk(id);
        } else {
            throw new Error('Update failed or no matching label found.');
        }
    } catch (error) {
        console.error("Error in updateLabel:", error);
        throw error;
    }
}

async function deleteLabelService(id) {
    try {
        const result = await Label.destroy({
            where: { id }
        });
        return result;  // Returns the number of records deleted (should be 0 or 1)
    } catch (error) {
        console.error("Error in deleteLabel:", error);
        throw error;
    }
}


export {
    addLabelService,
    getLabelByIdService,
    getAllLabelsService,
    updateLabelService,
    deleteLabelService,
};


