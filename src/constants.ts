import type { NavCategory } from "@/providers/sidebar-provider";

export const defaultNavLinks: NavCategory[] = [
	{
		category: "Main",
		items: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: "💳",
			},
			{
				title: "Estimates",
				url: "/dashboard/estimates",
				icon: "📈",
			},
			{
				title: "Invoices",
				url: "/dashboard/invoices",
				icon: "📉",
			},
			{
				title: "Bills",
				url: "/dashboard/bills",
				icon: "📉",
			},
			{
				title: "Items",
				url: "/dashboard/items",
				icon: "📉",
			},
			{
				title: "Purchases",
				url: "/dashboard/purchases",
				icon: "📉",
			},
			{
				title: "Purchase Orders",
				url: "/dashboard/purchase-orders",
				icon: "📉",
			},
			{
				title: "Payments",
				url: "/dashboard/payments",
				icon: "📉",
			},
			{
				title: "Profit & Loss",
				url: "/dashboard/profit-and-loss",
				icon: "📉",
			},
		],
	},
	{
		category: "Dashboards",
		items: [
			{
				title: "Customers",
				url: "/dashboard/customers",
				emoji: "👥",
			},
			{
				title: "Employees",
				url: "/dashboard/employees",
				emoji: "👥",
			},
			{
				title: "Products",
				url: "/dashboard/products",
				emoji: "📊",
			},
			{
				title: "Vendors",
				url: "/dashboard/vendors",
				emoji: "💰",
			},

			{
				title: "Accounts",
				url: "/dashboard/accounts",
				emoji: "📝",
			},
			{
				title: "Reports",
				url: "/dashboard/reports",
				emoji: "📝",
			},
			{
				title: "Account List Detail",
				url: "/dashboard/account-list-detail",
				emoji: "⚙️",
			},
		],
	},
];
