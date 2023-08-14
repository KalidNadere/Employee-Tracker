const inquirer = require('inquirer');
const connection = require('./util/database'); // importing Mysql connection

// Function to start the app
function startApp() {

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
        'View Employees by Manager',
        'View Employees by Department',
        'Delete Department',
        'Delete Role',
        'Delete Employee',
        'View Total Utilized Budget of a Department',
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
        case 'View Employees by Manager':
          viewEmployeesByManager();
          break;
        case 'View Employees by Department':
          viewEmployeesByDepartment();
          break;
        case 'Delete Department':
          deleteDepartment();
          break;
        case 'Delete Role':
          deleteRole();
          break;
        case 'Delete Employee':
          deleteEmployee();
          break;
        case 'View Total Utilized Budget of a Department':
          calculateDepartmentBudget();
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
}

// Function to view all departments
async function viewAllDepartments() {
  try {
    const query = 'SELECT * FROM Department';
    const [results] = await connection.query(query);
    
    console.table(results)

   startApp()
  } catch (err) {
    console.error('Error viewing departments:', err);
  }
}

// function to view all roles
async function viewAllRoles() {
  try {
    const query = 
    'SELECT Role.id, Role.title, Department.name AS department, Role.salary FROM Role LEFT JOIN Department ON Role.department_id = Department.id';

    const [data] = await connection.query(query)
    
    console.table(data);

    startApp()
  } catch (err) {
   console.error(err)
  }
}

// Function to view all employees
async function viewAllEmployees() {
  try {
    const query =
      'SELECT E.id, E.first_name, E.last_name, R.title AS role, ' +
      'R.salary, D.name AS department, ' +
      'CONCAT(M.first_name, " ", M.last_name) AS manager ' +
      'FROM Employee AS E ' +
      'INNER JOIN Role AS R ON E.role_id = R.id ' +
      'INNER JOIN Department AS D ON R.department_id = D.id ' +
      'LEFT JOIN Employee AS M ON E.manager_id = M.id';

    const [data] = await connection.query(query);

    console.table(data);

    startApp();
  } catch (err) {
    console.error(err);
  }
}

// Function to add a department
async function addDepartment() {
  try {
    const departmentDetails = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: "Enter the department's name:",
    });

    const insertQuery = 'INSERT INTO Department (name) VALUES (?)';
    await connection.query(insertQuery, [departmentDetails.name]);

    console.log(`Department "${departmentDetails.name}" added successfully.`);
    startApp();
  } catch (err) {
    console.error('Error adding department:', err);
  }
}

// Function to add a new role
async function addRole() {
  try {
    const departments = await connection.query('SELECT * FROM Department');
    const departmentChoices = departments[0].map((department) => ({
      name: department.name,
      value: department.id,
    }));

    const roleDetails = await inquirer.prompt([
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
    ]);

    const insertQuery =
      'INSERT INTO Role (title, salary, department_id) VALUES (?, ?, ?)';
    await connection.query(insertQuery, [
      roleDetails.title,
      roleDetails.salary,
      roleDetails.department_id,
    ]);

    console.log(`Role "${roleDetails.title}" added successfully.`);
    startApp();
  } catch (err) {
    console.error('Error adding role:', err);
  }
}

// Function to add an employee
async function addEmployee() {
  try {
    const roles = await connection.query('SELECT * FROM Role');
    const roleChoices = roles[0].map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const employees = await connection.query('SELECT * FROM Employee');
    const managerChoices = employees[0].map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    const employeeDetails = await inquirer.prompt([
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
      {
        type: 'list',
        name: 'manager_id',
        message: "Select the employee's manager:",
        choices: managerChoices,
      },
    ]);

    const insertQuery =
      'INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    await connection.query(insertQuery, [
      employeeDetails.first_name,
      employeeDetails.last_name,
      employeeDetails.role_id,
      employeeDetails.manager_id,
    ]);

    console.log(
      `Employee "${employeeDetails.first_name} ${employeeDetails.last_name}" added successfully.`
    );
    startApp();
  } catch (err) {
    console.error('Error adding employee:', err);
  }
}

