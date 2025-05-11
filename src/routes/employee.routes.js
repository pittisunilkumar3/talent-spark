const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');

// GET all employees with pagination and filtering
router.get('/', employeeController.getAllEmployees);

// GET employee by ID
router.get('/:id', employeeController.getEmployeeById);

// POST create new employee
router.post('/', employeeController.createEmployee);

// PUT update employee
router.put('/:id', employeeController.updateEmployee);

// DELETE employee (soft delete)
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;



