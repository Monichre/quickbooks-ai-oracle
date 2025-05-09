# 09 – AI-Assist API (Stretch)

## Overview

Develop an API endpoint to leverage LLMs for converting Estimate documents or objects into valid PurchaseOrder payloads, supporting advanced automation and user productivity.

## Objectives

- Implement `POST /api/ai/estimate-to-po` endpoint
- Integrate with LLM provider (OpenAI, Anthropic, etc.)
- Validate generated JSON against PurchaseOrder schema
- Feature-flag via `NEXT_PUBLIC_AI_ASSIST`

## Sub-Tasks

1. Design and implement API route
2. Integrate with selected LLM provider
3. Validate and sanitize LLM output
4. Write tests for schema compliance and error cases
5. Document usage and limitations

## Technical Notes

- Reference `.mdc` schema files for validation
- Ensure security and rate limiting on the endpoint
- Log errors and provide clear feedback

## Success Criteria

- Endpoint returns schema-valid payloads in manual tests
- Handles invalid input and LLM errors gracefully
- Feature can be toggled via environment variable

## Dependencies

- 02 (Utility – Map Estimate ➜ PurchaseOrder) 