// Function to update an employee's role
async function updateEmployeeRole() {
  try {
    const employeeQuery = 'SELECT * FROM Employee';
    const [employees] = await connection.query(employeeQuery);

    const employeeChoices = employees.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });

    inquirer
      .prompt({
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to update:',
        choices: employeeChoices,
      })
      .then(async (employeeAnswer) => {
        const employeeId = employeeAnswer.employeeId;

        const roleQuery = 'SELECT * FROM Role';
        const [roles] = await connection.query(roleQuery);

        const roleChoices = roles.map((role) => {
          return {
            name: role.title,
            value: role.id,
          };
        });

        inquirer
          .prompt({
            type: 'list',
            name: 'roleId',
            message: 'Select the new role for the employee:',
            choices: roleChoices,
          })
          .then(async (roleAnswer) => {
            const roleId = roleAnswer.roleId;

            const updateQuery = 'UPDATE Employee SET role_id = ? WHERE id = ?';
            await connection.query(updateQuery, [roleId, employeeId]);

            console.log('Employee role updated successfully.');
            startApp();
          });
      });
  } catch (err) {
    console.error('Error updating employee role:', err);
    startApp();
  }
}

// Function to update an employee's manager
async function updateEmployeeManager() {
  try {
    const employeeQuery = 'SELECT * FROM Employee';
    const [employees] = await connection.query(employeeQuery);

    const employeeChoices = employees.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee to update:',
          choices: employeeChoices,
        },
        {
          type: 'list',
          name: 'managerId',
          message: 'Select the new manager for the employee:',
          choices: employeeChoices,
        },
      ])
      .then(async (answers) => {
        const { employeeId, managerId } = answers;

        const updateQuery = 'UPDATE Employee SET manager_id = ? WHERE id = ?';
        await connection.query(updateQuery, [managerId, employeeId]);

        console.log('Employee manager updated successfully.');
        startApp();
      });
  } catch (err) {
    console.error('Error updating employee manager:', err);
    startApp();
  }
}

// Function to view employees by manager
async function viewEmployeesByManager() {
  try {
    const managerQuery = 'SELECT DISTINCT manager_id FROM Employee WHERE manager_id IS NOT NULL';
    const [managers] = await connection.query(managerQuery);

    console.table(managers);

    const managerChoices = managers.map((manager) => {
      return {
        name: `ID: ${manager.manager_id}`,
        value: manager.manager_id,
      };
    });

    inquirer
      .prompt({
        type: 'list',
        name: 'managerId',
        message: 'Select a manager to view their employees:',
        choices: managerChoices,
      })
      .then(async (answer) => {
        const managerInfoQuery = 'SELECT first_name, last_name FROM Employee WHERE id = ?';
        const [managerInfo] = await connection.query(managerInfoQuery, [answer.managerId]);
        const managerName = `${managerInfo[0].first_name} ${managerInfo[0].last_name}`;

        const query =
          'SELECT Employee.id, Employee.first_name, Employee.last_name, Role.title AS role ' +
          'FROM Employee ' +
          'INNER JOIN Role ON Employee.role_id = Role.id ' +
          'WHERE Employee.manager_id = ?';
        const [employees] = await connection.query(query, [answer.managerId]);

        console.table(employees);

        console.log(`Employees managed by Manager ${managerName} (ID: ${answer.managerId}):`);
        employees.forEach((employee) => {
          console.log(`ID: ${employee.id}, Name: ${employee.first_name} ${employee.last_name}, Role: ${employee.role}`);
        });

        startApp();
      });
  } catch (err) {
    console.error('Error viewing employees by manager:', err);
    startApp();
  }
}

