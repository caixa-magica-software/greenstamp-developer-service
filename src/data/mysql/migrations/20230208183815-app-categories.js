'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('apps_categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      package: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      version: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('apps_categories')
  }
};
