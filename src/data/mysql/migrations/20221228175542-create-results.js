'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('results', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      app_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      package: {
        type: Sequelize.STRING,
        allowNull: false
      },
      version: {
        type: Sequelize.STRING,
        allowNull: false
      },
      test_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      test_parameter: {
        type: Sequelize.STRING,
        allowNull: true
      },
      test_result: {
        type: Sequelize.STRING,
        allowNull: true
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: true
      },
      optional: {
        type: Sequelize.STRING,
        allowNull: true
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false
      },
      state: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('results')
  }
};