// View employees by Department
async function viewEmployeesByDepartment() {
  try {
    const departmentQuery = 'SELECT * FROM Department';
    const [departments] = await connection.query(departmentQuery);

    console.table(departments);

    const departmentChoices = departments.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });

    inquirer
      .prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to view employees:',
        choices: departmentChoices,
      })
      .then(async (answer) => {
        const departmentInfoQuery = 'SELECT name FROM Department WHERE id = ?';
        const [departmentInfo] = await connection.query(departmentInfoQuery, [answer.departmentId]);
        const departmentName = departmentInfo[0].name;

        const query =
          'SELECT Employee.id, Employee.first_name, Employee.last_name, Role.title AS role ' +
          'FROM Employee ' +
          'INNER JOIN Role ON Employee.role_id = Role.id ' +
          'WHERE Role.department_id = ?';
        const [employees] = await connection.query(query, [answer.departmentId]);
        
        console.table(employees);

        console.log(`Employees in Department "${departmentName}":`);
        employees.forEach((employee) => {
          console.log(`ID: ${employee.id}, Name: ${employee.first_name} ${employee.last_name}, Role: ${employee.role}`);
        });

        startApp();
      });
  } catch (err) {
    console.error('Error viewing employees by department:', err);
    startApp();
  }
}

// function delete Department
  async function deleteDepartment() {
    try {
      const departments = await connection.query('SELECT * FROM Department');
      const departmentChoices = departments[0].map((department) => ({
        name: department.name,
        value: department.id,
      }));
  
      const selectedDepartment = await inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select the department to delete:',
        choices: departmentChoices,
      });
  
      const deleteQuery = 'DELETE FROM Department WHERE id = ?';
      await connection.query(deleteQuery, [selectedDepartment.departmentId]);
  
      console.log('Department deleted successfully.');
      startApp();
    } catch (err) {
      console.error('Error deleting department:', err);
    }
  }

// Function to delete Role
  async function deleteRole() {
  try {
    const roles = await connection.query('SELECT * FROM Role');
    const roleChoices = roles[0].map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const selectedRole = await inquirer.prompt({
      type: 'list',
      name: 'roleId',
      message: 'Select the role to delete:',
      choices: roleChoices,
    });

    const deleteQuery = 'DELETE FROM Role WHERE id = ?';
    await connection.query(deleteQuery, [selectedRole.roleId]);

    console.log('Role deleted successfully.');
    startApp();
  } catch (err) {
    console.error('Error deleting role:', err);
  }
}

  // Function to delete an employee
async function deleteEmployee() {
  try {
    const employees = await connection.query('SELECT * FROM Employee');
    const employeeChoices = employees[0].map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    const selectedEmployee = await inquirer.prompt({
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to delete:',
      choices: employeeChoices,
    });

    const deleteQuery = 'DELETE FROM Employee WHERE id = ?';
    await connection.query(deleteQuery, [selectedEmployee.employeeId]);

    console.log('Employee deleted successfully.');
    startApp();
  } catch (err) {
    console.error('Error deleting employee:', err);
  }
}

// Functin to view total utilized budget of a department
async function calculateDepartmentBudget() {
  try {
    const departmentQuery = 'SELECT * FROM Department';
    const departments = await connection.query(departmentQuery);

    // Prompt user to select a department
    const departmentChoices = departments[0].map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });

    const selectedDepartment = await inquirer.prompt({
      type: 'list',
      name: 'departmentId',
      message: 'Select the department to calculate the budget:',
      choices: departmentChoices,
    });

    const departmentId = selectedDepartment.departmentId;

    // Calculate the total utilized budget
    const budgetQuery = `
      SELECT SUM(Role.salary) AS total_budget
      FROM Employee
      INNER JOIN Role ON Employee.role_id = Role.id
      WHERE Role.department_id = ?
    `;

    const result = await connection.query(budgetQuery, [departmentId]);

    const totalBudget = result[0][0].total_budget;

    if (totalBudget === null) {
      console.log('No data available for the selected department.');
    } else {
      console.log(`Total Utilized Budget for the department: $${totalBudget}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    startApp();
  }
}

  startApp();