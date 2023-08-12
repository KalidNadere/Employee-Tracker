const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

router.get('/', departmentController.viewAllDepartments);
router.post('/add', departmentController.addDepartment);
router.delete('/:id', departmentController.deleteDepartment);


module.exports = router;
