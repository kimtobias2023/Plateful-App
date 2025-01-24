
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class Subscription extends Model {}

Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Table name
        key: 'id',
      },
    },
    plan: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., "free_trial", "monthly", "yearly"
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active', // e.g., "active", "expired", "canceled"
    },
  },
  {
    sequelize,
    modelName: 'Subscription',
    tableName: 'subscriptions',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  }
);

export default Subscription;
