// File: mealplanning/mealPlan.mjs

import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class Menu extends Model {
    get daysDuration() {
        const startDate = this.getDataValue('startDate');
        const endDate = this.getDataValue('endDate');

        if (startDate && endDate) {
            const diff = endDate - startDate;
            return Math.ceil(diff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        }

        return null;
    }
}

Menu.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User', // Ensure the model name matches the actual users model name
            key: 'id'
        }
    },
    startDate: {
        type: DataTypes.DATE, // or DataTypes.DATE with timezone: true
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE, // or DataTypes.DATE with timezone: true
        allowNull: false
    },
    menuName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    sequelize,
    modelName: 'Menu',
    tableName: 'Menus',
    timestamps: true,
});

export default Menu;



