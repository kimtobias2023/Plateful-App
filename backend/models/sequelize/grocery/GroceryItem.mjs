// GroceryItems Model
import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class GroceryItem extends Model { }

GroceryItem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Unique identifier for each grocery item'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Name of the grocery item'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Description of the grocery item'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Date and time when the grocery item was created'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Date and time when the grocery item was last updated'
    }
}, {
    sequelize,
    modelName: 'GroceryItem',
    tableName: 'GroceryItems',
    timestamps: true,  // set to true since you want timestamps
});

export default GroceryItem;







