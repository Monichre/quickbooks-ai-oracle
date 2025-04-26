# LineItemsEditor

## Overview

`LineItemsEditor` is a functional React component for editing an array of estimate line items using React Hook Form's `useFieldArray`. It provides a simplified, card-based UI for managing line items, supporting multiple line types (Sales Item, SubTotal, Discount, Group) with dynamic fields per type.

## Key Modules & Architecture

- **React Hook Form**: Uses `useFieldArray` for dynamic array management and `Controller` for controlled inputs.
- **EstimateLine Types**: Supports all QuickBooks line types, rendering only relevant fields for each.
- **UI Structure**: Each line item is rendered as a card/panel with a type selector, dynamic fields, and a remove button. An add button is provided at the bottom.
- **TypeScript**: All field names and types are strictly typed, with no use of `any` or unsafe casts.

## Data Flow

- The parent form passes `control`, `errors`, and the field array `name`.
- `useFieldArray` manages the array of line items, exposing `fields`, `append`, `remove`, and `update`.
- Each card uses the array index for field names (e.g., `name.0.Amount`).
- Changing the type resets the line item to default values for that type.
- All field values are managed by React Hook Form state.

## Component Usage

```tsx
<LineItemsEditor control={control} errors={errors} name="lineItems" />
```

- **Add Line Item**: Appends a new Sales Item line by default.
- **Remove Line Item**: Removes the selected line, disabled if only one remains.
- **Type Select**: Changes the line type and resets fields accordingly.
- **Dynamic Fields**: Renders only the fields relevant to the selected type.
- **Error Display**: Shows error message for the field array if present.

## Styling

- Uses Tailwind CSS utility classes for layout, spacing, and responsive design.
- Each line item is visually separated for clarity and usability.

## Best Practices

- All state is managed by React Hook Form; no local state is used for line items.
- Uses functional, declarative patterns throughout.
- All field names are strictly typed and index-based.
- No table or grid layout is used; the UI is mobile-friendly and accessible.

## Example

```tsx
import { useForm } from 'react-hook-form'
import { LineItemsEditor } from '@/components/estimates/LineItemsEditor'

const { control, formState: { errors } } = useForm<{ lineItems: EstimateLine[] }>({
  defaultValues: { lineItems: [/* ... */] }
})

<LineItemsEditor control={control} errors={errors} name="lineItems" />
```

## File Structure

- `LineItemsEditor.tsx` — Main component implementation
- `LineItemsEditor_PSEUDOCODE.md` — Pseudocode and planning
- `LineItemsEditor.md` — This documentation

## Extensibility

- To add new line types, extend the `getDefaultLine` helper and add a new case in the render switch.
- To add new fields, update the relevant case in the render logic.

## Testing

- All logic is covered by React Hook Form's testable state.
- No side effects or local state to mock.

---

For further details, see the implementation in `LineItemsEditor.tsx` and the planning in `LineItemsEditor_PSEUDOCODE.md`.

# LineItemsEditor Component Label Refactor

## Summary

Added shadcn/ui `<Label />` components to every `<Input />` and `<select />` in `LineItemsEditor.tsx` to ensure accessibility, resolve linter errors, and improve form clarity.

## Changes Made

- Imported `Label` from `@/components/ui/label`.
- For each input and select:
  - Generated a unique `id` using the pattern `${name}-${idx}-fieldname`.
  - Added a `<Label htmlFor={id}>` with a descriptive label before each input/select.
  - Passed `id={id}` to each `<Input />` and `<select />`.
- Updated the "Type" select to use a `<Label>` and associate it with the select via `htmlFor`/`id`.
- Grouped each label/input pair in a `flex flex-col` container for visual clarity.
- Used clear, human-readable label text for each field (e.g., "Item", "Qty", "Unit Price", "Amount", "Description", "Discount %").
- Ensured all labels are visible and accessible.
- Resolved the linter error: "A form label must be associated with an input."

## Rationale

- **Accessibility:** Properly associated labels improve screen reader support and form usability.
- **Linting:** Fixes accessibility linter errors and enforces best practices.
- **Clarity:** Users can now clearly see what each input is for, reducing confusion.
- **Consistency:** All form fields now follow a consistent pattern for labeling and structure.

## Architectural Notes

- The unique `id` generation ensures no collisions even with dynamic field arrays.
- The approach is modular and can be extended to new fields easily.
- The use of shadcn/ui Label ensures design consistency with the rest of the UI kit.

## Data Flow

- Each field in the line item array is rendered with a unique label/input pair.
- The `id` is derived from the field array name, index, and field type, ensuring uniqueness.
- The `Label`'s `htmlFor` matches the input/select's `id`, providing correct association.

## Example

```tsx
<div className="flex flex-col">
  <Label htmlFor={itemId}>Item</Label>
  <Controller
    ...
    render={({field}) => (
      <Input id={itemId} ... />
    )}
  />
</div>
```

## Test Strategy

- Visually inspect the form to ensure all fields have visible labels.
- Use a screen reader to verify label association.
- Run linter to confirm the label association error is resolved.
