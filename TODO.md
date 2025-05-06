# User Workflow

## Product Database Requirements

- The product database has to be Quickbooks compatible

## Main Screens

### 1. Create Estimate Screen

- Must be able to create & view customers
- Want the ability to create a purchase order directly from the estimate screen for every related or relevant vendor in the estimate doc

#### Purchase Order Creation Process

1. **Create an Estimate**:
   - Go to + New and select Estimate
   - Enter the customer and product/service details
   - Select Save
2. **Copy to Purchase Order**:
   - A drop-down choice of "Create invoice" or "Copy to purchase order" will appear next to the amount
   - Choose Copy to purchase order
3. **Select a Vendor**:
   - Choose the vendor you will be ordering from
4. **Item Details**:
   - Make sure the item details on the purchase order are correct
   - Include the same customer as on the original estimate
5. **Save and Close**:
   - Save the purchase order

### 2. Purchase Order Screens

1. Create Purchase Order Screen
2. Edit Purchase Order Screen

## Automated Email Processing

- Email received from customer triggers an Agentic Workflow routine
- Process email content from the user
- Generate all appropriate Intuit form completions
- Prepare forms for "Human in the Loop" check prior to next juncture:
  - Finalization
  - Return correspondence

## System Integration Notes

- **Quickbooks is made for accounting, SAGE is made for order taking**
- Need to review SAGE work order form structure

## Security Requirements

- **Obfuscate all potentially sensitive or permission-based financial data**

**IMPORTANT**
*July 1st*

Workflow that creates Purchases Orders for all Estimates that have reached a certain status.
