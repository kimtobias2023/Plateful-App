// Import the necessary functions from unitService
import {
    addUnit,
    getUnitById,
    getAllUnits,
    updateUnit,
    deleteUnit
} from '../../services/units/unitService.mjs'; // Update the import path as needed

// Define your controller functions here
const addUnitController = async (req, res) => {
    try {
        const unitData = req.body;
        const newUnit = await addUnit(unitData);
        res.status(201).json(newUnit);
    } catch (error) {
        console.error("Error in addUnitController:", error);
        res.status(500).json({ error: "Failed to add unit" });
    }
};

const getUnitByIdController = async (req, res) => {
    try {
        const unitId = req.params.unitId;
        const unit = await getUnitById(unitId);

        if (!unit) {
            return res.status(404).json({ error: "Unit not found" });
        }

        res.json(unit);
    } catch (error) {
        console.error("Error in getUnitByIdController:", error);
        res.status(500).json({ error: "Failed to retrieve unit" });
    }
};

const getAllUnitsController = async (req, res) => {
    try {
        const units = await getAllUnits();
        console.log("Units retrieved:", units); // Log to see the retrieved units
        res.json(units.map(unit => ({
            id: unit.id, // Ensure the id is being passed
            unitName: unit.unitName,
            abbreviation: unit.abbreviation
        })));
    } catch (error) {
        console.error("Error in getAllUnitsController:", error);
        res.status(500).json({ error: "Failed to retrieve units" });
    }
};

const updateUnitController = async (req, res) => {
    try {
        const unitId = req.params.unitId;
        const updatedData = req.body;
        const updatedUnit = await updateUnit(unitId, updatedData);

        if (!updatedUnit) {
            return res.status(404).json({ error: "Unit not found" });
        }

        res.json(updatedUnit);
    } catch (error) {
        console.error("Error in updateUnitController:", error);
        res.status(500).json({ error: "Failed to update unit" });
    }
};

const deleteUnitController = async (req, res) => {
    try {
        const unitId = req.params.unitId;
        const result = await deleteUnit(unitId);

        if (result === 0) {
            return res.status(404).json({ error: "Unit not found" });
        }

        res.json({ message: "Unit deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUnitController:", error);
        res.status(500).json({ error: "Failed to delete unit" });
    }
};

// Export the controller functions
export {
    addUnitController,
    getUnitByIdController,
    getAllUnitsController,
    updateUnitController,
    deleteUnitController
};
