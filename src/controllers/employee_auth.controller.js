const Employee = require('../models/employee.model');
const { dbType, Sequelize } = require('../config/database');
const { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken } = require('../config/jwt.config');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

/**
 * Employee login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find employee by email
    let employee;
    if (dbType === 'mongodb') {
      employee = await Employee.findOne({ email });
    } else {
      employee = await Employee.findOne({ where: { email } });
    }

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if employee is active
    if (!employee.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive. Please contact the administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const tokenPayload = {
      id: dbType === 'mongodb' ? employee._id : employee.id,
      type: 'employee'
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Update last login time
    if (dbType === 'mongodb') {
      await Employee.findByIdAndUpdate(employee._id, {
        $set: { last_login: new Date() }
      });

      // Remove sensitive data
      employee = employee.toObject();
      delete employee.password;
    } else {
      await Employee.update(
        { last_login: new Date() },
        { where: { id: employee.id } }
      );

      // Fetch employee without sensitive data
      employee = await Employee.findByPk(employee.id, {
        attributes: { exclude: ['password'] }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        employee,
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error during employee login:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * Refresh token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token and generate new tokens
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded || decoded.type !== 'employee') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const token = generateToken({ id: decoded.id, type: 'employee' });
    const newRefreshToken = generateRefreshToken({ id: decoded.id, type: 'employee' });

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: error.message
    });
  }
};

/**
 * Check if employee is active/logged in
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkStatus = async (req, res) => {
  try {
    // Employee is already authenticated via middleware
    const employee = req.employee;

    return res.status(200).json({
      success: true,
      message: 'Employee is active and authenticated',
      data: {
        employee: {
          id: dbType === 'mongodb' ? employee._id : employee.id,
          employee_id: employee.employee_id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          is_active: employee.is_active,
          is_superadmin: employee.is_superadmin,
          last_login: employee.last_login
        }
      }
    });
  } catch (error) {
    console.error('Error checking employee status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check employee status',
      error: error.message
    });
  }
};

/**
 * Send login notification
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.sendLoginNotification = async (req, res) => {
  try {
    const { id } = req.employee;
    const { notification_type = 'email' } = req.body;

    // Find employee
    let employee;
    if (dbType === 'mongodb') {
      employee = await Employee.findById(id);
    } else {
      employee = await Employee.findByPk(id);
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Generate notification ID for tracking
    const notificationId = crypto.randomBytes(16).toString('hex');

    // In a real implementation, you would send an actual notification here
    // This could be an email, SMS, or push notification
    // For now, we'll just simulate the notification

    // Update employee record with notification info
    const notificationData = {
      last_notification_sent: new Date(),
      last_notification_type: notification_type,
      last_notification_id: notificationId
    };

    if (dbType === 'mongodb') {
      await Employee.findByIdAndUpdate(id, { $set: notificationData });
    } else {
      await Employee.update(notificationData, { where: { id } });
    }

    return res.status(200).json({
      success: true,
      message: `Login notification sent via ${notification_type}`,
      data: {
        notification_id: notificationId,
        notification_type,
        sent_at: new Date()
      }
    });
  } catch (error) {
    console.error('Error sending login notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send login notification',
      error: error.message
    });
  }
};

/**
 * Logout employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.logout = async (req, res) => {
  try {
    const { id } = req.employee;

    // Update last logout time
    const logoutData = {
      last_logout: new Date()
    };

    if (dbType === 'mongodb') {
      await Employee.findByIdAndUpdate(id, { $set: logoutData });
    } else {
      await Employee.update(logoutData, { where: { id } });
    }

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};
