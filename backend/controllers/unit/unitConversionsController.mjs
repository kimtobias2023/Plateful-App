// Import the necessary functions from unitConversionsService
import {
    addConversion,
    getConversionById,
    getConversionByUnits,
    updateConversion,
    deleteConversion
} from '../../services/sequelize/unit/unitConversionService.mjs'; // Update the import path as needed

// Define your controller functions here
const addConversionController = async (req, res) => {
    try {
        const conversionData = req.body;
        const newConversion = await addConversion(conversionData);
        res.status(201).json(newConversion);
    } catch (error) {
        console.error("Error in addConversionController:", error);
        res.status(500).json({ error: "Failed to add conversion" });
    }
};

const getConversionByIdController = async (req, res) => {
    try {
        const conversionId = req.params.conversionId;
        const conversion = await getConversionById(conversionId);

        if (!conversion) {
            return res.status(404).json({ error: "Conversion not found" });
        }

        res.json(conversion);
    } catch (error) {
        console.error("Error in getConversionByIdController:", error);
        res.status(500).json({ error: "Failed to retrieve conversion" });
    }
};

const getConversionByUnitsController = async (req, res) => {
    try {
        const fromUnit = req.query.fromUnit;
        const toUnit = req.query.toUnit;
        const conversion = await getConversionByUnits(fromUnit, toUnit);

        if (!conversion) {
            return res.status(404).json({ error: "Conversion not found" });
        }

        res.json(conversion);
    } catch (error) {
        console.error("Error in getConversionByUnitsController:", error);
        res.status(500).json({ error: "Failed to retrieve conversion" });
    }
};

const updateConversionController = async (req, res) => {
    try {
        const conversionId = req.params.conversionId;
        const updatedData = req.body;
        const updatedConversion = await updateConversion(conversionId, updatedData);

        if (!updatedConversion) {
            return res.status(404).json({ error: "Conversion not found" });
        }

        res.json(updatedConversion);
    } catch (error) {
        console.error("Error in updateConversionController:", error);
        res.status(500).json({ error: "Failed to update conversion" });
    }
};

const deleteConversionController = async (req, res) => {
    try {
        const conversionId = req.params.conversionId;
        const result = await deleteConversion(conversionId);

        if (result === 0) {
            return res.status(404).json({ error: "Conversion not found" });
        }

        res.json({ message: "Conversion deleted successfully" });
    } catch (error) {
        console.error("Error in deleteConversionController:", error);
        res.status(500).json({ error: "Failed to delete conversion" });
    }
};

// Export the controller functions
export {
    addConversionController,
    getConversionByIdController,
    getConversionByUnitsController,
    updateConversionController,
    deleteConversionController
};
