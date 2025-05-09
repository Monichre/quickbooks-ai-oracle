# Quickbooks/Intuit + Sage AI Oracle

## Intuit

[Product Requirements Doc](docs/PRD.md)

**Intuit Data Model**

The Quickbooks integration provides access to the following data model:

![Quickbooks Entity Relationship Diagram](docs/quickbooks-erd.svg)

The diagram shows the relationships between key Quickbooks entities including:

- Company (CompanyInfo)
- Accounts
- Customers
- Vendors
- Items
- Transactions (Invoices, Payments, Bills)
- Estimates and Purchase Orders

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



### **NOTES FOR HUMANS - AI Agents Ignore This**

*Last updated: {{DATE}}*

[Copy an estimate to a purchase order](https://quickbooks.intuit.com/learn-support/en-us/help-article/new-subscriptions/copy-estimate-purchase-order/L7Z08es7a_US_en_US)




# **Copy an estimate to a purchase order**

**by Intuit•207•Updated about 21 hours ago**

Learn how to copy an estimate onto a purchase order in QuickBooks Online.

 Purchase orders are only available in QuickBooks Online Plus and QuickBooks Online Advanced. If you need to, you can [**upgrade your plan**](https://app.qbo.intuit.com/app/login?pagereq=billing/?cid=OHH-CS_SDR-US-QBO-QBOAV-NA-XSLL-EDU-NA-PB-SDR_IAPers_Unknown).

To streamline your process once a customer approves your estimate you can easily copy it to a purchase order. In this article, we'll show you how.

**Note**: This option isn't available yet for the new estimate and invoice layout. [**Find out which layout you have**](https://community.intuit.com/oicms/L9jVVT2GY_US_en_US).

## **Step 1: Turn on the purchase order feature**

1. Go to **Settings** , then select **Account and settings**.
2. Go to **Expenses**.
3. Select the **pencil**✎ icon in the **Purchase orders** section.
4. Turn on the **Use purchase orders** switch.
5. Select **Save**, then **Done**.

## **Step 2: Copy estimate to a purchase order**

1. Select **+ New**.
2. Select Estimate.
3. Enter customer and product or service details. Then select **Save**.
4. A dropdown choice of **Create invoice** or**Copy to purchase order** will appear next to the amount.
5. Select **Copy to purchase order**.
6. Select a **Vendor**.
7. In the Item details section, select the same customer mentioned on the purchase order.
8. Select **Save and close**.


"""
Only items marked as purchased from vendors get copied over to purchase orders. Verify that your products or services are marked accordingly.

1. Go to **Settings**⚙, then select **Products & services** ([**Take me there**](https://c1.qbo.intuit.com/qbo1/login?pagereq=items)).
2. Find the product or service. Then select **Edit**.
3. In the **Purchasing information** section, select the **I purchase this product/service from a vendor** checkbox.
4. Select **Save and close**.
"""


# Shop Sanel Sandbox Company (Mike's Instance)
MERCHANT_ID=9999993056997384
COMPANY_ID=9341454477211880
