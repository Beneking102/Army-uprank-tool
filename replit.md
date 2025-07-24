# NC-Army Uprank Tool

## Overview

This is a comprehensive Army faction management system for GTA RP servers. The application provides a complete solution for managing personnel, ranks, points, and promotions within an Army faction structure. It features a modern web interface built with React/TypeScript on the frontend and Express.js on the backend, with PostgreSQL as the database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Framework**: Custom component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom military theme variables
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions stored in PostgreSQL
- **API Design**: RESTful API with standardized error handling

### Database Design
- **Primary Database**: PostgreSQL via Neon serverless
- **Schema Management**: Drizzle Kit for migrations
- **Core Tables**:
  - Users (Replit Auth integration)
  - Sessions (session storage)
  - Ranks (military hierarchy levels 2-15)
  - Special Positions (drill sergeants, medics, instructors)
  - Personnel (army members with rank associations)
  - Point Entries (weekly activity tracking)
  - Promotions (rank advancement history)

## Key Components

### Authentication System
- **Provider**: Replit Auth with OIDC
- **Session Storage**: PostgreSQL-backed sessions with 7-day TTL
- **Security**: HTTP-only cookies, secure flags, CSRF protection

### Personnel Management
- **Rank Structure**: 14 ranks from Private (2) to Colonel (15)
- **Categories**: Mannschaft (2-5), Unteroffiziere (6-10), Offiziere (11-15)
- **Special Positions**: Additional roles with difficulty ratings (easy, medium, hard)

### Points System
- **Activity Tracking**: Weekly point entries (0-35 points)
- **Special Position Bonuses**: Additional points based on role difficulty
- **Promotion Criteria**: Point thresholds for rank advancement

### User Interface
- **Design System**: Military-themed with consistent color palette
- **Responsive**: Mobile-first design with desktop optimizations
- **Components**: Reusable UI components with accessibility features
- **Navigation**: Sidebar navigation with role-based access

## Data Flow

1. **Authentication Flow**:
   - Users authenticate via Replit OIDC
   - Sessions stored in PostgreSQL
   - User data synchronized with local user table

2. **Personnel Management Flow**:
   - Admin creates personnel records
   - Associates with ranks and special positions
   - Tracks promotion history

3. **Points Entry Flow**:
   - Weekly point submission by authorized users
   - Automatic calculation of special position bonuses
   - Real-time promotion eligibility checking

4. **Dashboard Flow**:
   - Aggregated statistics from multiple tables
   - Real-time rank distribution charts
   - Activity feed from recent promotions and point entries

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless
- **Authentication**: Replit Auth service
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS framework
- **Query Management**: TanStack Query
- **Form Validation**: Zod schema validation

### Development Dependencies
- **Build Tool**: Vite with React plugin
- **Type Checking**: TypeScript compiler
- **Database Tools**: Drizzle Kit for migrations
- **Development Server**: Express with Vite middleware

## Deployment Strategy

### Development Environment
- **Local Server**: Express with Vite dev middleware
- **Hot Reload**: Vite HMR for frontend changes
- **Database**: Direct connection to Neon PostgreSQL
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPLIT_DOMAINS

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: ESBuild bundling to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Database**: Production Neon PostgreSQL instance

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared types between client/server
2. **Type Safety**: End-to-end TypeScript with shared schema definitions
3. **Database Choice**: PostgreSQL for ACID compliance and complex queries
4. **Authentication Strategy**: Replit Auth for seamless integration
5. **UI Framework**: Radix UI for accessibility and customization
6. **State Management**: Server state via React Query, minimal client state
7. **Validation**: Zod schemas shared between client and server
8. **Build Strategy**: Separate client/server builds with shared dependencies

The system prioritizes type safety, user experience, and maintainability while providing a comprehensive solution for Army faction management in GTA RP environments.