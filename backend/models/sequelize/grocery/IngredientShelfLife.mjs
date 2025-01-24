// IngredientShelfLife (join table) model
import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class IngredientShelfLife extends Model { }
IngredientShelfLife.init({
    ingredientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,  // Part of the composite primary key
        references: {
            model: 'RecipeSectionIngredients',
            key: 'id'
        }
    },
    shelfLifeItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,  // Part of the composite primary key
        references: {
            model: 'LongShelfLifeItems',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Date and time when the record was created"
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Date and time when the record was last updated"
    }
}, {
    sequelize,
    modelName: 'IngredientShelfLife',
    tableName: 'IngredientShelfLife',
    timestamps: true
});

export default IngredientShelfLife;
