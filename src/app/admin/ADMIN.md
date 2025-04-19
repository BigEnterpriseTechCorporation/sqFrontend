# Admin Interface Documentation

## Overview

The admin interface provides authorized users with the ability to manage content on the Super Query platform. It includes functionality for creating and deleting both units and exercises.

## Admin Routes

- `/admin` - Unit management interface
- `/admin/exercises` - Exercise management interface

## Authentication and Authorization

Access to admin functions requires a valid JWT token with appropriate permissions. The token is stored in localStorage and included in all API requests.

## Unit Management

### Creating Units

The unit creation form (`/admin`) allows administrators to:

1. Enter a unit title
2. Provide a detailed description (supports Markdown formatting)
3. Submit the form to create a new unit

**Code Example:**
```typescript
const { formData, error, loading, handleChange, handleSubmit } = useAdminForm<UnitFormData>({
  initialValues: { title: '', description: '' },
  endpoint: 'Units',
  onSuccess: fetchUnits
});
```

### Deleting Units

The unit management interface displays all existing units and provides delete functionality:

1. Each unit is displayed with its title, description preview, and metadata
2. A delete button allows removal of the unit
3. Confirmation is required before deletion proceeds
4. All exercises within a deleted unit are automatically removed

**Important:** Deleting a unit is irreversible and will remove all associated exercises.

**Code Example:**
```typescript
const handleDelete = async (id: string) => {
  if (window.confirm('Are you sure you want to delete this unit?')) {
    await API.units.delete(token, id);
    fetchUnits(); // Refresh the unit list
  }
};
```

## Exercise Management

### Creating Exercises

The exercise creation form (`/admin/exercises`) allows administrators to configure complex exercises with:

1. Unit assignment (select parent unit)
2. Exercise title and description
3. Difficulty level selection
4. Exercise type configuration
5. SQL schema definition
6. Check type selection
7. Validation queries for checking user answers
8. Options for multi-choice exercises
9. Query parts for constructing exercises

**Exercise Types:**
- `SelectAnswer` (0) - Multiple choice selection
- `FillMissingWords` (1) - Fill in the blanks in SQL queries
- `ConstructQuery` (2) - Construct a query from parts
- `SimpleQuery` (3) - Write a basic SQL query
- `ComplexQuery` (4) - Write a complex SQL query

**Difficulty Levels:**
- `Easy` (0)
- `Medium` (1)
- `Hard` (2)
- `Ultra-hard` (3)

**Check Types:**
- `Compare` (0) - Direct comparison of answer with expected value
- `Select` (1) - Validates select query results
- `InsertAndSelect` (2) - Validates both insert and select operations

### Deleting Exercises

The exercise management interface displays all exercises and provides deletion functionality:

1. Each exercise is displayed with its title, description, and metadata
2. Exercises are grouped by unit
3. A delete button allows for removal of individual exercises
4. Confirmation is required before deletion proceeds

**Code Example:**
```typescript
const handleDelete = async (id: string) => {
  if (window.confirm('Are you sure you want to delete this exercise?')) {
    await API.exercises.delete(token, id);
    fetchExercises(); // Refresh the exercise list
  }
};
```

## Data Management Hooks

### useAdminForm

The `useAdminForm` hook centralizes administrative form functionality:

```typescript
const { 
  formData,         // Current form state
  setFormData,      // Form state setter
  error,            // Error message if any
  loading,          // Loading state 
  handleChange,     // Input change handler
  handleSubmit,     // Form submit handler
  handleDelete      // Delete function
} = useAdminForm<T>({
  initialValues,    // Initial form values
  endpoint,         // API endpoint ('Units' or 'Exercises')
  onSuccess         // Callback on successful operations
});
```

This hook handles:
- Form state management
- API communication
- Error handling
- Loading states
- Success callbacks

## Best Practices

1. Always confirm before deletion operations
2. Provide clear feedback to administrators about operation success/failure
3. Validate form inputs before submission
4. Use the centralized `useAdminForm` hook for all admin operations
5. Refresh data after successful create/delete operations to maintain UI consistency 