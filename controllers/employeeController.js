const { Employee } = require('../models/Employee');
const inquirer = require('inquirer');

const employeeController = {
  getAllEmployees: async (req, res) => {
    try {
      const employees = await Employee.findAll();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getEmployeeById: async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id);
      
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }

      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  addEmployee: async (req, res) => {
    try {
      const departments = await Department.findAll();
      const departmentChoices = departments.map((department) => {
        return {
          name: department.name,
          value: department.id,
        };
      });
  
      const employeeDetails = await inquirer.prompt([
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
          name: 'departmentId',
          message: "Select the employee's department:",
          choices: departmentChoices,
        },
      ]);
  
      const newEmployee = await Employee.create({
        firstName: employeeDetails.firstName,
        lastName: employeeDetails.lastName,
        departmentId: employeeDetails.departmentId,
      });
  
      res.json(newEmployee);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  updateEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id);
  
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
  
      const updatedDetails = await inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: "Enter the employee's updated first name:",
          default: employee.firstName,
        },
        {
          type: 'input',
          name: 'lastName',
          message: "Enter the employee's updated last name:",
          default: employee.lastName,
        },
      ]);
  
      await Employee.update(
        {
          firstName: updatedDetails.firstName,
          lastName: updatedDetails.lastName,
        },
        { where: { id } }
      );
  
      res.json({ message: 'Employee updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  deleteEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id);
  
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
  
      await Employee.destroy({ where: { id } });
  
      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
};

module.exports = employeeController;