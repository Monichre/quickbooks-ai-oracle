# 03 – Utility – Map Estimate ➜ Invoice

## Overview

Implement a utility function to map a QuickBooks **Estimate** object to an **Invoice** object. This enables seamless creation of customer-facing invoices from existing estimates, supporting the workflow outlined in the epic.

## Objectives

- Develop a pure function: `mapEstimateToInvoice(estimate: Estimate): Invoice`
- Ensure type safety and compliance with QuickBooks API schemas
- Support all relevant Estimate fields, including line items, customer, and tax details
- Provide robust error handling for missing or invalid data

## Sub-Tasks

1. Define TypeScript types/interfaces for Estimate and Invoice (if not already present)
2. Implement the mapping function with clear, maintainable logic
3. Write unit tests with diverse fixture data (≥90% coverage)
4. Document mapping rules and edge cases
5. Integrate utility into the Invoice creation flow

## Technical Notes

- Reference QuickBooks API docs and existing `.mdc` schema files
- Follow functional programming and SOLID principles
- Ensure compatibility with downstream Invoice service wrapper

## Success Criteria

- Mapping utility passes all unit tests
- Handles all required Estimate fields and edge cases
- Integrates cleanly with Invoice creation page/service

## Dependencies

- None 