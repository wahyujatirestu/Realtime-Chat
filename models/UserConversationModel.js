// models/Conversation.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define(
        'Conversation',
        {},
        {
            tableName: 'conversations',
        }
    );

    const UserConversations = sequelize.define(
        'UserConversations',
        {
            participants: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            conversationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: 'user_conversations',
        }
    );

    Conversation.associate = function (models) {
        // Relasi many-to-many dengan User
        Conversation.belongsToMany(models.User, {
            through: UserConversations,
            as: 'participants',
            foreignKey: 'conversationId',
            otherKey: 'userId',
        });

        // Relasi one-to-many dengan Message
        Conversation.hasMany(models.Message, {
            as: 'messages',
            foreignKey: 'conversationId',
        });
    };

    return Conversation;
};
