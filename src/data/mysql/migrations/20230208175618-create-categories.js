module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('categories')
  }
};

