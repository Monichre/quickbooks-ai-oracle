export default function (plop) {
	// Helper functions
	plop.setHelper("pascalCase", (text) => {
		return text
			.split(/[-_\s]+/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join("");
	});

	plop.setHelper("camelCase", (text) => {
		const pascal = plop.getHelper("pascalCase")(text);
		return pascal.charAt(0).toLowerCase() + pascal.slice(1);
	});

	plop.setHelper("kebabCase", (text) => {
		return text
			.split(/[-_\s]+/)
			.join("-")
			.toLowerCase();
	});

	// COMPONENT GENERATOR
	plop.setGenerator("component", {
		description: "Create a new component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Component name:",
				validate: (value) => {
					if (/.+/.test(value)) {
						return true;
					}
					return "Component name is required";
				},
			},
			{
				type: "list",
				name: "type",
				message: "Component type:",
				choices: ["ui", "kokonutui", "magicui", "admin", "qr-code", "none"],
				default: "ui",
			},
		],
		actions: (data) => {
			const actions = [];
			const componentName = plop.getHelper("pascalCase")(data.name);

			// Set up paths depending on the type
			let componentPath;
			if (data.type !== "none") {
				componentPath = `src/components/${data.type}/${plop.getHelper("kebabCase")(data.name)}`;
			} else {
				componentPath = `src/components/${plop.getHelper("kebabCase")(data.name)}`;
			}

			// Create the component file
			actions.push({
				type: "add",
				path: `${componentPath}/${componentName}.tsx`,
				templateFile: "plop-templates/component/component.hbs",
			});

			// Create the index file
			actions.push({
				type: "add",
				path: `${componentPath}/index.tsx`,
				templateFile: "plop-templates/component/index.hbs",
			});

			return actions;
		},
	});

	// FEATURE GENERATOR
	plop.setGenerator("feature", {
		description: "Create a new feature with its main component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Feature name:",
				validate: (value) => {
					if (/.+/.test(value)) {
						return true;
					}
					return "Feature name is required";
				},
			},
			{
				type: "input",
				name: "component",
				message: "Main component name:",
				default: (data) => {
					return plop.getHelper("pascalCase")(data.name);
				},
			},
		],
		actions: (data) => {
			const actions = [];
			// Assuming features are organized in a feature category folder based on first part of name
			// e.g., user-profile -> user/user-profile
			const nameParts = data.name.split("-");
			const category = nameParts[0];
			const featurePath = `src/features/${category}/${plop.getHelper("kebabCase")(data.name)}`;
			const featureComponent = plop.getHelper("pascalCase")(
				data.component || data.name,
			);

			// Create the feature component file
			actions.push({
				type: "add",
				path: `${featurePath}/${featureComponent}.tsx`,
				templateFile: "plop-templates/feature/component.hbs",
			});

			// Create the feature index file
			actions.push({
				type: "add",
				path: `${featurePath}/index.tsx`,
				templateFile: "plop-templates/feature/index.hbs",
			});

			// Create or modify the category index file
			actions.push({
				type: "add",
				path: `src/features/${category}/index.ts`,
				templateFile: "plop-templates/feature/category-index.hbs",
				skipIfExists: true,
			});

			// Append the export to the category index file if it exists
			actions.push({
				type: "append",
				path: `src/features/${category}/index.ts`,
				pattern: "/* PLOP_EXPORTS */",
				template: `export * from './${plop.getHelper("kebabCase")(data.name)}';`,
			});

			return actions;
		},
	});

	// PAGE GENERATOR
	plop.setGenerator("page", {
		description: "Create a new Next.js page",
		prompts: [
			{
				type: "input",
				name: "path",
				message: 'Page path (e.g. "restaurants/new"):',
				validate: (value) => {
					if (/.+/.test(value)) {
						return true;
					}
					return "Page path is required";
				},
			},
			{
				type: "confirm",
				name: "withLayout",
				message: "Create a layout file?",
				default: false,
			},
			{
				type: "confirm",
				name: "withFeature",
				message: "Create a corresponding feature?",
				default: false,
			},
		],
		actions: (data) => {
			const actions = [];
			const pagePath = `src/app/${data.path}`;
			const pageComponent = data.path.split("/").pop();
			const pageComponentPascal = plop.getHelper("pascalCase")(pageComponent);

			// Create the page file
			actions.push({
				type: "add",
				path: `${pagePath}/page.tsx`,
				templateFile: "plop-templates/page/page.hbs",
			});

			// Optionally create a layout file
			if (data.withLayout) {
				actions.push({
					type: "add",
					path: `${pagePath}/layout.tsx`,
					templateFile: "plop-templates/page/layout.hbs",
				});
			}

			// Optionally create a corresponding feature
			if (data.withFeature) {
				const category = pageComponent;
				const featureName = pageComponent;
				const featurePath = `src/features/${category}/${plop.getHelper("kebabCase")(featureName)}`;

				actions.push({
					type: "add",
					path: `${featurePath}/${pageComponentPascal}.tsx`,
					templateFile: "plop-templates/feature/component.hbs",
				});

				actions.push({
					type: "add",
					path: `${featurePath}/index.tsx`,
					templateFile: "plop-templates/feature/index.hbs",
				});

				actions.push({
					type: "add",
					path: `src/features/${category}/index.ts`,
					templateFile: "plop-templates/feature/category-index.hbs",
					skipIfExists: true,
				});

				actions.push({
					type: "append",
					path: `src/features/${category}/index.ts`,
					pattern: "/* PLOP_EXPORTS */",
					template: `export * from './${plop.getHelper("kebabCase")(featureName)}';`,
				});
			}

			return actions;
		},
	});

	// SERVICE GENERATOR
	plop.setGenerator("service", {
		description: "Create a new service",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Service name:",
				validate: (value) => {
					if (/.+/.test(value)) {
						return true;
					}
					return "Service name is required";
				},
			},
			{
				type: "confirm",
				name: "withApiRoute",
				message: "Create an API route for this service?",
				default: false,
			},
		],
		actions: (data) => {
			const actions = [];
			const serviceName = plop.getHelper("kebabCase")(data.name);
			const servicePath = `src/service/${serviceName}`;

			// Create the service index file
			actions.push({
				type: "add",
				path: `${servicePath}/index.ts`,
				templateFile: "plop-templates/service/index.hbs",
			});

			// Create the service client file
			actions.push({
				type: "add",
				path: `${servicePath}/client.ts`,
				templateFile: "plop-templates/service/client.hbs",
			});

			// Optionally create an API route
			if (data.withApiRoute) {
				actions.push({
					type: "add",
					path: `src/app/api/${serviceName}/route.ts`,
					templateFile: "plop-templates/service/api-route.hbs",
				});
			}

			return actions;
		},
	});
}
