import { quickbooksRequest, buildQueryString } from "../api";
import type {
	Employee,
	EmployeeCreateRequest,
	EmployeeUpdateRequest,
	EmployeeDeleteRequest,
	EmployeeQueryParams,
	EmployeeQueryResponse,
} from "./employee.types";

/**
 * Create a new employee in QuickBooks
 * @param employee The employee data to create
 * @returns Promise with the created employee
 */
export async function createEmployee(
	employee: EmployeeCreateRequest,
): Promise<Employee> {
	return quickbooksRequest<Employee, EmployeeCreateRequest>(
		"employee",
		"POST",
		employee,
	);
}

/**
 * Update an existing employee in QuickBooks
 * @param employee The employee data to update (must include Id and SyncToken)
 * @returns Promise with the updated employee
 */
export async function updateEmployee(
	employee: EmployeeUpdateRequest,
): Promise<Employee> {
	return quickbooksRequest<Employee, EmployeeUpdateRequest>(
		"employee",
		"POST",
		employee,
	);
}

/**
 * Delete an employee from QuickBooks (sets Active=false)
 * @param employeeToDelete The employee info to delete (must include Id and SyncToken)
 * @returns Promise with the deletion response
 */
export async function deleteEmployee(
	employeeToDelete: EmployeeDeleteRequest,
): Promise<{ success: boolean }> {
	const { Id, SyncToken } = employeeToDelete;
	// In QuickBooks, employees are deleted by setting Active=false
	return quickbooksRequest<
		{ success: boolean },
		{ Id: string; SyncToken: string; Active: boolean }
	>("employee", "POST", { Id, SyncToken, Active: false });
}

/**
 * Get a specific employee by ID
 * @param employeeId The ID of the employee to retrieve
 * @returns Promise with the employee data
 */
export async function getEmployee(
	employeeId: string,
): Promise<EmployeeQueryResponse> {
	return quickbooksRequest<EmployeeQueryResponse>(`employee/${employeeId}`);
}

/**
 * Query employees with optional filtering parameters
 * @param params Optional query parameters
 * @returns Promise with the employees query response
 */
export async function findEmployees(
	params: EmployeeQueryParams = {},
): Promise<EmployeeQueryResponse> {
	const queryString = buildQueryString(params);
	const endpoint = `query?query=select * from Employee${queryString}`;

	return quickbooksRequest<EmployeeQueryResponse>(endpoint);
}

/**
 * Check if the company has QuickBooks Payroll enabled
 * This affects which fields can be used in Employee API calls
 * @returns Promise with a boolean indicating if payroll is enabled
 */
export async function isPayrollEnabled(): Promise<boolean> {
	// Query the CompanyInfo for PayrollFeature
	const response = await quickbooksRequest<{
		CompanyInfo: {
			Name: string;
			Value: string;
		}[];
	}>("query?query=select * from CompanyInfo where Name = 'PayrollFeature'");

	// Check if PayrollFeature is enabled
	const payrollFeature = response.CompanyInfo?.find(
		(info) => info.Name === "PayrollFeature",
	);

	return payrollFeature?.Value === "true";
}
