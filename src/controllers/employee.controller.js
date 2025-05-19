const Employee = require('../models/employee.model');
const Branch = require('../models/branch.model');
const Department = require('../models/department.model');
const Designation = require('../models/designation.model');
const { dbType, Sequelize, sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

// Get all employees with pagination and filtering
exports.getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.branch_id) {
      filters.branch_id = parseInt(req.query.branch_id);
    }
    if (req.query.department_id) {
      filters.department_id = parseInt(req.query.department_id);
    }
    if (req.query.designation_id) {
      filters.designation_id = parseInt(req.query.designation_id);
    }
    if (req.query.employment_status) {
      filters.employment_status = req.query.employment_status;
    }

    // Search by name, employee_id, or email
    if (req.query.search) {
      if (dbType === 'mongodb') {
        filters.$or = [
          { first_name: { $regex: req.query.search, $options: 'i' } },
          { last_name: { $regex: req.query.search, $options: 'i' } },
          { employee_id: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ];
      } else {
        // For SQL databases, we'll handle this in the query options
      }
    }

    let employees;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await Employee.countDocuments(filters);
      employees = await Employee.find(filters)
        .select('-password') // Exclude password field
        .sort({ first_name: 1, last_name: 1 })
        .skip(offset)
        .limit(limit);
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [['first_name', 'ASC'], ['last_name', 'ASC']],
        attributes: { exclude: ['password'] }, // Exclude password field
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Department,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Designation,
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
          {
            model: Employee,
            as: 'Manager',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          }
        ]
      };

      // Add search functionality for SQL databases
      if (req.query.search) {
        const Op = Sequelize.Op;
        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: [
            { first_name: { [Op.like]: `%${req.query.search}%` } },
            { last_name: { [Op.like]: `%${req.query.search}%` } },
            { employee_id: { [Op.like]: `%${req.query.search}%` } },
            { email: { [Op.like]: `%${req.query.search}%` } }
          ]
        };
      }

      const result = await Employee.findAndCountAll(queryOptions);
      employees = result.rows;
      total = result.count;
    }

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message
    });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;
    let employee;

    if (dbType === 'mongodb') {
      employee = await Employee.findById(id).select('-password');
    } else {
      employee = await Employee.findByPk(parseInt(id), {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Department,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Designation,
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
          {
            model: Employee,
            as: 'Manager',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          },
          {
            model: Employee,
            as: 'Subordinates',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          }
        ]
      });
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee',
      error: error.message
    });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      employee_id, first_name, last_name, email, phone, password,
      gender, dob, photo, branch_id, department_id, designation_id,
      position, qualification, work_experience, hire_date,
      employment_status, contract_type, work_shift, current_location,
      reporting_to, emergency_contact, emergency_contact_relation,
      marital_status, father_name, mother_name, local_address,
      permanent_address, bank_account_name, bank_account_no,
      bank_name, bank_branch, ifsc_code, basic_salary,
      facebook, twitter, linkedin, instagram, resume,
      joining_letter, other_documents, notes, is_superadmin,
      is_active, created_by
    } = req.body;

    // Validate required fields
    if (!employee_id || !first_name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, first name, and password are required'
      });
    }

    // Check if employee with same employee_id or email already exists
    let existingEmployee;
    if (dbType === 'mongodb') {
      existingEmployee = await Employee.findOne({
        $or: [
          { employee_id },
          { email: email || '' }
        ]
      });
    } else {
      const Op = Sequelize.Op;
      existingEmployee = await Employee.findOne({
        where: {
          [Op.or]: [
            { employee_id },
            { email: email || '' }
          ]
        }
      });
    }

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this employee ID or email already exists'
      });
    }

    // Check if branch exists if branch_id is provided
    if (branch_id) {
      const branch = await Branch.findByPk(branch_id);
      if (!branch) {
        return res.status(400).json({
          success: false,
          message: 'Branch not found'
        });
      }
    }

    // Check if department exists if department_id is provided
    if (department_id) {
      const department = await Department.findByPk(department_id);
      if (!department) {
        return res.status(400).json({
          success: false,
          message: 'Department not found'
        });
      }
    }

    // Check if designation exists if designation_id is provided
    if (designation_id) {
      const designation = await Designation.findByPk(designation_id);
      if (!designation) {
        return res.status(400).json({
          success: false,
          message: 'Designation not found'
        });
      }
    }

    // Check if reporting manager exists if reporting_to is provided
    if (reporting_to) {
      const manager = await Employee.findByPk(reporting_to);
      if (!manager) {
        return res.status(400).json({
          success: false,
          message: 'Reporting manager not found'
        });
      }
    }

    // Hash password
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    let newEmployee;

    if (dbType === 'mongodb') {
      newEmployee = new Employee({
        employee_id, first_name, last_name, email, phone, password: hashedPassword,
        gender, dob, photo, branch_id, department_id, designation_id,
        position, qualification, work_experience, hire_date,
        employment_status, contract_type, work_shift, current_location,
        reporting_to, emergency_contact, emergency_contact_relation,
        marital_status, father_name, mother_name, local_address,
        permanent_address, bank_account_name, bank_account_no,
        bank_name, bank_branch, ifsc_code, basic_salary,
        facebook, twitter, linkedin, instagram, resume,
        joining_letter, other_documents, notes, is_superadmin,
        is_active, created_by
      });
      await newEmployee.save();

      // Remove password from response
      newEmployee = newEmployee.toObject();
      delete newEmployee.password;
    } else {
      try {
        // Create employee data object without id field to let the database handle auto-increment
        const employeeData = {
          employee_id, first_name, last_name, email, phone, password: hashedPassword,
          gender, dob, photo, branch_id, department_id, designation_id,
          position, qualification, work_experience, hire_date,
          employment_status, contract_type, work_shift, current_location,
          reporting_to, emergency_contact, emergency_contact_relation,
          marital_status, father_name, mother_name, local_address,
          permanent_address, bank_account_name, bank_account_no,
          bank_name, bank_branch, ifsc_code, basic_salary,
          facebook, twitter, linkedin, instagram, resume,
          joining_letter, other_documents, notes, is_superadmin,
          is_active, created_by
        };

        // Explicitly ensure id is not included
        delete employeeData.id;

        // For MySQL, use a direct approach to ensure auto-increment works
        if (dbType === 'mysql') {
          // First, check if the table exists and has the correct auto-increment setup
          await sequelize.query(`
            ALTER TABLE employees MODIFY COLUMN id INT AUTO_INCREMENT PRIMARY KEY
          `).catch(err => {
            console.log('Auto-increment already set up or table structure cannot be modified:', err.message);
          });

          // Use standard Sequelize create for MySQL as well
          newEmployee = await Employee.create(employeeData);
        } else {
          // Use Sequelize create for other database types
          newEmployee = await Employee.create(employeeData);
        }
      } catch (error) {
        console.error('Error creating employee:', error);
        // Re-throw the error to be caught by the outer try-catch
        throw error;
      }

      // Fetch the employee with relations but without password
      newEmployee = await Employee.findByPk(newEmployee.id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Department,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Designation,
            attributes: ['id', 'name', 'short_code'],
            required: false
          }
        ]
      });
    }

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: newEmployee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message
    });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_by;
    delete updateData.created_at;

    let employee;
    let updatedEmployee;

    if (dbType === 'mongodb') {
      employee = await Employee.findById(id);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // Check if employee_id or email is being changed and if it already exists
      if (updateData.employee_id || updateData.email) {
        const existingEmployee = await Employee.findOne({
          $or: [
            { employee_id: updateData.employee_id || '', _id: { $ne: id } },
            { email: updateData.email || '', _id: { $ne: id } }
          ]
        });

        if (existingEmployee) {
          return res.status(400).json({
            success: false,
            message: 'Employee with this employee ID or email already exists'
          });
        }
      }

      // If password is being updated, hash it
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Return the updated document
      ).select('-password');
    } else {
      employee = await Employee.findByPk(parseInt(id));

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // Check if employee_id or email is being changed and if it already exists
      if (updateData.employee_id || updateData.email) {
        const Op = Sequelize.Op;
        const existingEmployee = await Employee.findOne({
          where: {
            [Op.or]: [
              { employee_id: updateData.employee_id || '' },
              { email: updateData.email || '' }
            ],
            id: { [Op.ne]: parseInt(id) }
          }
        });

        if (existingEmployee) {
          return res.status(400).json({
            success: false,
            message: 'Employee with this employee ID or email already exists'
          });
        }
      }

      await employee.update(updateData);
      updatedEmployee = await Employee.findByPk(parseInt(id), {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Department,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Designation,
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
          {
            model: Employee,
            as: 'Manager',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message
    });
  }
};

// Delete employee (soft delete by setting is_active to false)
exports.deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    let employee;

    if (dbType === 'mongodb') {
      employee = await Employee.findById(id);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // Check if employee has subordinates
      const hasSubordinates = await Employee.findOne({ reporting_to: id });
      if (hasSubordinates) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete employee with subordinates. Please reassign subordinates first.'
        });
      }

      // Soft delete by setting is_active to false
      await Employee.findByIdAndUpdate(id, {
        is_active: false,
        date_of_leaving: new Date()
      });
    } else {
      employee = await Employee.findByPk(parseInt(id));

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // Check if employee has subordinates
      const subordinates = await Employee.count({
        where: { reporting_to: parseInt(id) }
      });

      if (subordinates > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete employee with subordinates. Please reassign subordinates first.'
        });
      }

      // Soft delete by setting is_active to false
      await employee.update({
        is_active: false,
        date_of_leaving: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message
    });
  }
};
