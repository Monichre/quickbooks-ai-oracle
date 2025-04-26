# EstimateForm_PSEUDOCODE.md

## Goal

Refactor `EstimateForm.tsx` to use `react-hook-form` instead of `@tanstack/react-form`.

## Steps

1. **Remove all imports from `@tanstack/react-form` and `@tanstack/zod-form-adapter`.**
2. **Add imports:**
   - `useForm`, `Controller` from `react-hook-form`
   - `zodResolver` from `@hookform/resolvers/zod`
3. **Initialize `useForm` with:**
   - `resolver: zodResolver(estimateSchema)`
   - `defaultValues`: as before
4. **For each field:**
   - Use `Controller` for controlled components (select, date, textarea)
   - Use `register` for simple inputs
   - Access errors via `formState.errors`
5. **On submit:**
   - Use `handleSubmit` from `react-hook-form`
   - Set `isSubmitting` using `formState.isSubmitting`
   - Set error state as before
6. **Update `LineItemsEditor` to receive react-hook-form props (if needed)**
7. **Ensure all error messages are displayed using `formState.errors`**
8. **Remove any tanstack-specific logic**

## Notes

- `react-hook-form`'s `Controller` API is similar but not identical; update render props accordingly.
- Zod validation is handled via `zodResolver`.
- `isSubmitting` is managed by `react-hook-form`.
- If `LineItemsEditor` expects tanstack form, refactor it to accept react-hook-form props or use `useFieldArray` if needed.

## Component Structure

- `EstimateForm`
  - Manages local state for `customers` (array of Customer)
  - Renders a dropdown select for customers
  - Renders an option/button to open `CreateCustomerDialog`
  - Handles updating the customer list and selection when a new customer is created

- `CreateCustomerDialog`
  - Modal/dialog UI (Radix UI Dialog, Shadcn UI Dialog, or similar)
  - Contains a form for new customer details (fields: DisplayName, Email, etc.)
  - Uses Zod for validation
  - Calls `createCustomerAction` (async action) on submit
  - On success, calls `onCustomerCreated(newCustomer)` callback
  - Handles and displays errors

## Data Flow

1. User opens EstimateForm.
2. Customer dropdown is rendered with all customers and an option: "Add new customer..."
3. User selects "Add new customer..."
4. `CreateCustomerDialog` opens as a modal.
5. User fills out the form and submits.
6. On success:
    - New customer is returned from `createCustomerAction`.
    - `EstimateForm` adds the new customer to its local `customers` state.
    - The dropdown selection is set to the new customer's ID.
7. On error:
    - Error message is shown in the modal.
8. User can close the modal at any time (cancel).

## Pseudocode

```typescript
// EstimateForm.tsx
const [customers, setCustomers] = useState<Customer[]>(props.customers)
const [isDialogOpen, setDialogOpen] = useState(false)

function handleCustomerCreated(newCustomer: Customer) {
  setCustomers(prev => [...prev, newCustomer])
  setValue('CustomerRef.value', newCustomer.Id)
  setDialogOpen(false)
}

// In the select dropdown:
<select ...>
  {customers.map(...)}
  <option value="__add_new__">Add new customer...</option>
</select>

// On change:
if (selectedValue === "__add_new__") {
  setDialogOpen(true)
}

<CreateCustomerDialog
  open={isDialogOpen}
  onOpenChange={setDialogOpen}
  onCustomerCreated={handleCustomerCreated}
/>

// CreateCustomerDialog.tsx
const [formState, setFormState] = useState({ ... })
const [error, setError] = useState<string | null>(null)

async function handleSubmit() {
  try {
    const newCustomer = await createCustomerAction(formState)
    onCustomerCreated(newCustomer)
  } catch (e) {
    setError(e.message)
  }
}

// Render form fields, error message, submit/cancel buttons
```

## Integration Points

- `EstimateForm` manages customer list and selection
- `CreateCustomerDialog` is a controlled modal/dialog
- Customer creation action is async and returns the new customer object
- Error handling is present in both form and modal

## Edge Cases

- Prevent duplicate customer names/emails (validate in backend and show error)
- Handle loading state during customer creation
- Modal can be closed/cancelled at any time
- If modal is closed without creating a customer, dropdown selection remains unchanged
