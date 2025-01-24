// GroceryLists Model
import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class GroceryList extends Model { }

GroceryList.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Primary key for the grocery list'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',  // assuming the table name for users is 'users'
            key: 'id'
        },
        comment: "The ID of the user to whom the grocery list belongs"
    },
    createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "The date when the grocery list was created"
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Date and time when the grocery list was created'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Date and time when the grocery list was last updated'
    }
}, {
    sequelize,
    modelName: 'GroceryList',
    tableName: 'GroceryLists',
    timestamps: true,
});

export default GroceryList;



