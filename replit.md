# Task Manager Application

## Overview

A Kanban-style task management application built with Express.js backend and jQuery frontend. The application allows users to organize tasks into customizable boards (quadros) with drag-and-drop functionality. Users authenticate via Replit's OpenID Connect (OIDC) system, and their data persists in a PostgreSQL database managed through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- jQuery 3.6.3 for DOM manipulation and AJAX requests
- jQuery UI for drag-and-drop interactions
- Vanilla HTML/CSS for presentation

**Key Design Decisions:**

1. **jQuery-based SPA:** The application uses jQuery for client-side interactivity rather than modern frameworks. This provides simplicity and familiarity but limits scalability for complex state management.

2. **Drag-and-Drop Plugin:** Custom jQuery plugins (`dragAndDrop.js`) extend jQuery's functionality to enable dragging tasks between boards. The plugin wraps jQuery UI's draggable/droppable functionality with application-specific logic.

3. **Session Management:** Client-side session handling through `session.js` uses cookies and window.name for session tracking, providing fallback mechanisms when sessionStorage is unavailable.

4. **Template-based Rendering:** Uses HTML `<template>` elements for dynamic content generation, parsed and populated via jQuery's DOM manipulation methods.

### Backend Architecture

**Technology Stack:**
- Express.js (v5.1.0) for HTTP server
- TypeScript for type safety
- Drizzle ORM for database operations
- Passport.js with OpenID Client for authentication

**Key Design Decisions:**

1. **Authentication Strategy - Replit OIDC:**
   - Uses Passport.js with OpenID Connect strategy specifically configured for Replit's authentication system
   - Session-based authentication with PostgreSQL session storage (connect-pg-simple)
   - Tokens and user claims stored in Express session
   - **Rationale:** Integrates seamlessly with Replit's hosting environment while providing standard OAuth2/OIDC security

2. **Session Storage:**
   - PostgreSQL-backed sessions via connect-pg-simple
   - 7-day session TTL with secure, httpOnly cookies
   - **Rationale:** Persistent sessions survive server restarts; database-backed storage prevents memory leaks in long-running processes

3. **Data Access Layer:**
   - Abstracted through `IStorage` interface implemented by `DatabaseStorage`
   - Repository pattern separating database logic from route handlers
   - **Rationale:** Enables future storage backend changes without modifying business logic; improves testability

4. **Type Safety:**
   - TypeScript throughout with strict compiler options
   - Path aliases (`@shared/*`, `@/*`) for cleaner imports
   - Type augmentation for Express session/user objects
   - **Rationale:** Catch errors at compile-time; improve IDE autocompletion; self-documenting code

### Data Storage

**Database: PostgreSQL (via Neon Serverless)**

**Schema Design:**

1. **Sessions Table:**
   - Stores Express session data
   - TTL-based expiration with indexed expire column
   - Managed automatically by connect-pg-simple

2. **Users Table:**
   - Primary key: UUID (generated via `gen_random_uuid()`)
   - Stores OIDC user profile data (email, name, profile image)
   - Timestamps for creation and updates

3. **Quadros Table (Boards):**
   - Foreign key to users with CASCADE delete
   - Each user can have multiple boards
   - Description field for board naming

4. **Tarefas Table (Tasks):**
   - Foreign key to quadros with CASCADE delete
   - Text description field for task content
   - Timestamps tracking creation/modification

**ORM Choice - Drizzle:**
- Type-safe query builder with zero runtime overhead
- Schema defined in TypeScript, migrations generated automatically
- **Trade-offs:** Newer ecosystem vs Prisma, but better performance and smaller bundle size

**Database Connection:**
- Neon serverless driver with WebSocket support (required for serverless environments)
- Connection pooling via pg Pool
- **Rationale:** Optimized for serverless/edge deployments; WebSocket fallback for environments without traditional TCP

### Authentication & Authorization

**Authentication Flow:**

1. User accesses landing page (`/`)
2. Landing page checks `/api/auth/user` endpoint
3. If unauthenticated, displays login button pointing to `/api/login`
4. `/api/login` initiates OIDC flow via Passport.js
5. After successful authentication, user profile is upserted to database
6. Session created with user claims and tokens
7. Subsequent requests include session cookie for authentication

**Authorization:**
- Middleware `isAuthenticated` validates session on protected routes
- User ID extracted from OIDC claims (`req.user.claims.sub`)
- All database queries filtered by authenticated user ID
- **Security:** Prevents unauthorized access to other users' data

**Token Management:**
- Access and refresh tokens stored in session
- Memoized OIDC configuration (1-hour cache) to reduce discovery endpoint calls
- User session updated with fresh tokens on each authentication

## External Dependencies

### Authentication Service
- **Replit OIDC Provider:** `openid-client` library for OAuth2/OIDC flows
- **Configuration:** Requires `ISSUER_URL`, `REPL_ID`, `REPLIT_DOMAINS` environment variables
- **Purpose:** Single sign-on for Replit users

### Database Service
- **Neon Serverless PostgreSQL:** `@neondatabase/serverless` driver
- **Configuration:** `DATABASE_URL` environment variable
- **Purpose:** Serverless-optimized PostgreSQL with WebSocket support

### Session Store
- **PostgreSQL via connect-pg-simple:** Persistent session storage
- **Configuration:** Uses same `DATABASE_URL` as main database
- **Purpose:** Maintain user sessions across server restarts

### Build Tools
- **Vite:** Development server and build tool
- **esbuild:** Fast TypeScript/JavaScript bundler
- **tsx:** TypeScript execution for development (`npm run dev`)
- **drizzle-kit:** Database migration and schema management tools

### Client-Side Libraries
- **jQuery 3.6.3 + jQuery UI 1.13.2:** Legacy choice for compatibility
- **Material Icons:** Google's icon font for UI elements

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for signing session cookies
- `REPL_ID`: Replit application identifier
- `ISSUER_URL`: OIDC provider URL (defaults to Replit)
- `REPLIT_DOMAINS`: Allowed domains for CORS
- `PORT`: Server port (defaults to 5000)