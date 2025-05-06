---
description: 
globs: 
alwaysApply: false
---
# Linking Item Receipts and Bills to Purchase Orders, Invoices to Sales Orders

In QuickBooks, users can receive items against purchase orders, and the purchase orders will be automatically updated. The same happens when users enter bills against purchase orders. Similarly, users can invoice against existing sales orders, and the sales orders are automatically updated.

In the SDK, the request messages for adding item receipts, bills, and invoices contain elements for identifying the originating purchase order or sales order. Supplying information that identifies the purchase order or sales order achieves the same results that adding an item receipt, bill, or sales order through the UI does – the purchase order or sales order is updated.

> **Note:** In the SDK, this functionality is only available with add requests – not in modify requests.

## Linking Item Receipts and Bills to Purchase Orders

The message elements for identifying the originating purchase orders are `LinkToTxn` and `LinkToTxnId`, so the process is referred to as linking item receipts or bills to purchase orders, and once the request has been sent, the transactions are referred to as linked transactions.

### Linking in the QuickBooks UI

The following steps briefly review the process for linking transactions in the QuickBooks UI:

1. When a user creates an item receipt or a bill, the user also selects a vendor. If there are any open purchase orders for that vendor, QuickBooks presents the user with a selection list of purchase orders.
2. After the user links the item receipt or bill to a purchase order, QuickBooks fills the item receipt or bill with data from the selected purchase order, so that the item receipt or bill contains every receivable line item from the purchase order.
3. The user's next action depends on whether the items received complete the purchase order:

   a. If the received items complete the originating purchase order, the user clicks "Save and Close" button. The purchase order will indicate that all its items were received.

   b. If the user received only some of the items in the purchase order, the user modifies the quantity field for any line item that was not fully received. The purchase order would not display the "Received in Full" stamp, but would show received and unreceived items with the number received indicated.

### Linking with the SDK

The results achieved in the UI scenario are accomplished in the SDK by supplying transaction IDs in `ItemReceiptAddRq` or `BillAddRq` messages to indicate which purchase orders should be linked:

- To link an item receipt or bill to one or more **entire** purchase orders (to indicate that all of the line items have been received or billed and close out the purchase order), use the `LinkToTxnID` element to identify the purchase order. This will add all line items in the specified purchase order to the item receipt or bill. Purchase orders linked in this way will be marked as received in full and closed.
- To link an item receipt or bill to a **subset** of the line items in one or more purchase orders, use the `LinkToTxn` aggregate inside the `ItemLineAdd` aggregate. Purchase orders linked to item receipts in this way will be closed only when all of the items have been received.

> **Note:** Purchase Orders are automatically closed and marked as fully received when the item receipts linked to them fully receive the purchase order line items. However, if you want to close a Purchase Order or close out line items without receiving the items, you can perform a `PurchaseOrderMod` and manually close individual line items or the Purchase Order itself.

### Request Message for a Bill That Operates on All Purchase Order Lines

The following sample `BillAddRq` message shows a bill linked to two different purchase orders using `LinkToTxnID`. The resulting bill will contain all the line items from both specified purchase orders:

```xml
<?qbxml version="4.0"?>
<QBXML>
    <QBXMLMsgsRq onError="stopOnError">
        <BillAddRq requestID="2">
            <BillAdd>
                <VendorRef>
                    <FullName>Daigle Lighting</FullName>
                </VendorRef>
                <APAccountRef>
                    <FullName>Accounts Payable</FullName>
                </APAccountRef>
                <TxnDate>2004-10-28</TxnDate>
                <DueDate>2004-11-28</DueDate>
                <TermsRef>
                    <FullName>Net 30</FullName>
                </TermsRef>
                <LinkToTxnID>25D6-1071508328</LinkToTxnID>
                <LinkToTxnID>53C4-1197730858</LinkToTxnID>
            </BillAdd>
        </BillAddRq>
    </QBXMLMsgsRq>
</QBXML>
```

In the above sample request, note:

