const inquirer = require('inquirer');
const { connection } = require('../util/database');

module.exports = {
  async viewAllEmployees() {
    try {
      const query = 'SELECT * FROM Employee';
      connection.query(query, (err, employees) => {
        if (err) {
          console.error('Error fetching employees:', err);
        } else {
          console.log('All Employees:');
          employees.forEach(employee => {
            console.log(`- ${employee.first_name} ${employee.last_name}`);
          });
        }
        startApp();
      });
    } catch (error) {
      console.error('Error viewing all Employees:', error);
    }
  },

  addEmployee: () => {
    // code to add an employee here using inquirer prompts and MySQL queries
    inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employee's first name:",
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name:",
      },
      {
        type: 'list',
        name: 'role_id',
        message: "Select the employee's role:",
        choices: roleChoices,
      },
      {
        type: 'list',
        name: 'manager_id',
        message: "Select the employee's manager:",
        choices: managerChoices,
      },
    ])
    .then((answers) => {
      const query = 'INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
      connection.query(query, [answers.firstName, answers.lastName, answers.roleid, answers.managerid], (err) => {
        if (err) {
          console.error('Error adding employee:', err);
        } else {
          console.log(`Employee "${answers.firstName} ${answers.lastName}" added successfully.`);
        }
        startApp();
      });
    });
  },

  getEmployeeById: () => {
    
    inquirer.prompt([
      {
        type: 'input',
        name: 'employeeId',
        message: 'Enter the ID of the employee:',
      },
    ])
    .then((answers) => {
      const query = 'SELECT * FROM Employee WHERE id = ?';
      connection.query(query, [answers.employeeId], (err, employee) => {
        if (err) {
          console.error('Error fetching employee:', err);
        } else {
          console.log('Employee Details:');
          console.log(`- Name: ${employee[0].first_name} ${employee[0].last_name}`);
          // Display other details as needed
        }
        startApp();
      });
    });
  },

  updateEmployee: () => {
    
    inquirer.prompt([
      {
        type: 'input',
        name: 'employeeId',
        message: 'Enter the ID of the employee you want to update:',
      },
      {
        type: 'input',
        name: 'newFirstName',
        message: "Enter the employee's new first name:",
      },
      {
        type: 'input',
        name: 'newLastName',
        message: "Enter the employee's new last name:",
      },
    ])
    .then((answers) => {
      const query = 'UPDATE Employee SET first_name = ?, last_name = ? WHERE id = ?';
      connection.query(query, [answers.newFirstName, answers.newLastName, answers.employeeId], (err) => {
        if (err) {
          console.error('Error updating employee:', err);
        } else {
          console.log(`Employee updated successfully.`);
        }
        startApp();
      });
    });
  },

  deleteEmployee: () => {
    
    inquirer.prompt([
      {
        type: 'input',
        name: 'employeeId',
        message: 'Enter the ID of the employee you want to delete:',
      },
    ])
    .then((answers) => {
      const query = 'DELETE FROM Employee WHERE id = ?';
      connection.query(query, [answers.employeeId], (err) => {
        if (err) {
          console.error('Error deleting employee:', err);
        } else {
          console.log(`Employee deleted successfully.`);
        }
        startApp();
      });
    });
  },
 
};
