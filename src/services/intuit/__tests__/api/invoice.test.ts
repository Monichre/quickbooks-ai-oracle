import {
	createInvoice,
	getInvoice,
	findInvoices,
	updateInvoice,
	deleteInvoice,
	getInvoicePdf,
	sendInvoicePdf,
} from "../../invoice/invoice.api";
import * as api from "../../api";

// Mock the quickbooksRequest function
jest.mock("../../api", () => ({
	quickbooksRequest: jest.fn(),
	buildQueryString: jest.fn().mockImplementation(() => " WHERE Balance > '0'"),
}));

describe("Invoice API", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockInvoice = {
		Id: "123",
		SyncToken: "0",
		CustomerRef: { value: "customer-1", name: "Test Customer" },
		Line: [
			{
				DetailType: "SalesItemLineDetail",
				Amount: 200,
				Description: "Test Item",
				SalesItemLineDetail: {
					ItemRef: { value: "item-1", name: "Test Item" },
					UnitPrice: 50,
					Qty: 4,
				},
			},
		],
		TxnDate: "2023-01-15",
		DocNumber: "INV-001",
		DueDate: "2023-02-15",
		TotalAmt: 200,
		Balance: 200,
	};

	describe("createInvoice", () => {
		test("should call quickbooksRequest with correct parameters", async () => {
			const newInvoice = {
				CustomerRef: { value: "customer-1" },
				Line: [
					{
						DetailType: "SalesItemLineDetail",
						Amount: 200,
						SalesItemLineDetail: {
							ItemRef: { value: "item-1" },
							UnitPrice: 50,
							Qty: 4,
						},
					},
				],
			};

			(api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({
				Invoice: mockInvoice,
			});

			const result = await createInvoice(newInvoice);

			expect(api.quickbooksRequest).toHaveBeenCalledWith("invoice", "POST", {
				Invoice: newInvoice,
			});
			expect(result).toEqual({ Invoice: mockInvoice });
		});
	});

	describe("getInvoice", () => {
		test("should call quickbooksRequest with correct parameters", async () => {
			(api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({
				Invoice: mockInvoice,
			});

			const result = await getInvoice("123");

			expect(api.quickbooksRequest).toHaveBeenCalledWith("invoice/123");
			expect(result).toEqual({ Invoice: mockInvoice });
		});
	});

	describe("findInvoices", () => {
		test("should call quickbooksRequest with correct parameters and no filters", async () => {
			const mockInvoices = {
				QueryResponse: {
					Invoice: [mockInvoice],
				},
			};

			(api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockInvoices);

			const result = await findInvoices();

			expect(api.buildQueryString).toHaveBeenCalledWith({});
			expect(api.quickbooksRequest).toHaveBeenCalledWith(
				"query?query=select * from Invoice WHERE Balance > '0'",
			);
			expect(result).toEqual(mockInvoices);
		});

		test("should call quickbooksRequest with filters", async () => {
			const mockInvoices = {
				QueryResponse: {
					Invoice: [mockInvoice],
				},
			};

			(api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockInvoices);

			const result = await findInvoices({
				CustomerRef: "customer-1",
				limit: 10,
			});

			expect(api.buildQueryString).toHaveBeenCalledWith({
				CustomerRef: "customer-1",
				limit: 10,
			});
			expect(api.quickbooksRequest).toHaveBeenCalledWith(
				"query?query=select * from Invoice WHERE Balance > '0'",
			);
			expect(result).toEqual(mockInvoices);
		});
	});

	describe("updateInvoice", () => {
		test("should call quickbooksRequest with correct parameters", async () => {
			const updateData = {
				Id: "123",
				SyncToken: "0",
				CustomerRef: { value: "customer-1" },
				Line: [
					{
						DetailType: "SalesItemLineDetail",
						Amount: 300,
						SalesItemLineDetail: {
							ItemRef: { value: "item-1" },
							UnitPrice: 50,
							Qty: 6,
						},
					},
				],
			};

			(api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({
				Invoice: { ...updateData, SyncToken: "1" },
			});

			const result = await updateInvoice(updateData);

			expect(api.quickbooksRequest).toHaveBeenCalledWith("invoice", "POST", {
				Invoice: updateData,
			});
			expect(result).toEqual({ Invoice: { ...updateData, SyncToken: "1" } });
		});
	});

	describe("deleteInvoice", () => {
		test("should call quickbooksRequest with correct parameters", async () => {
			(api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({
				Invoice: { ...mockInvoice, status: "Deleted" },
			});

			const result = await deleteInvoice("123", "0");

			expect(api.quickbooksRequest).toHaveBeenCalledWith(
				"invoice?operation=delete",
				"POST",
				{ Id: "123", SyncToken: "0" },
			);
			expect(result).toEqual({
				Invoice: { ...mockInvoice, status: "Deleted" },
			});
		});
	});

	describe("getInvoicePdf", () => {
		test("should call quickbooksRequest with correct parameters", async () => {
			const mockPdfBlob = new Blob(["pdf data"], {
				type: "application/pdf",
			});
			(api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockPdfBlob);

			const result = await getInvoicePdf("123");

			expect(api.quickbooksRequest).toHaveBeenCalledWith(
				"invoice/123/pdf",
				"GET",
			);
			expect(result).toEqual(mockPdfBlob);
		});
	});

	describe("sendInvoicePdf", () => {
		test("should call quickbooksRequest with correct parameters and no email", async () => {
			(api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({
				Invoice: { ...mockInvoice, EmailStatus: "EmailSent" },
			});

			const result = await sendInvoicePdf("123");

			expect(api.quickbooksRequest).toHaveBeenCalledWith(
				"invoice/123/send",
				"POST",
			);
			expect(result).toEqual({
				Invoice: { ...mockInvoice, EmailStatus: "EmailSent" },
			});
		});

		test("should call quickbooksRequest with correct parameters and custom email", async () => {
			(api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({
				Invoice: { ...mockInvoice, EmailStatus: "EmailSent" },
			});

			const result = await sendInvoicePdf("123", "test@example.com");

			expect(api.quickbooksRequest).toHaveBeenCalledWith(
				"invoice/123/send?sendTo=test@example.com",
				"POST",
			);
			expect(result).toEqual({
				Invoice: { ...mockInvoice, EmailStatus: "EmailSent" },
			});
		});
	});
});
