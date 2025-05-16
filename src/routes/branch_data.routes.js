const express = require('express');
const router = express.Router();
const branchDataController = require('../controllers/branch_data.controller');

// GET departments and designations by branch ID
router.get('/branch/:branchId/departments-designations', branchDataController.getDepartmentsAndDesignationsByBranchId);

module.exports = router;
