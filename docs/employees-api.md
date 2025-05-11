# Employees API

## API URLs and Payloads

### 1. Get All Employees

**URL:** `GET http://localhost:3001/api/employees`

**Query Parameters:** `page`, `limit`, `is_active`, `branch_id`, `department_id`, `designation_id`, `employment_status`, `search`

**Example:** `GET http://localhost:3001/api/employees?page=1&limit=10&is_active=true&branch_id=1&department_id=2`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employee_id": "EMP001",
      "first_name": "Admin",
      "last_name": "User",
      "email": "admin@talentspark.com",
      "phone": "+1-123-456-7890",
      "gender": "male",
      "dob": "1985-01-15",
      "photo": null,
      "branch_id": 1,
      "department_id": null,
      "designation_id": 1,
      "Designation": {
        "id": 1,
        "name": "CEO",
        "short_code": "CEO"
      },
      "position": "Admin",
      "employment_status": "full-time",
      "is_superadmin": true,
      "is_active": true,
      "created_at": "2023-05-10T10:00:00.000Z",
      "updated_at": "2023-05-10T10:00:00.000Z",
      "Branch": {
        "id": 1,
        "name": "Head Office"
      },
      "Department": null,
      "Manager": null
    },
    {
      "id": 2,
      "employee_id": "EMP002",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@talentspark.com",
      "phone": "+1-123-456-7891",
      "gender": "male",
      "dob": "1980-05-20",
      "photo": null,
      "branch_id": 1,
      "department_id": 1,
      "designation_id": 3,
      "Designation": {
        "id": 3,
        "name": "HR Manager",
        "short_code": "HRM"
      },
      "position": "Manager",
      "employment_status": "full-time",
      "is_superadmin": false,
      "is_active": true,
      "created_at": "2023-05-10T10:05:00.000Z",
      "updated_at": "2023-05-10T10:05:00.000Z",
      "Branch": {
        "id": 1,
        "name": "Head Office"
      },
      "Department": {
        "id": 1,
        "name": "Human Resources"
      },
      "Manager": {
        "id": 1,
        "employee_id": "EMP001",
        "first_name": "Admin",
        "last_name": "User"
      }
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### 2. Get Employee by ID

**URL:** `GET http://localhost:3001/api/employees/:id`

**Example:** `GET http://localhost:3001/api/employees/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "employee_id": "EMP001",
    "first_name": "Admin",
    "last_name": "User",
    "email": "admin@talentspark.com",
    "phone": "+1-123-456-7890",
    "gender": "male",
    "dob": "1985-01-15",
    "photo": null,
    "branch_id": 1,
    "department_id": null,
    "designation_id": 1,
    "Designation": {
      "id": 1,
      "name": "CEO",
      "short_code": "CEO"
    },
    "position": "Admin",
    "qualification": null,
    "work_experience": null,
    "hire_date": "2020-01-01",
    "date_of_leaving": null,
    "employment_status": "full-time",
    "contract_type": null,
    "work_shift": null,
    "current_location": null,
    "reporting_to": null,
    "emergency_contact": null,
    "emergency_contact_relation": null,
    "marital_status": null,
    "father_name": null,
    "mother_name": null,
    "local_address": null,
    "permanent_address": null,
    "bank_account_name": null,
    "bank_account_no": null,
    "bank_name": null,
    "bank_branch": null,
    "ifsc_code": null,
    "basic_salary": null,
    "facebook": null,
    "twitter": null,
    "linkedin": null,
    "instagram": null,
    "resume": null,
    "joining_letter": null,
    "other_documents": null,
    "notes": null,
    "is_superadmin": true,
    "is_active": true,
    "created_by": null,
    "created_at": "2023-05-10T10:00:00.000Z",
    "updated_at": "2023-05-10T10:00:00.000Z",
    "Branch": {
      "id": 1,
      "name": "Head Office"
    },
    "Department": null,
    "Manager": null,
    "Subordinates": [
      {
        "id": 2,
        "employee_id": "EMP002",
        "first_name": "John",
        "last_name": "Doe"
      }
    ]
  }
}
```

### 3. Create Employee

**URL:** `POST http://localhost:3001/api/employees`

**Payload:**
```json
{
  "employee_id": "EMP004",
  "first_name": "Robert",
  "last_name": "Johnson",
  "email": "robert.johnson@talentspark.com",
  "phone": "+1-123-456-7893",
  "password": "employee123",
  "gender": "male",
  "dob": "1988-11-25",
  "branch_id": 1,
  "department_id": 3,
  "designation_id": 4,
  "position": "Staff",
  "employment_status": "full-time",
  "hire_date": "2023-05-10",
  "reporting_to": 2,
  "is_active": true,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 4,
    "employee_id": "EMP004",
    "first_name": "Robert",
    "last_name": "Johnson",
    "email": "robert.johnson@talentspark.com",
    "phone": "+1-123-456-7893",
    "gender": "male",
    "dob": "1988-11-25",
    "branch_id": 1,
    "department_id": 3,
    "designation_id": 4,
    "Designation": {
      "id": 4,
      "name": "Software Engineer",
      "short_code": "SE"
    },
    "position": "Staff",
    "employment_status": "full-time",
    "hire_date": "2023-05-10",
    "reporting_to": 2,
    "is_superadmin": false,
    "is_active": true,
    "created_by": 1,
    "created_at": "2023-05-10T10:15:00.000Z",
    "updated_at": "2023-05-10T10:15:00.000Z",
    "Branch": {
      "id": 1,
      "name": "Head Office"
    },
    "Department": {
      "id": 3,
      "name": "Information Technology"
    }
  }
}
```

### 4. Update Employee

**URL:** `PUT http://localhost:3001/api/employees/:id`

**Example:** `PUT http://localhost:3001/api/employees/4`

**Payload:**
```json
{
  "designation_id": 5,
  "position": "Team Lead",
  "basic_salary": 75000.00,
  "work_shift": "9 AM - 6 PM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": 4,
    "employee_id": "EMP004",
    "first_name": "Robert",
    "last_name": "Johnson",
    "email": "robert.johnson@talentspark.com",
    "phone": "+1-123-456-7893",
    "gender": "male",
    "dob": "1988-11-25",
    "branch_id": 1,
    "department_id": 3,
    "designation_id": 5,
    "Designation": {
      "id": 5,
      "name": "Senior Software Engineer",
      "short_code": "SSE"
    },
    "position": "Team Lead",
    "employment_status": "full-time",
    "work_shift": "9 AM - 6 PM",
    "basic_salary": 75000.00,
    "reporting_to": 2,
    "is_superadmin": false,
    "is_active": true,
    "created_by": 1,
    "created_at": "2023-05-10T10:15:00.000Z",
    "updated_at": "2023-05-10T10:20:00.000Z",
    "Branch": {
      "id": 1,
      "name": "Head Office"
    },
    "Department": {
      "id": 3,
      "name": "Information Technology"
    },
    "Manager": {
      "id": 2,
      "employee_id": "EMP002",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

### 5. Delete Employee

**URL:** `DELETE http://localhost:3001/api/employees/:id`

**Example:** `DELETE http://localhost:3001/api/employees/4`

**Response:**
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

## Notes

1. **Password Handling**: Passwords are automatically hashed before storing in the database.
2. **Unique Constraints**: Employee ID and email must be unique.
3. **Relationships**:
   - Employees belong to a branch (optional)
   - Employees belong to a department (optional)
   - Employees belong to a designation (optional)
   - Employees can have a reporting manager (optional)
   - Employees can have subordinates
4. **Soft Delete**: When an employee is deleted, they are not removed from the database but marked as inactive by setting `is_active` to false and setting the `date_of_leaving` field.
5. **Validation**: An employee cannot be deleted if they have subordinates reporting to them.
6. **Superadmin**: Employees with `is_superadmin` set to true have access to all branches.
7. **Search**: You can search for employees by first name, last name, employee ID, or email using the `search` query parameter.
8. **Pagination**: The API supports pagination with `page` and `limit` query parameters.
9. **Filtering**: You can filter employees by `is_active`, `branch_id`, `department_id`, `designation_id`, and `employment_status`.

## Required Fields for Creating an Employee

- `employee_id`: Unique identifier for the employee
- `first_name`: Employee's first name
- `password`: Employee's password (will be hashed)

## Optional Fields

All other fields are optional. See the database schema for the complete list of fields.
