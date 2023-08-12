const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.get('/roles', roleController.getAllRoles);
router.post('/roles', roleController.addRole);
router.put('/roles/:id', roleController.updateRole);
router.delete('/roles/:id', roleController.deleteRole);

module.exports = router;
