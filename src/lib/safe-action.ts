import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

// Create and export the action function properly
export const action = createSafeActionClient({
	serverErrorLogLevel: "error",
	revalidatePath: false,
});

// Type helper for inferring action input/output types
export type ActionResult<Input, Output> = {
	data?: Output;
	error?: string;
	success: boolean;
};
