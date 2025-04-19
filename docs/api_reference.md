# Super Query API Reference

This document provides a comprehensive reference for the Super Query platform API, including backend endpoints and how they're utilized in the frontend implementation.

## Base URLs

- Development: `http://localhost:port/`
- Production: `https://rpi.tail707b9c.ts.net/api/v1/`

## Authentication

The API uses JWT Bearer authentication. All protected endpoints require:

```
Authorization: Bearer your_token_here
```

**Frontend Implementation:**
- Tokens are stored in localStorage
- The centralized API utility in `src/utils/api.ts` automatically includes tokens in requests
- Auth status is managed through React hooks (`login`, `register`, `self`)

## Resource: Authentication

### Endpoints

#### Register

```
POST /Account/register
```

Creates a new user account.

**Request Body:**
```json
{
  "UserName": "johndoe",
  "FullName": "John Doe",
  "Password": "SecurePassword123"
}
```

**Response:**
```json
{
  "Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "Role": "User",
  "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Frontend Implementation:**
- Used by the `register` hook in `src/hooks/register.ts`
- Integrated with registration form in auth components

#### Login

```
POST /Account/login
```

Authenticates a user and returns an access token.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "Role": "User",
  "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Frontend Implementation:**
- Used by the `login` hook in `src/hooks/login.ts`
- Integrated with login form in auth components

#### Get Current User

```
GET /Account/self
```

Returns the currently authenticated user's information.

**Response:**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "userName": "johndoe",
  "fullName": "John Doe",
  "email": "johndoe@localhost",
  "role": "User"
}
```

**Frontend Implementation:**
- Used by the `self` hook in `src/hooks/self.ts`
- Used for user profile information and permission checks

## Resource: Units

Units are collections of exercises that organize learning material.

### Endpoints

#### Get All Units

```
GET /api/units
```

Returns a list of all units.

**Response:**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "createdAt": "2023-05-20T10:00:00Z",
    "updatedAt": "2023-05-21T15:30:00Z",
    "title": "SQL Basics",
    "description": "Learn the basics of SQL",
    "ownerId": "3fa85f64-5717-4562-b3fc-2c963f66afb7",
    "ownerName": "John Doe",
    "exerciseCount": 5
  },
  ...
]
```

**Frontend Implementation:**
- Used by the `allUnits` hook in `src/hooks/allUnits.ts`
- Displayed on the main units page (`src/app/units/page.tsx`)

#### Get Unit By ID

```
GET /api/units/{id}
```

Returns details of a specific unit with its exercises.

**Parameters:**
- `id` (path, guid, required): Unit ID

**Response:** Unit object with exercises array

**Frontend Implementation:**
- Used by the `unitAndExercises` hook in `src/hooks/unitAndExercises.ts`
- Displayed on unit detail pages

#### Create Unit

```
POST /api/units
```

Creates a new unit.

**Request Body:**
```json
{
  "title": "SQL Basics",
  "description": "Learn the basics of SQL"
}
```

**Frontend Implementation:**
- Used in the admin interface (`src/app/admin/page.tsx`)
- Integrated with the `useAdminForm` hook

#### Delete Unit

```
DELETE /api/units/{id}
```

Deletes a unit.

**Parameters:**
- `id` (path, guid, required): Unit ID

**Frontend Implementation:**
- Used in the admin interface
- Deletion functionality integrated with unit management

## Resource: Exercises

Exercises are SQL challenges with different types and difficulty levels.

### Exercise Types

The API supports 5 types of exercises:

1. `SelectAnswer` (0) - Multiple-choice question
2. `FillMissingWords` (1) - Fill in missing parts in a SQL query
3. `ConstructQuery` (2) - Build a query from given parts
4. `SimpleQuery` (3) - Write a simple SQL query from scratch
5. `ComplexQuery` (4) - Write a complex SQL query from scratch

### Endpoints

#### Get All Exercises

```
GET /api/exercises
```

Returns a list of all exercises.

**Frontend Implementation:**
- Used by the `allExercises` hook in `src/hooks/allExercises.ts`
- Used in admin exercise management

#### Get Exercise By ID

```
GET /api/exercises/{id}
```

Returns details of a specific exercise.

**Parameters:**
- `id` (path, guid, required): Exercise ID

**Frontend Implementation:**
- Used by the `exercise` hook in `src/hooks/exercise.ts`
- Used for displaying individual exercises

#### Create Exercise

```
POST /api/exercises
```

Creates a new exercise.

**Request Body:** Varies by exercise type (see API Documentation)

**Frontend Implementation:**
- Used in the admin exercises interface (`src/app/admin/exercises/page.tsx`)
- Integrated with the `useAdminForm` hook

#### Delete Exercise

```
DELETE /api/exercises/{id}
```

Deletes an exercise.

**Parameters:**
- `id` (path, guid, required): Exercise ID

**Frontend Implementation:**
- Used in the admin exercises interface
- Deletion functionality integrated with exercise management

## Admin Endpoints

The API includes several administrative endpoints for managing users, units, and exercises. These endpoints require admin authorization.

### User Management

- `GET /api/admin/users` - Get all users (paginated)
- `PUT /api/admin/users/{id}/role` - Update user role
- `PUT /api/admin/users/{id}/status` - Toggle user active status

### Unit Management (Admin)

- `GET /api/admin/units` - Get all units (paginated)
- `PUT /api/admin/units/{id}/status` - Toggle unit active status
- `DELETE /api/admin/units/{id}` - Delete unit (admin override)

### Exercise Management (Admin)

- `GET /api/admin/exercises` - Get all exercises (paginated)
- `PUT /api/admin/exercises/{id}/status` - Toggle exercise active status
- `DELETE /api/admin/exercises/{id}` - Delete exercise (admin override)

**Frontend Implementation:**
- Admin functionality is implemented in the admin interface
- Uses the centralized API utility for consistent request handling

## Exercise Solutions

Endpoints for tracking user progress on exercises.

### Submit Solution

```
POST /api/ExerciseSolutions/{exerciseId}
```

Submit a solution for an exercise and verify if it's correct.

### Get User Statistics

```
GET /api/ExerciseSolutions/stats
```

Get statistics about the current user's progress.

### Get Solved/Unsolved Exercises

```
GET /api/ExerciseSolutions/solved
GET /api/ExerciseSolutions/unsolved
```

Get lists of exercises the user has solved or not yet solved.

## Unit Likes

Endpoints for managing user preferences for units.

### Toggle Like for a Unit

```
POST /api/units/{unitId}/likes
```

Like or unlike a unit (toggles the current state).

### Get Like Status for a Unit

```
GET /api/units/{unitId}/likes
```

Check if the current user has liked a specific unit.

## Data Models

For detailed information on data models and types, refer to:
- The TypeScript types in `src/types`
- The full API Documentation

## Frontend Integration

The Super Query frontend integrates with this API through:

1. **Centralized API Utility** (`src/utils/api.ts`)
   - Standardized error handling
   - Type-safe requests
   - Authentication management

2. **Custom React Hooks** (`src/hooks/`)
   - Data fetching abstraction
   - State management
   - Loading and error states

3. **Admin Interface** (`src/app/admin/`)
   - Content management
   - Form handling
   - Deletion confirmation

For more detailed information on the frontend implementation, refer to:
- API Utility Documentation: `src/utils/api.md`
- Hooks Documentation: `src/hooks/HOOKS.md`
- Admin Interface Documentation: `src/app/admin/ADMIN.md` 