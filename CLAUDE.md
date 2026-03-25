# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brando Admin is a React TypeScript admin dashboard for managing photo albums. It's built with Rsbuild as the build tool and uses Semi Design (ByteDance's design system) for UI components.

## Development Commands

```bash
# Start development server (runs on port 8083)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Environment Setup

Create a `.env` file based on `.env.example`:
```
LOGIN_URL=https://your-sso-login-url.com
API_END_POINT=https://your-api-endpoint.com
```

## Architecture

### Tech Stack
- **Framework**: React 17 with TypeScript
- **Build Tool**: Rsbuild (not Webpack or Vite)
- **UI Library**: Semi Design (@douyinfe/semi-ui)
- **Styling**: Styled Components with Semi Design theme
- **HTTP Client**: Axios with credentials
- **State Management**: React hooks (no Redux/Context)
- **Package Manager**: pnpm

### Path Aliases

Always use these dollar-prefixed aliases for imports:
- `$hooks/*` → `./src/hooks/*`
- `$components/*` → `./src/components/*`
- `$utils/*` → `./src/utils/*`
- `$typings/*` → `./src/typings/*`
- `$consts/*` → `./src/consts/*`

### API Structure

The API client is centralized in `src/utils/request.ts`:
- Uses Axios with `withCredentials: true`
- Base URL configured via `API_END_POINT` env var
- All API responses wrapped in `Response<T>` type
- Progress tracking support for file uploads

### Key Directories

- `src/components/`: Feature-based React components
  - Each component typically has a `styled.ts` file for its styles
  - Major features: albums, albums-admin, layout, new-album-sheet
- `src/hooks/`: Custom React hooks (dark-mode, user-info, upload)
- `src/typings/`: TypeScript definitions for API contracts
- `src/utils/`: Utilities including the API client and env config

### Authentication Flow

The app uses SSO authentication:
1. On app load, fetches user info from `/api/user`
2. If request fails, redirects to `LOGIN_URL`
3. All API calls include credentials automatically

### Styling Patterns

- Components use `styled.ts` files for component-scoped styles
- Semi Design components for UI elements
- Styled Components for custom styling
- Dark mode support via CSS variables and theme context

### Development Configuration

- Development server runs on `0.0.0.0:8083`
- HMR enabled on same port
- TypeScript strict mode enabled
- No ESLint configuration present
- Prettier configured for code formatting

## Important Notes

- The project does NOT use Redux or Context API - rely on local state and custom hooks
- All new components should follow the pattern with a separate `styled.ts` file
- Type definitions are strict - always type API contracts in `$typings`
- Semi Design is the primary UI library - avoid mixing other UI frameworks