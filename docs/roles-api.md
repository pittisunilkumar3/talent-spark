# Roles API

## API URLs and Payloads

### 1. Get All Roles

**URL:** `GET http://localhost:3001/api/roles`

**Query Parameters:** `page`, `limit`, `is_active`, `is_system`, `branch_id`, `search`

**Example:** `GET http://localhost:3001/api/roles?page=1&limit=10&is_active=true&is_system=false`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Administrator",
      "slug": "administrator",
      "description": "System administrator with full access",
      "branch_id": null,
      "is_system": true,
      "priority": 100,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-05-09T10:00:00.000Z",
      "updated_at": "2023-05-09T10:00:00.000Z",
      "deleted_at": null
    },
    {
      "id": 2,
      "name": "Branch Manager",
      "slug": "branch-manager",
      "description": "Manager of a specific branch",
      "branch_id": 1,
      "is_system": false,
      "priority": 50,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-05-09T10:05:00.000Z",
      "updated_at": "2023-05-09T10:05:00.000Z",
      "deleted_at": null
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### 2. Get Role by ID

**URL:** `GET http://localhost:3001/api/roles/:id`

**Example:** `GET http://localhost:3001/api/roles/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Administrator",
    "slug": "administrator",
    "description": "System administrator with full access",
    "branch_id": null,
    "is_system": true,
    "priority": 100,
    "is_active": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-05-09T10:00:00.000Z",
    "updated_at": "2023-05-09T10:00:00.000Z",
    "deleted_at": null
  }
}
```

### 3. Create Role

**URL:** `POST http://localhost:3001/api/roles`

**Payload:**
```json
{
  "name": "Staff Member",
  "slug": "staff-member",
  "description": "Regular staff member with limited access",
  "branch_id": 2,
  "is_system": false,
  "priority": 10,
  "is_active": true,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "id": 3,
    "name": "Staff Member",
    "slug": "staff-member",
    "description": "Regular staff member with limited access",
    "branch_id": 2,
    "is_system": false,
    "priority": 10,
    "is_active": true,
    "created_by": 1,
    "created_at": "2023-05-09T10:10:00.000Z",
    "updated_at": "2023-05-09T10:10:00.000Z"
  }
}
```

### 4. Update Role

**URL:** `PUT http://localhost:3001/api/roles/:id`

**Example:** `PUT http://localhost:3001/api/roles/3`

**Payload:**
```json
{
  "name": "Senior Staff Member",
  "description": "Senior staff member with additional privileges",
  "priority": 20,
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "id": 3,
    "name": "Senior Staff Member",
    "slug": "staff-member",
    "description": "Senior staff member with additional privileges",
    "branch_id": 2,
    "is_system": false,
    "priority": 20,
    "is_active": true,
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-05-09T10:10:00.000Z",
    "updated_at": "2023-05-09T10:15:00.000Z",
    "deleted_at": null
  }
}
```

### 5. Delete Role

**URL:** `DELETE http://localhost:3001/api/roles/:id`

**Example:** `DELETE http://localhost:3001/api/roles/3`

**Response:**
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

## Full Payload Fields

**Role Create/Update Payload Fields:**
```json
{
  "name": "Role Name",
  "slug": "role-slug",
  "description": "Role description text",
  "branch_id": 1,
  "is_system": false,
  "priority": 10,
  "is_active": true,
  "created_by": 1,
  "updated_by": 1
}
```

## Notes

1. **System Roles**: Roles with `is_system` set to `true` cannot be modified or deleted.
2. **Branch Association**: Roles can be associated with a specific branch by setting the `branch_id` field.
3. **Priority**: Roles with higher priority values take precedence in case of conflicts.
4. **Soft Delete**: When a role is deleted, it is not removed from the database but marked as deleted by setting the `deleted_at` field.
5. **Pagination**: The API supports pagination with `page` and `limit` query parameters.
6. **Filtering**: You can filter roles by `is_active`, `is_system`, and `branch_id`.
7. **Search**: You can search for roles by name using the `search` query parameter.
