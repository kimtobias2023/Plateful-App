import {
    addLabelService,
    getLabelByIdService,
    getAllLabelsService,
    updateLabelService,
    deleteLabelService,
} from '../../services/sequelize/label/labelService.mjs'; // Update the import path as needed

// Controller functions for handling label related requests
const createLabelController = async (req, res) => {
    try {
        const { labelName, labelType } = req.body;

        // Check if label already exists
        const existingLabel = await Label.findOne({
            where: { labelName, labelType }
        });

        if (existingLabel) {
            return res.status(409).json({ message: "Label already exists" });
        }

        // Create new label
        const newLabel = await addLabelService({ labelName, labelType });
        res.status(201).json(newLabel);
    } catch (error) {
        console.error("Error creating label:", error);
        res.status(500).json({ error: "Failed to create label" });
    }
};


const getLabelController = async (req, res) => {
    try {
        const labelId = req.params.labelId;
        const label = await getLabelByIdService(labelId);
        if (!label) {
            res.status(404).json({ error: "Label not found" });
        } else {
            res.json(label);
        }
    } catch (error) {
        console.error("Error getting label by ID:", error);
        res.status(500).json({ error: "Failed to get label" });
    }
};

const getAllLabelsController = async (req, res) => {
    try {
        const labels = await getAllLabelsService();

        // Include the id in the response
        const labelData = labels.map(label => ({
            labelType: label.dataValues.labelType,
            labelName: label.dataValues.labelName,
            id: label.dataValues.id // Ensure the id is included here
        }));

        console.log("Labels data:", labelData);
        res.status(200).json(labelData);
    } catch (error) {
        console.error("Error getting all labels:", error);
        res.status(500).json({ error: "Failed to get labels" });
    }
};



const updateLabelController = async (req, res) => {
    try {
        const labelId = req.params.labelId;  // Use labelId instead of recipeId
        const updatedData = req.body;
        const updatedLabel = await updateLabelService(labelId, updatedData); // Update label details
        if (!updatedLabel) {
            res.status(404).json({ error: "Label not found or update failed" });
        } else {
            res.json(updatedLabel);
        }
    } catch (error) {
        console.error("Error updating label:", error);
        res.status(500).json({ error: "Failed to update label" });
    }
};


const deleteLabelController = async (req, res) => {
    try {
        const labelId = req.params.labelId;
        const result = await deleteLabelService(labelId);
        if (result === 1) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: "Label not found" });
        }
    } catch (error) {
        console.error("Error deleting label:", error);
        res.status(500).json({ error: "Failed to delete label" });
    }
};


export {
    createLabelController,
    getLabelController,
    getAllLabelsController,
    updateLabelController,
    deleteLabelController,
};

