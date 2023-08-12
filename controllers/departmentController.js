const Department = require('./../models/Department');

const departmentController = {
  getAllDepartments: async (req, res) => {
    try {
      const departments = await Department.findAll();
      res.json(departments);
    } catch (error) {
      console.error('Error fetching all departments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  viewAllDepartments: async () => {
    try {
      const departments = await Department.findAll();
      if (departments.length === 0) {
        console.log('No departments found.');
        return;
      }

      console.log('List of Departments:');
    console.table(departments, ['id', 'departmentName']);
  } catch (error) {
    console.error('Error viewing all departments:', error);
  }
},

addDepartment: async (req, res) => {
  try {
    const { departmentName } = req.body;
    const newDepartment = await Department.create({ departmentName });
    console.log(`Department '${departmentName}' added successfully.`);
    res.json(newDepartment);
  } catch (error) {
    console.error('Error adding department:', error);
    res.status(500).json({ error: 'Failed to add department' });
  }
},


  deleteDepartment: async (req, res) => {
    try {
      const departmentId = req.params.id;
      
      const deletedDepartment = await Department.destroy({ where: { id: departmentId } });
      
      if (deletedDepartment === 0) {
        return res.status(404).json({ error: 'Department not found' });
      }

      res.json({ message: 'Department deleted successfully' });
    } catch (error) {
      console.error('Error deleting department:', error);
      res.status(500).json({ error: 'Failed to delete department' });
    }
  },

};

module.exports = departmentController;
