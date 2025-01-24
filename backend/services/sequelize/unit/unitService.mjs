import Unit from '../../../models/sequelize/unit/Unit.mjs';

async function addUnit(unitData, transaction) {
    try {
        return await Unit.create(unitData, { transaction });
    } catch (error) {
        console.error("Error in addUnit:", error);
        throw error;
    }
}

async function getUnitById(unitId, transaction) {
    try {
        const unit = await Unit.findByPk(unitId, { transaction });
        if (!unit) {
            throw new Error('Unit not found.');
        }
        return unit;
    } catch (error) {
        console.error("Error in getUnitById:", error);
        throw error;
    }
}

async function getAllUnits(transaction) {
    try {
        return await Unit.findAll({ transaction });
    } catch (error) {
        console.error("Error in getAllUnits:", error);
        throw error;
    }
}

async function updateUnit(unitId, updatedData, transaction) {
    try {
        const result = await Unit.update(updatedData, {
            where: { id: unitId },
            transaction,
        });

        if (result[0] === 1) {
            return await Unit.findByPk(unitId, { transaction });
        } else {
            throw new Error('Update failed or no matching unit found.');
        }
    } catch (error) {
        console.error("Error in updateUnit:", error);
        throw error;
    }
}

async function deleteUnit(unitId, transaction) {
    try {
        const result = await Unit.destroy({
            where: { id: unitId },
            transaction,
        });
        return result; // Returns the number of records deleted (should be 0 or 1)
    } catch (error) {
        console.error("Error in deleteUnit:", error);
        throw error;
    }
}

export {
    addUnit,
    getUnitById,
    getAllUnits,
    updateUnit,
    deleteUnit,
};


