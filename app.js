const inquirer = require('inquirer');
const connectionPool = require('./util/database'); // importing Mysql connection

// Function to start the app
function startApp() {
  // connection.getConnection((err, connection) => {
  //   if (err) {
  //     console.error('Error connecting to database:', err);
  //     return;
  //   }

  inquirer
    .prompt({
      type: 'list',
      name: 'menu',
      message: 'What would you like to do?',
      choices: [
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
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.menu) {
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'Add A Department':
          addDepartment();
          break;
        case 'Add A Role':
          addRole();
          break;
        case 'Add An Employee':
          addEmployee();
          break;
        case 'Update An Employee Role':
          updateEmployeeRole();
          break
        case 'Update An Employee Manager':
          updateEmployeeManager();
          break
        case 'Delete Department':
          deleteDepartment();
          break;
        case 'Delete Role':
          deleteRole();
          break;
        case 'Delete Employee':
          deleteEmployee();
          break;
        case 'Exit':
          console.log('Goodbye!');
          connection.end();
          break;
        default:
          console.log('Invalid choice');
          startApp();
      }
    });
 // }); 
}

// Function to view all departments
function viewAllDepartments() {
  const query = 'SELECT * FROM Department';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error viewing departments:', err);
    } else {
      console.log('All Departments:');
      results.forEach((department) => {
        console.log(`- ${department.name}`);
      });
    }
    connection.release();

    startApp();
  });
}

// Function to view all roles
function viewAllRoles() {
  const query =
    'SELECT Role.id, Role.title, Role.salary, Department.name AS department FROM Role ' +
    'INNER JOIN Department ON Role.department_id = Department.id';
  connection.query(query, (err, roles) => {
    if (err) {
      console.error('Error fetching roles:', err);
    } else {
      console.log('All Roles:');
      roles.forEach((role) => {
        console.log(`ID: ${role.id}, Title: ${role.title}, Salary: ${role.salary}, Department: ${role.department}`);
      });
    }
    startApp();
  });
}

// Function to view all employees
function viewAllEmployees() {
  const query =
    'SELECT Employee.id, Employee.first_name, Employee.last_name, Role.title AS role, ' +
    'Role.salary, Department.name AS department FROM Employee ' +
    'INNER JOIN Role ON Employee.role_id = Role.id ' +
    'INNER JOIN Department ON Role.department_id = Department.id';
  connection.query(query, (err, employees) => {
    if (err) {
      console.error('Error fetching employees:', err);
    } else {
      console.log('All Employees:');
      employees.forEach((employee) => {
        console.log(`ID: ${employee.id}, Name: ${employee.first_name} ${employee.last_name}, ` +
                    `Role: ${employee.role}, Salary: ${employee.salary}, Department: ${employee.department}`);
      });
    }
    startApp();
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: "Enter the department's name:",
    })
    .then((departmentDetails) => {
      const query = 'INSERT INTO Department (name) VALUES (?)';
      connection.query(query, [departmentDetails.name], (err, results) => {
        if (err) {
          console.error('Error adding department:', err);
        } else {
          console.log(`Department "${departmentDetails.name}" added successfully.`);
        }
        startApp();
      });
    });
}

// Function to add a new role
function addRole() {
  const departmentQuery = 'SELECT * FROM Department';
  connection.query(departmentQuery, (err, departments) => {
    if (err) {
      console.error('Error fetching departments:', err);
      startApp();
      return;
    }

    const departmentChoices = departments.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });

    // Prompt user for role details
    inquirer
      .prompt([
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
        {
          type: 'list',
          name: 'department_id',
          message: "Select the department for the role:",
          choices: departmentChoices,
        },
      ])
      .then((roleDetails) => {
        const insertQuery = 'INSERT INTO Role (title, salary, department_id) VALUES (?, ?, ?)';
        const { title, salary, department_id } = roleDetails;
        connection.query(insertQuery, [title, salary, department_id], (err, results) => {
          if (err) {
            console.error('Error adding role:', err);
          } else {
            console.log(`Role "${title}" added successfully.`);
          }
          startApp();
        });
      });
  });
}

// Function to add an employee
function addEmployee() {
  const roleQuery = 'SELECT * FROM Role';
  connection.query(roleQuery, (err, roles) => {
    if (err) {
      console.error('Error fetching roles:', err);
      startApp();
      return;
    }

    const roleChoices = roles.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });

// Prompt user for employee details
inquirer
.prompt([
  {
    type: 'input',
    name: 'first_name',
    message: "Enter the employee's first name:",
  },
  {
    type: 'input',
    name: 'last_name',
    message: "Enter the employee's last name:",
  },
  {
    type: 'list',
    name: 'role_id',
    message: "Select the employee's role:",
    choices: roleChoices,
  },
])
.then((employeeDetails) => {
  const insertQuery =
    'INSERT INTO Employee (first_name, last_name, role_id) VALUES (?, ?, ?)';
  const { first_name, last_name, role_id } = employeeDetails;
  connection.query(
    insertQuery,
    [first_name, last_name, role_id],
    (err, results) => {
      if (err) {
        console.error('Error adding employee:', err);
      } else {
        console.log(`Employee "${first_name} ${last_name}" added successfully.`);
      }
      startApp();
}
        );
      });
  });
}

// Function to update an employee's role
function updateEmployeeRole() {
  const employeeQuery = 'SELECT * FROM Employee';
  connection.query(employeeQuery, (err, employees) => {
    if (err) {
      console.error('Error fetching employees:', err);
      startApp();
      return;
    }

    const employeeChoices = employees.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });

    // Prompt user to select an employee
    inquirer
      .prompt({
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to update:',
        choices: employeeChoices,
      })
      .then((answer) => {
        const employeeId = answer.employeeId;

// Retrieve roles for user to choose from
const roleQuery = 'SELECT * FROM Role';
connection.query(roleQuery, (err, roles) => {
  if (err) {
    console.error('Error fetching roles:', err);
    startApp();
    return;
  }

  const roleChoices = roles.map((role) => {
    return {
      name: role.title,
      value: role.id,
    };
  });
// Prompt user to select a new role
inquirer
.prompt({
  type: 'list',
  name: 'roleId',
  message: 'Select the new role for the employee:',
  choices: roleChoices,
})
.then((answer) => {
  const roleId = answer.roleId;

  const updateQuery = 'UPDATE Employee SET role_id = ? WHERE id = ?';
  connection.query(updateQuery, [roleId, employeeId], (err, results) => {
    if (err) {
      console.error('Error updating role:', err);
    } else {
      console.log('Employee role updated successfully.');
    }
    startApp();
  });
});
});
});
});
}

function deleteDepartment() {
  // First, prompt the user to select a department to delete
  const query = 'SELECT * FROM Department';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error viewing departments:', err);
      startApp();
      return;
    }
    
    const departmentChoices = results.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });

    inquirer
      .prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select the department to delete:',
        choices: departmentChoices,
      })
      .then((answer) => {
        const deleteQuery = 'DELETE FROM Department WHERE id = ?';
        connection.query(deleteQuery, [answer.departmentId], (err, results) => {
          if (err) {
            console.error('Error deleting department:', err);
          } else {
            console.log('Department deleted successfully.');
          }
          startApp();
        });
      });
  });
}

// Start the app
connectionPool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }

  console.log('Connected to database as id', connection.threadId);
  
  startApp(connection);
});
