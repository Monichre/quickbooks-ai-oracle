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

## Key Features
- **Estimate to Purchase Order/Invoice**: Convert estimates to purchase orders or invoices
- **Purchase Order Creation**: Create purchase orders from estimates with vendor-specific mappings
- **PDF Generation**: Generate and print estimate PDFs
- **Intuit Integration**: Full integration with QuickBooks Online API

## Current Development Focus
- Implementing the Purchase Order creation workflow from Estimates
- Adding PDF generation and printing for Estimates
- Enhancing UI components for document actions
- Improving validation and mapping utilities

## QuickBooks Specific Guidelines
- Use proper minorversion query param in all API requests
- Follow QuickBooks entity relationships when designing forms
- Vendor-specific purchase orders should be created for multi-vendor estimates
- Handle QuickBooks validation errors gracefully with user-friendly messages

## Sandbox Environments
### Shop Sanel Sandbox Company (Mike's Instance)
- MERCHANT_ID: 9999993056997384
- COMPANY_ID: 9341454477211880