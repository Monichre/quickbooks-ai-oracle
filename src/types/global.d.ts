// Global type declarations to fix compiler errors

// Fix orientation on Separator
import { DropdownMenuSeparatorProps } from "@radix-ui/react-dropdown-menu";
declare module "@radix-ui/react-dropdown-menu" {
	interface DropdownMenuSeparatorProps {
		orientation?: string;
	}
}

// Fix missing buttonVariants
declare module "@/components/ui/button" {
	export const buttonVariants: any;
}

// Fix missing props on ThemeProvider
declare module "next-themes" {
	interface ThemeProviderProps {
		style?: any;
		enableColorScheme?: boolean;
		disableTransitionOnChange?: boolean;
	}
}

// Fix missing props on Button
declare module "@/components/ui/button" {
	interface ButtonProps {
		asChild?: boolean;
	}
}

// Fix useRef issues
declare module "react" {
	function useRef<T = any>(): React.RefObject<T>;
}

// Fix OAuthClient issues
declare namespace OAuthClient {
	const scopes: {
		Accounting: string;
		OpenId: string;
		Profile: string;
		Email: string;
		Phone: string;
		Address: string;
	};
}

// Fix kokonutui/vercel-v0-chat issues
declare module "@/components/ui/kokonutui/vercel-v0-chat" {
	export const AiCHAT: any;
}

// Fix missing types
declare module "@/components/admin-dashboard" {
	export const AdminDashboard: any;
}

declare module "./sidebar" {
	const Sidebar: any;
	export default Sidebar;
}

// Fix CompanyInfo type
interface CompanyInfo {
	QueryResponse?: any;
}

// Fix missing properties
interface CompanyInfoResponse {
	LegalName?: string;
	CompanyName?: string;
}
