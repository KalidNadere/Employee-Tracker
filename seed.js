const { Sequelize } = require('sequelize');
require('dotenv').config();

const Department = require('./models/Department');
const Role = require('./models/Role');
const Employee = require('./models/Employee');

const seedDatabase = async () => {

// Configure Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

const departmentData = [
  { name: 'HR' },
  { name: 'Finance' },
  { name: 'Sales' },
  { name: 'Engineering' },
  { name: 'Tech' },
  { name: 'Legal' },
];

const roleData = [
  { title: 'Manager', salary: 70000, department_id: 1 },
  { title: 'Accountant', salary: 95000, department_id: 2 },
  { title: 'Sales Lead', salary: 85000, department_id: 3 },
  { title: 'Engineer', salary: 90000, department_id: 4 },
  { title: 'Software Engineer', salary: 105000, department_id: 5 },
  { title: 'Barrister', salary: 110000, department_id: 6 },
];

const employeeData = [
  { first_name: 'John', last_name: 'Doe', role_id: 1, manager_id: 1 },
  { first_name: 'Michael', last_name: 'Johnson', role_id: 3, manager_id: 1 },
  { first_name: 'Alec', last_name: 'Baldwin',role_id: 4, manager_id: 3 },
  { first_name: 'Tom', last_name: 'Cruise', role_id: 5, manager_id: 1 },
  { first_name: 'Al', last_name: 'Pacino', role_id: 6, manager_id: 3 },
  { first_name: 'Jean', last_name: 'Claude', role_id: 3, manager_id: 1},
];

async function createDatabase() {
  try {
    // Sync models with database
    await sequelize.sync();

    // Insert data into tables
    await Department.bulkCreate(departmentData);
    await Role.bulkCreate(roleData);
    await Employee.bulkCreate(employeeData);

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}
};

// Call the seeding function
seedDatabase();

module.exports = seedDatabase;