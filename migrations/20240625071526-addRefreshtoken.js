'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('users', 'refreshToken', {
                type: Sequelize.STRING,
                allowNull: true,
            }),
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn('users', 'refreshToken'),
        ]);
    },
};
