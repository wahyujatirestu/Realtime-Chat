// models/User.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    isEmail: true,
                },
            },
            fullname: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                    len: [3, 20],
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            gender: {
                type: DataTypes.ENUM('Male', 'Female'),
                allowNull: false,
                defaultValue: 'Male',
            },
            profilePic: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
            },
            refreshToken: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
            },
        },
        {
            tableName: 'users',
        }
    );

    User.associate = function (models) {
        // Relasi many-to-many dengan Conversation
        User.belongsToMany(models.Conversation, {
            through: 'UserConversations',
            as: 'conversations',
            foreignKey: 'userId',
            otherKey: 'conversationId',
        });

        // Relasi one-to-many dengan Message
        User.hasMany(models.Message, {
            as: 'sentMessages',
            foreignKey: 'senderId',
        });

        User.hasMany(models.Message, {
            as: 'receivedMessages',
            foreignKey: 'receiverId',
        });
    };

    return User;
};
