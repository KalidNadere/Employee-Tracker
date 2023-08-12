const { Role } = require('./../models/Role');
const Department = require('./../models/Department');
const inquirer = require('inquirer');

const roleController = {

  getAllRoles: async (req, res) => {
    try {
      const roles = await Role.findAll();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  addRole: async () => {
    try {
      const departments = await Department.findAll();

      if (departments.length === 0) {
        console.log('No departments found. Please add a department first.');
        return;
      }

      const departmentChoices = departments.map((department) => {
        return {
          name: department.departmentName,
          value: department.id,
        };
      });

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

      const newRole = await Role.create(roleDetails);

      console.log(`Role "${newRole.title}" added successfully.`);
    } catch (error) {
      console.error('Error adding role:', error);
    }
  },

  updateRole: async (req, res) => {
    try {
      const roleId = req.params.id;
      // Implement the logic to update the role based on roleId
      res.json({ message: 'Role updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteRole: async (req, res) => {
    try {
      const roleId = req.params.id;
      const role = await Role.findByPk(roleId);

      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      await role.destroy();
      res.json({ message: 'Role deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

};

module.exports = roleController;
