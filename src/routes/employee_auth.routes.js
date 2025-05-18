const express = require('express');
const router = express.Router();
const employeeAuthController = require('../controllers/employee_auth.controller');
const { authenticateEmployee } = require('../middleware/employee_auth.middleware');

// Public routes
// Employee login
router.post('/login', employeeAuthController.login);

// Refresh token
router.post('/refresh-token', employeeAuthController.refreshToken);

// Protected routes - require employee authentication
// Check if employee is active/logged in
router.get('/status', authenticateEmployee, employeeAuthController.checkStatus);

// Send login notification
router.post('/send-notification', authenticateEmployee, employeeAuthController.sendLoginNotification);

// Logout employee
router.post('/logout', authenticateEmployee, employeeAuthController.logout);

module.exports = router;
