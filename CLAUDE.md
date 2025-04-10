# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands
- `npm run dev`: Start development server on port 3000
- `npm run build`: Build for production
- `npm run lint`: Run biome linter
- `npm run format`: Format code with biome
- `npm run typecheck`: Type check with TypeScript
- `npm run test`: Run all Jest tests
- `npm run test:watch`: Run tests in watch mode
- `npm test -- -t "test name"`: Run a specific test

## Code Style Guidelines
- **Imports**: Use absolute imports with `@/` prefix (e.g., `import { xyz } from "@/lib/utils"`)
- **Formatting**: Follow biome formatting rules in biome.json
- **TypeScript**: Use strict typing; avoid `any` type
- **Components**: Prefer server components where possible
- **Naming**: Use camelCase for functions/variables, PascalCase for components/types
- **Error Handling**: Use try/catch for async operations, especially with external APIs
- **QuickBooks API**: Follow entity-specific documentation in docs/quickbooks/
- **Tests**: Jest tests should be in __tests__ directories with the pattern *.test.ts(x)
- **Secrets**: Never commit API keys or tokens; use environment variables
- **Generation**: Use `npm run generate` commands for new components and features

## Project Structure
- `/src/app`: Next.js app router pages and API routes
- `/src/components`: Reusable React components
- `/src/services`: Service layer including QuickBooks API client code
- `/src/features`: Feature-specific components and logic
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and shared code