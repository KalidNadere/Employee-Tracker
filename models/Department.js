const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Department = sequelize.define('Department', {

  departmentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Department;