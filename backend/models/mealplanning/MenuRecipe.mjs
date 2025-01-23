
import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';

class MenuRecipe extends Model { }

MenuRecipe.init({
    menuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Menu', // This should be the name of the table, not the model
            key: 'id'
        }
    },
    recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Recipe', // This should be the name of the table, not the model
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
    modelName: 'MenuRecipe',
    tableName: 'MenuRecipes',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

export default MenuRecipe;
