'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('messages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            senderId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                required: true,
            },
            receiverId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                required: true,
            },
            message: {
                type: Sequelize.STRING,
                allowNull: false,
                required: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('messages');
    },
};
