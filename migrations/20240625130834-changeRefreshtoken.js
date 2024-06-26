'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('users', 'refreshToken', {
                type: Sequelize.STRING(512),
            }),
        ]);
    },

    down: (queryInterface) => {
        return Promise.all([
            queryInterface.changeColumn('users', 'refreshToken'),
        ]);
    },
};
