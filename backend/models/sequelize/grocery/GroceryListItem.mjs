// GroceryListItems Model
import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class GroceryListItem extends Model { }

GroceryListItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            comment: 'Primary key for GroceryListItems'
        },
        groceryListId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'GroceryList',
                key: 'id'
            },
            allowNull: false,
            comment: 'Foreign key referencing GroceryLists table'
        },
        groceryItemId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'GroceryItem',
                key: 'id'
            },
            allowNull: false,
            comment: 'Foreign key referencing GroceryItems table'
        },
        quantity: {
            type: DataTypes.DECIMAL(10, 2), // Adjust precision and scale as needed
            allowNull: false,
            comment: 'Quantity of the grocery item in the grocery list'
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Unit of measurement for the grocery item quantity'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Date and time when the grocery list item was created'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Date and time when the grocery list item was last updated'
        }
    },
    {
        sequelize,
        modelName: 'GroceryListItem',
        tableName: 'GroceryListItems',
        timestamps: true  // now set to true because you want timestamps
    }
);

export default GroceryListItem;


