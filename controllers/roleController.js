const inquirer = require('inquirer');
const { connection } = require('../util/database');

module.exports = {
  async viewAllRoles() {
    try {
      const query = 'SELECT * FROM Role';
      connection.query(query, (err, roles) => {
        if (err) {
          console.error('Error fetching roles:', err);
        } else {
          console.log('All Roles:');
          roles.forEach(role => {
            console.log(`- ${role.title}`);
          });
        }
        startApp();
      });
    } catch (error) {
      console.error('Error viewing all Roles:', error);
    }
  },
  
  addRole: () => {
    
    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: "Enter the role's title:",
      },
      {
        type: 'number',
        name: 'salary',
        message: "Enter the role's salary:",
      },
      
    ])
    .then((answers) => {
      const query = 'INSERT INTO Role (title, salary) VALUES (?, ?)';
      connection.query(query, [answers.title, answers.salary], (err) => {
        if (err) {
          console.error('Error adding role:', err);
        } else {
          console.log(`Role "${answers.title}" added successfully.`);
        }
        startApp();
      });
    });
  },

  updateRole: () => {
    
    inquirer.prompt([
      {
        type: 'input',
        name: 'roleId',
        message: 'Enter the ID of the role you want to update:',
      },
      {
        type: 'input',
        name: 'newTitle',
        message: "Enter the role's new title:",
      },
      {
        type: 'number',
        name: 'newSalary',
        message: "Enter the role's new salary:",
      },

    ])
    .then((answers) => {
      const query = 'UPDATE Role SET title = ?, salary = ? WHERE id = ?';
      connection.query(query, [answers.newTitle, answers.newSalary, answers.roleId], (err) => {
        if (err) {
          console.error('Error updating role:', err);
        } else {
          console.log(`Role updated successfully.`);
        }
        startApp();
      });
    });
  },

  deleteRole: () => {
    
    inquirer.prompt([
      {
        type: 'input',
        name: 'roleId',
        message: 'Enter the ID of the role you want to delete:',
      },
    ])
    .then((answers) => {
      const query = 'DELETE FROM Role WHERE id = ?';
      connection.query(query, [answers.roleId], (err) => {
        if (err) {
          console.error('Error deleting role:', err);
        } else {
          console.log(`Role deleted successfully.`);
        }
        startApp();
      });
    });
  },

};
