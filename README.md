# Super Query - Educational SQL Platform

## Overview

Super Query is an educational platform designed to help users learn SQL through interactive exercises and units. The application offers a comprehensive learning experience with organized units containing various exercises.

## Architecture

The project is built with:
- **Next.js** - React framework for server-rendered applications
- **TypeScript** - Static typing for better code quality
- **Tailwind CSS** - Utility-first CSS framework

### Directory Structure

```
src/
├── app/             # Next.js pages and routing
├── assets/          # Static assets like images and SVGs
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks for data fetching and state management
├── types/           # TypeScript type definitions
└── utils/           # Utility functions including API client
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and included in API requests.

Authentication flows:
- **Registration**: Creates a new user account and returns a token
- **Login**: Authenticates an existing user and returns a token
- **Token validation**: The app validates tokens for protected routes

## API Utilities

The project uses a centralized API utility (`src/utils/api.ts`) to standardize all HTTP requests to the backend.

### API Structure

```typescript
export const API = {
  auth: {
    login: <T>(token: string, data: any) => Promise<T>,
    register: <T>(token: string, data: any) => Promise<T>,
    self: <T>(token: string) => Promise<T>
  },
  units: {
    getAll: <T>(token: string) => Promise<T>,
    getById: <T>(token: string, id: string) => Promise<T>,
    create: <T>(token: string, data: any) => Promise<T>,
    delete: <T>(token: string, id: string) => Promise<T>
  },
  exercises: {
    getByUnitId: <T>(token: string, unitId: string) => Promise<T>,
    getById: <T>(token: string, id: string) => Promise<T>,
    create: <T>(token: string, data: any) => Promise<T>,
    delete: <T>(token: string, id: string) => Promise<T>
  }
};
```

## Data Hooks

The application uses custom hooks for data fetching:

- **allUnits**: Fetches all available units
- **unitAndExercises**: Fetches a specific unit with its exercises
- **allExercises**: Fetches all exercises across all units
- **exercise**: Fetches a specific exercise
- **useAdminForm**: Handles form submissions and deletions in admin interfaces

## Admin Interface

The admin interface allows authorized users to:

1. Create new units
2. Create new exercises
3. Delete existing units
4. Delete existing exercises

### Admin Unit Management

The unit management interface allows:
- Creating units with titles and descriptions
- Viewing all existing units
- Deleting units (will also delete all exercises in that unit)

### Admin Exercise Management

The exercise management interface supports:
- Creating exercises with various configurations
- Selecting the parent unit
- Setting difficulty levels and exercise types
- Defining SQL schemas and validation queries
- Deleting exercises

## Main User Interfaces

### Units Page

The units page displays all available learning units with:
- Unit title
- Description snippet
- Exercise count
- Pagination with "Load more" functionality

### Unit Detail Page

The unit detail page shows:
- Unit title and description (with Markdown support)
- Unit metadata (creator, date)
- List of exercises within the unit

### Exercise Interface

The exercise interface includes:
- Exercise title and description
- SQL exercise environment
- Exercise-specific validation and feedback

## Type System

The application uses TypeScript with the following core types:

```typescript
// User types
export interface User {
  id: string;
  fullName: string;
  userName: string;
  role: string;
}

// Unit types
export interface Unit {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  ownerId: string;
  ownerName: string;
  exerciseCount: string;
}

export interface UnitWithExercises extends Unit {
  exercises: Exercise[];
}

// Exercise types
export interface Exercise {
  id: string;
  createdAt: string;
  updatedAt: string;
  unitId: string;
  unitTitle: string;
  title: string;
  description: string;
  difficulty: difficulty;
  type: exerciseType;
  schema: string;
  checkType: checkType;
  checkQueryInsert: string;
  checkQuerySelect: string;
  options: string;
  queryParts: string;
}
```

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Access the application at http://localhost:8081

## Development Guidelines

1. Use the centralized API utility for all backend communication
2. Follow the established patterns for data fetching and state management
3. Keep components modular and reusable
4. Add proper TypeScript types for all functions and components
