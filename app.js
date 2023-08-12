const express = require('express');
const app = express();
const departmentRoutes = require('./routes/departmentRoutes');
const roleRoutes = require('./routes/roleRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const sequelize = require('./sequelize');
const inquirer = require('inquirer');
require('dotenv').config();
const { seedDatabase } = require('./seed');

// Importing departmentController
const departmentController = require('./controllers/departmentController');
const employeeController = require('./controllers/employeeController');
const roleController = require('./controllers/roleController');

// Middleware
app.use(express.json());

// Routes
app.use(departmentRoutes);
app.use(roleRoutes);
app.use(employeeRoutes);

// async function to start the app
async function startApp() {
  try {
    await sequelize.sync();
    await seedDatabase;

const menuChoices = [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add A Department',
      'Add A Role',
      'Add An Employee',
      'Update An Employee Role',
      'Update An Employee Manager',
      'Delete Department',
      'Delete Role',
      'Delete Employee',
      'Exit'
    ];

const { menu } = await inquirer.prompt({
  type: 'list',
      name: 'menu',
      message: 'What would you like to do?',
      choices: menuChoices,
    });

switch (menu) {
case 'View All Departments':
  await departmentController.viewAllDepartments();
  break;
case 'View All Roles':
  await roleController.viewAllRoles();
  break;
case 'View All Employees':
  await employeeController.viewAllEmployees();
  break;
case 'Add A Department':
  await departmentController.addDepartment();
  break;
case 'Add A Role':
  await roleController.addRole();
  break;
case 'Add An Employee':
  await employeeController.addEmployee();
  break;
case 'Update An Employee Manager':
  await updateEmployeeManager();
  break;
case 'Delete Department':
  await deleteDepartment();
  break;
case 'Delete Role':
  await deleteRole();
  break;
case 'Delete Employee':
  await deleteEmployee();
  break;
case 'Exit':
      console.log('Goodbye!');
      process.exit();
 }
} catch (error) {
  console.error('Error syncing database:', error);
  }
}

// Calling async function to start the app
startApp();
