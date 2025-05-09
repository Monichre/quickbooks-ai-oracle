# 08 – Validation & Error Handling

## Overview

Implement robust validation and error handling for the Purchase Order and Invoice creation flows, ensuring data integrity and a smooth user experience.

## Objectives

- Validate all required fields before submission
- Surface QuickBooks API validation errors via toast notifications
- Log backend errors to Sentry
- Provide user-friendly error messages

## Sub-Tasks

1. Define validation schema for PO and Invoice forms
2. Integrate validation into form components
3. Implement error handling for API responses
4. Add toast notifications for user feedback
5. Log errors to Sentry or equivalent

## Technical Notes

- Use `zod` or similar for schema validation
- Follow error handling conventions in the codebase
- Ensure accessibility of error messages

## Success Criteria

- All validation errors are caught before API submission
- API errors are surfaced to the user and logged
- No unhandled exceptions in the flow

## Dependencies

- 06 (Page – Prefill Purchase Order Create)
- 07 (Page – Prefill Invoice Create) 