const baseApi = "https://www.promoplace.com/ws/ws.dll/ConnectAPI";
const SERVICE_IDS = {
	inventoryStatus: 107,
	productSearch: 103,
	basicProdcutDetail: 104,
	fullProductDetail: 105,
	orderForms: 501,
	orderStatus: 502,
};
const authConfig = {
	key: process.env.SAGE_AUTHENTICATION_KEY,
	acctId: process.env.SAGE_ACCOUNT_ID,
	loginId: process.env.SAGE_SYSTEM_LOGIN_ID,
	apiVer: 130,
};

export const fetchSage = async (
	serviceId: number,
	params: Record<string, string>,
) => {
	const response = await fetch(baseApi, {
		method: "POST",
		body: JSON.stringify({
			serviceld: serviceId,
			acctId: authConfig.acctId,
			loginId: authConfig.loginId,
			key: authConfig.key,
			...params,
		}),
	});

	console.log("🚀 ~ fetchSage ~ response:", response);
};
