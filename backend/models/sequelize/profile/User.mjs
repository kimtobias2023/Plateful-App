import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from './../../../config/sequelize-instance.mjs';
import bcrypt from 'bcryptjs';

class User extends Model {
    static async hashPassword(password) {
        console.log('[User Model] Hashing password.');
        return await bcrypt.hash(password, 10);
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        field: 'email', // Map to database column
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true, // Allow null for OAuth users
        field: 'password',
    },
    oauthProvider: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'oauth_provider',
    },
    oauthId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: 'unique_oauth_user',
        field: 'oauth_id',
    },
    verificationToken: {
        type: DataTypes.STRING(64),
        allowNull: true,
        field: 'verification_token',
    },
    firstName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'first_name',
    },
    lastName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'last_name',
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_email_verified',
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        field: 'created_at',
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        field: 'updated_at',
    },
    failedLoginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        field: 'failed_login_attempts',
    },
    lastFailedLogin: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_failed_login',
    },
    lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login_at',
    },
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                console.log('[User Model] Hashing password before create.');
                user.password = await User.hashPassword(user.password);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                console.log('[User Model] Hashing password before update.');
                user.password = await User.hashPassword(user.password);
            }
        },
    },
    sequelize,
    modelName: 'User',
    tableName: 'users', // Match the database table name
    timestamps: true,
    underscored: false,
    indexes: [
        {
            unique: true,
            fields: ['oauth_provider', 'oauth_id'], // Composite unique constraint
        },
    ],
    validate: {
        checkPasswordOrOauth() {
            if (
                (this.password === null && this.oauthProvider === null) ||
                (this.password !== null && this.oauthProvider !== null)
            ) {
                throw new Error(
                    'Either password or oauthProvider must be provided, but not both.'
                );
            }
        },
    },
});

export default User;