- The `VendorRef` element – the vendor must match the vendor in all purchase orders identified in the message. A message can only specify one vendor.
- The `APAccountRef` element – while not required, using this element is highly recommended.
- The use of two `LinkToTxnID` elements to identify the two purchase orders to be linked and closed.

### Request Message for a Bill That Operates on Selected Purchase Order Lines

The following sample `BillAddRq` message shows a bill linked to two line items from one purchase order:

```xml
<?qbxml version="4.0"?>
<QBXML>
    <QBXMLMsgsRq onError="stopOnError">
        <BillAddRq requestID="2">
            <BillAdd>
                <VendorRef>
                    <FullName>Daigle Lighting</FullName>
                </VendorRef>
                <APAccountRef>
                    <FullName>Accounts Payable</FullName>
                </APAccountRef>
                <TxnDate>2004-10-28</TxnDate>
                <DueDate>2004-11-28</DueDate>
                <TermsRef>
                    <FullName>Net 30</FullName>
                </TermsRef>
                <ItemLineAdd>
                    <LinkToTxn>
                        <TxnID>53DD-1197743928</TxnID>
                        <TxnLineID>53DF-1197743928</TxnLineID>
                     </LinkToTxn>
                </ItemLineAdd>
                <ItemLineAdd>
                    <LinkToTxn>
                        <TxnID>53DD-1197743928</TxnID>
                        <TxnLineID>53E0-1197743928</TxnLineID>
                    </LinkToTxn>
                </ItemLineAdd>
            </BillAdd>
        </BillAddRq>
    </QBXMLMsgsRq>
</QBXML>
```

### Rules for Linking Item Receipts and Bills to Purchase Orders

The following rules are enforced during runtime:

1. Don't use the same `TxnID` in a `LinkToTxnID` element and a `LinkToTxn` aggregate in the same item receipt or bill.
2. If you link to specific line items with the `LinkToTxn` aggregate, you must maintain the order of lines between the item receipt or bill and the purchase order.
3. If you use `LinkToTxn` aggregates, you cannot *mix* lines from different purchase orders in the ItemReceipt or Bill. You must list all desired lines of purchase order A, in order, before specifying any lines of purchase order B.
4. If a purchase order contains a group line item, you must link to the individual lines *within the group*, not to the group itself.
5. When linking an item receipt or bill to a purchase order, the vendors (in the `VendorRef` aggregates) for each of these must match.
6. You may only link to receivable purchase order lines. For that purchase order line, the `ReceivedQuantity` element must exist, it cannot be marked manually closed, and the `Quantity` must be greater than the `ReceivedQuantity`.
7. You cannot specify both an `ItemRef` and a `LinkToTxn` aggregate within the same line item.

## Converting Item Receipts to Bills

The QuickBooks UI makes it look like item receipts can be linked to bills, but it actually converts the item receipt to a bill. If you query for the item receipt, it will no longer be there, and the purchase order will show only the link to the bill.

This same functionality does not exist in the SDK. However, you can achieve the same result by deleting the ItemReceipt using the `TxnDel` request and using `BillAdd` to link a bill to the PurchaseOrder instead of an ItemReceipt.

## Split Option for Bills and Item Receipts in QuickBooks Enterprise

ItemReceipt and Bill transaction split is a feature that allows an ItemReceipt and a Bill to be two transactions on their own instead of one transaction that shares the ItemReceipt and Bill states. This feature is available only to Enterprise users and is controlled by a QuickBooks preference.

Key aspects of this feature:

- ItemReceipt and Bill can be edited simultaneously
- Two new link types are introduced:
  - Linking from a Purchase Order to a Bill
  - Linking from ItemReceipt to Bill or reverse
- ItemReceipt cost is no longer editable and will contain the average costing of the Bills
- A new Inventory Offset account is introduced
- ItemReceipts post against Inventory Offset and Inventory Asset/income/expense
- Bills post against Account Payable and Inventory Offset

## Linking Invoices to Sales Orders

The procedures for linking invoices to sales orders are very similar to those for linking item receipt and bills to purchase orders.

