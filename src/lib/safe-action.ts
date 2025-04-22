import { createSafeActionClient } from "next-safe-action";

export const action = createSafeActionClient({
	serverErrorLogLevel: "error",
	revalidatePath: false,
});
