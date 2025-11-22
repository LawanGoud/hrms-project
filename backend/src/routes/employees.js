const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { listEmployees, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');

router.use(authMiddleware);

router.get('/', listEmployees);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
