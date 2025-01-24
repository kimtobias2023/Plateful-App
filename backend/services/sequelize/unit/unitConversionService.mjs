// services/unitConversionsService.mjs
import UnitConversion from '../../../models/sequelize/unit/UnitConversion.mjs';

async function addConversion(conversionData, transaction = null) {
    try {
        return await UnitConversion.create(conversionData, { transaction });
    } catch (error) {
        console.error("Error in addConversion:", error);
        throw error;
    }
}

async function getConversionById(conversionId, transaction = null) {
    try {
        const conversion = await UnitConversion.findByPk(conversionId, { transaction });
        if (!conversion) {
            throw new Error('Conversion entry not found.');
        }
        return conversion;
    } catch (error) {
        console.error("Error in getConversionById:", error);
        throw error;
    }
}

async function getConversionByUnits(fromUnit, toUnit, transaction = null) {
    try {
        return await UnitConversion.findOne({
            where: {
                from_unit: fromUnit,
                to_unit: toUnit
            },
            transaction,
        });
    } catch (error) {
        console.error("Error in getConversionByUnits:", error);
        throw error;
    }
}

async function updateConversion(conversionId, updatedData, transaction = null) {
    try {
        const result = await UnitConversion.update(updatedData, {
            where: { id: conversionId },
            transaction,
        });
        if (result[0] === 1) {
            return await UnitConversion.findByPk(conversionId, { transaction });
        } else {
            throw new Error('Update failed or no matching conversion found.');
        }
    } catch (error) {
        console.error("Error in updateConversion:", error);
        throw error;
    }
}

async function deleteConversion(conversionId, transaction = null) {
    try {
        const result = await UnitConversion.destroy({
            where: { id: conversionId },
            transaction,
        });
        return result;
    } catch (error) {
        console.error("Error in deleteConversion:", error);
        throw error;
    }
}

export {
    addConversion,
    getConversionById,
    getConversionByUnits,
    updateConversion,
    deleteConversion,
};

