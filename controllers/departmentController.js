const inquirer = require('inquirer');
const { connection } = require('../util/database');

module.exports = {
  async viewAllDepartments() {
    try {
      const query = 'SELECT * FROM Department';
      connection.query(query, (err, departments) => {
        if (err) {
          console.error('Error fetching departments:', err);
        } else {
          console.log('All Departments:');
          departments.forEach(department => {
            console.log(`- ${department.name}`);
          });
        }
        startApp();
      });
    } catch (error) {
      console.error('Error viewing all Departments:', error);
    }
  },

  addDepartment: () => {
    inquirer.prompt({
      type: 'input',
      name: 'departmentName',
      message: "Enter the department's name:",
    })
    .then((answer) => {
      const query = 'INSERT INTO Department (name) VALUES (?)';
      connection.query(query, [answer.departmentName], (err) => {
        if (err) {
          console.error('Error adding department:', err);
        } else {
          console.log(`Department "${answer.departmentName}" added successfully.`);
        }
        startApp();
      });
    });
  },

  deleteDepartment: () => {
    const query = 'SELECT * FROM Department';
    connection.query(query, (err, departments) => {
      if (err) {
        console.error('Error fetching departments:', err);
      } else {
        const departmentChoices = departments.map((department) => department.name);
        inquirer.prompt({
          type: 'list',
          name: 'departmentName',
          message: 'Select the department to delete:',
          choices: departmentChoices,
        })
        .then((answer) => {
          const deleteQuery = 'DELETE FROM Department WHERE name = ?';
          connection.query(deleteQuery, [answer.departmentName], (err) => {
            if (err) {
              console.error('Error deleting department:', err);
            } else {
              console.log(`Department "${answer.departmentName}" deleted successfully.`);
            }
            startApp();
          });
        });
      }
    });
  }
};
