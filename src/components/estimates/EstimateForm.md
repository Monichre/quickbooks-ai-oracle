# EstimateForm.md

## Overview

This document describes the refactor of `EstimateForm.tsx` from using `@tanstack/react-form` to `react-hook-form` for form state management and validation.

## Key Modules

- `react-hook-form`: Provides form state, validation, and controlled/uncontrolled field management.
- `@hookform/resolvers/zod`: Integrates Zod schema validation with react-hook-form.
- `zod`: Used for schema-based validation.
- `LineItemsEditor`: Receives react-hook-form props for managing line items.

## Process and Component Architecture

- The form is initialized with `useForm` from `react-hook-form`, using `zodResolver(estimateSchema)` for validation.
- Default values are set from `initialData` or sensible defaults for a new estimate.
- Each field is registered using either `register` (for simple inputs) or `Controller` (for controlled components like select, textarea, or custom editors).
- Validation errors are accessed via `formState.errors` and displayed next to each field.
- Submission is handled by `handleSubmit`, which calls the async `onSubmit` handler. Submission state is managed by `formState.isSubmitting`.
- The `LineItemsEditor` component is passed `control`, `getValues`, `setValue`, and `errors` props from react-hook-form. If it previously expected a tanstack form, it should be refactored to use these props or `useFieldArray` for array management.
- Error messages from the API or submission are displayed at the top of the form.

## Data Flow

1. User interacts with form fields, which are registered with react-hook-form.
2. On submit, react-hook-form validates the data using the Zod schema.
3. If validation passes, the data is sent to `createEstimateAction`.
4. On success, the user is redirected to the new estimate page. On error, the error is displayed.
5. All field-level errors are shown inline using `formState.errors`.

## Validation and Error Handling

- All validation is handled by Zod via the `zodResolver`.
- Field errors are displayed inline.
- Submission errors (e.g., API errors) are displayed at the top of the form.
- The submit button is disabled while submitting.

## Changes to Child Components

- `LineItemsEditor` now receives react-hook-form props (`control`, `getValues`, `setValue`, `errors`). If it previously expected a tanstack form, it must be refactored to use these props or `useFieldArray` for managing the `Line` array.

## Example Usage

```tsx
<EstimateForm customers={customers} initialData={estimate} />
```

## Notes

- All tanstack form logic and imports have been removed.
- The form is now fully managed by react-hook-form, improving compatibility and maintainability.
- If additional custom array logic is needed, consider using `useFieldArray` from react-hook-form.

## Feature: Add New Customer from Estimate Form

### Overview

This feature allows users to create a new customer directly from the Estimate creation/editing screen. The customer dropdown includes an option to open a modal dialog for adding a new customer. Upon successful creation, the new customer is added to the dropdown and selected automatically.

---

## Component Architecture

- **EstimateForm**
  - Manages local state for the list of customers.
  - Renders a dropdown select for customers, with an extra option: "Add new customer...".
  - Integrates the `CreateCustomerDialog` modal.
  - Handles updating the customer list and selection when a new customer is created.

- **CreateCustomerDialog**
  - Modal dialog UI (using Shadcn UI/Radix UI Dialog).
  - Contains a form for new customer details (fields: DisplayName, Email).
  - Uses Zod for validation and react-hook-form for form state.
  - Calls `createCustomerAction` (async server action) on submit.
  - On success, calls `onCustomerCreated(newCustomer)` callback.
  - Handles and displays errors.

---

## Data Flow

1. User opens the Estimate form.
2. Customer dropdown is rendered with all customers and an option: "Add new customer...".
3. User selects "Add new customer...".
4. `CreateCustomerDialog` opens as a modal.
5. User fills out the form and submits.
6. On success:
    - New customer is returned from `createCustomerAction`.
    - `EstimateForm` adds the new customer to its local `customers` state.
    - The dropdown selection is set to the new customer's ID.
7. On error:
    - Error message is shown in the modal.
8. User can close the modal at any time (cancel).

---

## Integration Points

- `EstimateForm` manages customer list and selection.
- `CreateCustomerDialog` is a controlled modal/dialog.
- Customer creation action is async and returns the new customer object.
- Error handling is present in both form and modal.

---

## Edge Cases & Notes

- Prevent duplicate customer names/emails (validated in backend, error shown in modal).
- Loading state is shown during customer creation.
- Modal can be closed/cancelled at any time.
- If modal is closed without creating a customer, dropdown selection remains unchanged.
- The dialog form only collects DisplayName and Email; backend schema supports more fields if needed.

---

## Example Usage

```tsx
// In EstimateForm.tsx
<CreateCustomerDialog
  open={isDialogOpen}
  onOpenChange={setDialogOpen}
  onCustomerCreated={handleCustomerCreated}
/>
```

---

## File Structure

- `src/components/estimates/EstimateForm.tsx` — Main form, dropdown, dialog integration
- `src/components/estimates/CreateCustomerDialog.tsx` — Modal dialog and form
- `src/app/actions/customerActions.ts` — Server action for customer creation
- `src/services/intuit/types/response-types.ts` — Customer type definition

## Address Update Dialog on Customer Change

### Overview

When a user selects a different customer in the EstimateForm, a dialog prompts whether to update the billing and shipping addresses to match the new customer or keep the current addresses. If the user cancels, the customer selection reverts to the previous value.

### Key Modules

- `EstimateForm`: Main form component, manages customer selection and dialog state.
- `Dialog`: UI component for modal dialog (from kokonutui or custom).
- `CreateCustomerDialog`: For adding new customers.

### Process & Component Architecture

- **State**:
  - `previousCustomerId`: Tracks the last confirmed customer selection.
  - `pendingCustomerId`: Holds the new customer ID while the dialog is open.
  - `isAddressUpdateDialogOpen`: Controls dialog visibility.
- **Customer Dropdown**:
  - On change, if a new customer is selected, opens the dialog and sets `pendingCustomerId`.
  - If "Add new customer..." is selected, opens the create dialog.
- **Dialog**:
  - "Update addresses": Sets BillAddr/ShipAddr/BillEmail from the selected customer, updates selection.
  - "Keep current addresses": Only updates the customer selection.
  - "Cancel": Reverts the dropdown to the previous customer.

### Data Flow

1. User selects a customer from the dropdown.
2. If the selection changes, dialog opens:
   - If "Update addresses" is chosen, addresses and email are updated from the new customer.
   - If "Keep current addresses" is chosen, only the customer is updated.
   - If "Cancel" is chosen, the selection reverts.
3. State is updated accordingly to reflect the user's choice.

### Accessibility

- Dialog is focus-trapped and accessible.
- Buttons are keyboard accessible.

### Notes

- The autofill logic for addresses is now only triggered if the user explicitly chooses to update addresses.
- The dialog prevents accidental overwriting of address fields when switching customers.

---
