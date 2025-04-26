# LineItemsEditor_PSEUDOCODE.md

## Purpose

Refactor LineItemsEditor to remove table, simplify form logic, and improve maintainability.

## Steps

1. **Imports**
   - Import React, useFieldArray, Controller, and types (EstimateLine, etc.)
   - Import UI components (e.g., Button, Input, etc.)

2. **Props**
   - Accept props: control, errors, name (field array name)

3. **useFieldArray**
   - Use useFieldArray({ control, name }) to manage line items
   - Destructure fields, append, remove

4. **Render Line Items**
   - Map over fields
   - For each field (by index):
     - Render a card/panel (div with border, padding, margin)
     - Render a select for DetailType (SalesItemLineDetail, SubTotalLineDetail, DiscountLineDetail, GroupLineDetail)
     - On change, update the type and reset other fields as needed
     - Conditionally render fields based on DetailType:
       - **SalesItemLineDetail**: ItemRef.value, Qty, UnitPrice, Amount
       - **SubTotalLineDetail**: Description, Amount
       - **DiscountLineDetail**: DiscountPercent, Amount
       - **GroupLineDetail**: Description, Amount
     - Render a remove button (disabled if only one item)

5. **Add Line Item Button**
   - Render a button at the bottom to append a new line item (default to SalesItemLineDetail)

6. **Error Display**
   - If errors[name]?.message, render error message

7. **TypeScript**
   - Use correct types for all field names and values
   - Avoid any/unsafe casts

8. **Export**
   - Export as named function

9. **Documentation**
   - Document the new component in LineItemsEditor.md

## Pseudocode for Adding shadcn/ui Labels to Each Input in LineItemsEditor

1. Import Label from shadcn/ui:

   ```typescript
   import { Label } from '@/components/ui/label'
   ```

2. For each input field (including select for type):
   a. Generate a unique id string for each field, e.g.:

      ```typescript
      const id = `${name}-${idx}-fieldname`
      ```

   b. Add `<Label htmlFor={id}>Descriptive Label</Label>` before the input.
   c. Pass `id={id}` to the `<Input />` or `<select />`.

3. For each line type (SalesItem, SubTotal, Discount, Group):
   a. For each field (Item, Qty, Unit Price, Amount, Description, Discount %):
      - Add a label with a clear, human-readable name.
      - Ensure the label is visually grouped with its input (e.g., in a flex or grid cell).

4. For the "Type" select:
   a. Add `<Label htmlFor={typeId}>Type</Label>`
   b. Set `id={typeId}` on the `<select />`

5. Ensure all labels are visible and accessible.

6. Test that the linter error about label association is resolved.

7. Document the changes in LineItemsEditor.md.
