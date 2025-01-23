import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';

class LongShelfLifeItem extends Model { }

LongShelfLifeItem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    longShelfLifeItems: {
        type: DataTypes.STRING(255),
        comment: "Keywords for identifying long shelf life ingredients"
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
    modelName: 'LongShelfLifeItem',
    tableName: 'LongShelfLifeItems',
    timestamps: true,
});

export default LongShelfLifeItem;

