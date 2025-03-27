# QuickBooks Oracle Integration - Developer Guide

## Build Commands
- `npm run dev`: Start development server on port 3000
- `npm run build`: Build for production
- `npm run clean`: Clean build artifacts
- `npm run lint`: Run biome linter
- `npm run format`: Format code with biome
- `npm run typecheck`: Type check with TypeScript

## Code Style Guidelines
- **Imports**: Use absolute imports with `@/` prefix (e.g., `import { xyz } from "@/lib/utils"`)
- **Formatting**: Follow biome formatting rules
- **TypeScript**: Use strict typing; avoid `any` type
- **Components**: Prefer server components where possible
- **Naming**: Use camelCase for functions/variables, PascalCase for components/types
- **Error Handling**: Use try/catch for async operations, especially with external APIs
- **QuickBooks API**: Reference Cursor rules (in .cursor/rules/) for entity documentation
- **Secrets**: Never commit API keys or tokens; use environment variables
- **Organization**: Group related functionality in dedicated directories
- **State Management**: Prefer React hooks for state; use server actions for form submissions

## Project Structure
- `/src/app`: Next.js app router pages and API routes
- `/src/lib`: Utility functions and QuickBooks API client code
- `/src/components`: Reusable React components
- `/src/actions`: Server actions for form handling