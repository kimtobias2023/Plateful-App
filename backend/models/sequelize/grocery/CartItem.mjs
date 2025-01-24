import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class CartItem extends Model { }

CartItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            comment: 'Primary key for cart_items'
        },
        cart_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'shopping_carts',
                key: 'id'
            },
            allowNull: false,
            comment: 'Foreign key referencing shopping_carts table'
        },
        groceryitem_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'grocery_items',
                key: 'id'
            },
            allowNull: false,
            comment: 'Foreign key referencing grocery_items table'
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Quantity of the grocery item in the cart'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Date and time when the cart item was created'
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Date and time when the cart item was last updated'
        }
    },
    {
        sequelize,
        modelName: 'CartItem',
        tableName: 'cart_items',
        timestamps: true, // Enable Sequelize's automatic handling of created_at and updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default CartItem;

