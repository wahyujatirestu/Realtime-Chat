// models/Message.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define(
        'Message',
        {
            senderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            receiverId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            message: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            conversationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
        },
        {
            tableName: 'messages',
        }
    );

    Message.associate = function (models) {
        // Relasi many-to-one dengan User (sender)
        Message.belongsTo(models.User, {
            as: 'Sender',
            foreignKey: 'senderId',
        });

        // Relasi many-to-one dengan User (receiver)
        Message.belongsTo(models.User, {
            as: 'Receiver',
            foreignKey: 'receiverId',
        });

        // Relasi many-to-one dengan Conversation
        Message.belongsTo(models.Conversation, {
            as: 'conversation',
            foreignKey: 'conversationId',
        });
    };

    return Message;
};