> **Note:** Since a sales order is a non-posting transaction, QuickBooks business logic doesn't require the sales tax information when a sales order is added. However, business logic does require the sales tax item for an invoice. If a sales order doesn't have a SalesTaxItem set, you need to add it with a modify request before creating an invoice using that sales order.

### Linking in the QuickBooks UI

1. When a user creates an invoice and selects a customer, if there are any outstanding sales orders for that customer, QuickBooks presents a selection list of sales orders.
2. If the user selects one or more sales orders, the user is prompted for the type of linking:

   a. If the user chooses "Create invoice for all of the sales order(s)", all line items from each selected sales order will be added to the invoice.

   b. If the user chooses "Create invoice for selected items", an invoice quantities form is displayed to allow the user to change quantities before the sales order lines are pulled into the invoice.

### Automatic Selection of Invoice Template

In the UI, if the user invoices against more than one sales order, the default invoice template changes to the multiple sales order template. This same behavior is reflected in the Desktop SDK.

### Linking with the SDK

The results are achieved in the SDK by supplying transaction IDs in `InvoiceAddRq` messages:

- To link an invoice to one or more entire sales orders, use the `LinkToTxnID` element. Sales orders linked this way will be marked as fully invoiced and closed.
- To link an invoice to a subset of line items in sales orders, use the `LinkToTxn` aggregate inside the `ItemLineAdd` aggregate. Sales orders linked this way will be closed only after all items are invoiced.

> **Note:** If you link your invoice to a sales order that contains a customer address, the sales order's address will be used, even if you specify a different `BillAddress` and/or `ShipAddress` in the `InvoiceAdd`. If you need to update the address data, you can do an `InvoiceMod` after the `InvoiceAdd`.

### Rules for Linking Invoices to Sales Orders

The rules are the same as those for linking item receipts and bills to purchase orders.

## Why Does the API Reference List LinkToTxn for Unsupported Transactions?

Because of the way the qbXML spec uses macros to ensure common elements are consistent across multiple request types, the `LinkToTxn` aggregate within the `ItemLineAdd` aggregate also appears in the `VendorCreditAdd`, `CheckAdd`, `CreditCardChargeAdd`, and `CreditCardCreditAdd` requests, even though these are *not* implemented. Attempting to use the `LinkToTxn` aggregate in those requests will result in a "not supported" warning (statusCode 530).

## Limitations of Modifying Bills and Item Receipts

You cannot link a PurchaseOrder to a Bill or ItemReceipt in the `BillMod` and `ItemReceiptMod` requests. That is, you cannot add new lines that link to a PurchaseOrder to an existing Bill or ItemReceipt. Also, when you modify transaction lines in a Bill or an ItemReceipt, you may lose links between the Bill and the PurchaseOrder or between the ItemReceipt and the PurchaseOrder.

## Querying for Linked Transactions

You can find transactions linked to purchase orders and sales orders by setting the `IncludeLinkedTxns` element to true in the purchase order or sales order query. By default, linked transactions are not returned.

However, only the linked transaction as a whole is returned (the txnID), not any txnLineIDs. This is fine if you linked the whole transaction, but you cannot retrieve line item information to see which line items in the PurchaseOrder/SalesOrder came from which lines in the bill, item receipt, or invoice.

## "Is Manually Closed" in Purchase Orders and Sales Orders

On a purchase order, a check in the Closed column can indicate either that the items have been received in full or that the line item has been manually closed. To determine why a line item was closed, check its `IsManuallyClosed` field in `PurchaseOrderLineRet`. If this field is False, then compare the `ReceivedQuantity` value with the `Quantity` originally ordered. If the `Quantity` is equal to the `ReceivedQuantity` value, the order is fully received.

> **Note:** If you try to manually close a line that has already been fully received, you will receive an error.

The `IsManuallyClosed` flag on the main transaction takes precedence over the `IsManuallyClosed` flag on individual lines. To avoid ambiguity, if the `IsManuallyClosed` flag is specified for the main transaction, do not set it for individual lines.
