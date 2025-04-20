# Super Query - SQL Learning Platform

A modern, interactive SQL training platform built with Next.js that helps users learn and practice SQL queries effectively.

## Features

- **Interactive SQL Editor**: Write and execute SQL queries directly in the browser
- **Real-time Query Results**: See the results of your SQL queries instantly
- **Progressive Learning Units**: Organized SQL lessons from basic to advanced concepts
- **Quiz Interface for Beginners**: Easy level exercises feature a quiz-style interface
- **User Profiles**: Track progress and save completed exercises
- **Authentication**: Secure login and registration system

## Project Structure

The application follows a modular architecture organized by feature:

```
super-query/
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── auth/           # Authentication pages
│   │   ├── exercises/      # Exercise pages
│   │   │   ├── [id]/       # Regular SQL exercise interface
│   │   │   └── quiz/       # Quiz interface for easy level exercises
│   │   ├── profile/        # User profile pages
│   │   ├── unit/           # Unit pages
│   │   └── units/          # Units overview page
│   ├── assets/             # Static assets (images, icons)
│   ├── components/         # React components
│   │   ├── Admin/          # Admin-specific components
│   │   ├── Auth/           # Authentication components
│   │   ├── Exercise/       # Exercise-related components
│   │   ├── Home/           # Homepage components
│   │   ├── Profile/        # User profile components
│   │   ├── Unit/           # Unit-related components
│   │   ├── Units/          # Units overview components
│   │   ├── layout/         # Layout components (Navigation, Footer)
│   │   └── ui/             # Reusable UI components
│   │       ├── QuizOption.tsx        # Quiz answer option component
│   │       ├── ProgressIndicator.tsx # Progress bar for quizzes
│   │       ├── QuizCompletionCard.tsx # Quiz results display
│   │       └── ... other UI components
│   ├── hooks/              # Custom React hooks
│   │   ├── admin/          # Admin-related hooks
│   │   ├── auth/           # Authentication hooks
│   │   ├── content/        # Content-related hooks
│   │   └── user/           # User-related hooks
│   ├── types/              # TypeScript type definitions
│   │   ├── api.ts          # API-related types
│   │   ├── components.ts   # Component prop types
│   │   ├── database.ts     # Database-related types
│   │   └── index.ts        # Core data model types
│   └── utils/              # Utility functions
│       ├── api.ts          # API client utilities
│       └── database.ts     # Database utilities
└── public/                 # Public assets
```

## Technology Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT token-based auth
- **Database**: SQL (SQLite in browser for exercises)
- **State Management**: React Hooks
- **API Communication**: Fetch API with custom hooks

## Exercise Interfaces

The application provides two different interfaces for exercises based on difficulty level:

### SQL Editor Interface
- Used for Medium, Hard, and Expert difficulty exercises
- Features a full SQL editor with Monaco Editor
- Execute queries against in-browser SQLite database
- View table structure and query results

### Quiz Interface
- Automatically used for all Easy difficulty exercises
- Multiple-choice question format
- Step-by-step progression through questions
- User-friendly interface designed for beginners
- Score tracking and completion card at the end

The system automatically routes users to the appropriate interface based on the exercise's difficulty level, ensuring a seamless experience.

## Type System

The application uses TypeScript with a well-organized type system:

### Core Model Types (`/src/types/index.ts`)

- `User`: User profile information
- `Unit`: Learning unit containing multiple exercises
- `Exercise`: Individual SQL exercise with schema and validation
- `UnitWithExercises`: Extended unit type with associated exercises
- Authentication types: `userLogin`, `userRegister`, `token`

### Component Types (`/src/types/components.ts`)

- Prop types for all React components (e.g., `UserCardProps`, `ExerciseCardProps`)
- Organized by component category for maintainability

### API Types (`/src/types/api.ts`)

- API request and response types
- Admin form handling types
- Stats and metrics types

### Database Types (`/src/types/database.ts`)

- Types for database operations and query results
- SQLite integration types

## Hooks System

Custom React hooks are organized by feature area:

### Authentication Hooks (`/src/hooks/auth/`)

- `login.ts`: User login functionality
- `register.ts`: User registration
- `self.ts`: Get current user profile

### User Hooks (`/src/hooks/user/`)

- `useChangePassword.ts`: Password change functionality
- `useUpdateUsername.ts`: Username update
- `useUpdateFullName.ts`: Full name update

### Content Hooks (`/src/hooks/content/`)

- `allUnits.ts`: Fetch all learning units
- `unitAndExercises.ts`: Fetch a unit with its exercises
- `exercise.ts`: Fetch individual exercise data
- `userProgress.ts`: Fetch user progress statistics

### Admin Hooks (`/src/hooks/admin/`)

- `checkAdmin.ts`: Verify admin permissions
- `useAdminForm.ts`: Form management for admin operations

## Component System

Components are organized by feature and page:

- `layout/`: Common layout components (Navigation, Footer, UnitTitle)
- `ui/`: Reusable UI components (Button, ExerciseCard, etc.)
- Feature-specific components in dedicated folders

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/super-query.git
   cd super-query
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Guidelines

### Adding New Features

1. Create appropriate type definitions in the `/src/types/` folder
2. Implement any required API utilities in `/src/utils/api.ts`
3. Create custom hooks in the appropriate hooks folder
4. Develop components with proper typing
5. Create or update pages in the app directory

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent naming conventions
- Use proper typing for all components and functions

## API Integration

The application connects to a backend API for data persistence:

- Base URL: `https://rpi.tail707b9c.ts.net/api/v1`
- Authentication: JWT token passed in Authorization header
- Main endpoints:
  - `/auth/register`: User registration
  - `/auth/login`: User login
  - `/units`: Learning units management
  - `/exercises`: Exercises management
  - `/solutions`: User solutions and progress

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the awesome framework
- The SQLite team for the SQL engine that enables in-browser SQL execution
