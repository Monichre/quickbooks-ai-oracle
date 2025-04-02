# Project Template Automation with Plop.js

This project uses [Plop.js](https://plopjs.com) to automate the creation of components, features, pages, and services using standardized templates. This ensures consistency across the codebase and speeds up development.

## Available Generators

The project includes the following generators:

- **Component**: Creates a new UI component
- **Feature**: Creates a new feature with its main component
- **Page**: Creates a new Next.js page
- **Service**: Creates a new service with optional API routes

## Usage

### Running the Generators

You can run the generators in two ways:

1. **Interactive Mode**:

   ```bash
   npm run generate
   ```

   This will prompt you to select the type of generator you want to use.

2. **Direct Mode**:

   ```bash
   npm run generate:component
   npm run generate:feature
   npm run generate:page
   npm run generate:service
   ```

   These commands will run the specific generator directly.

### Generator Details

#### Component Generator

Creates a new component in a type-specific folder structure.

```bash
npm run generate:component
```

**Prompts**:

- **name**: The name of the component (e.g., "button", "user-card")
- **type**: The type of component (ui, kokonutui, magicui, admin, qr-code, none)

**Output**:
For a component named "data-table" of type "ui":

```
src/components/ui/data-table/DataTable.tsx
src/components/ui/data-table/index.tsx
```

If you select "none" as the type:

```
src/components/data-table/DataTable.tsx
src/components/data-table/index.tsx
```

#### Feature Generator

Creates a new feature with its main component.

```bash
npm run generate:feature
```

**Prompts**:

- **name**: The name of the feature (e.g., "user-profile", "product-catalog")
- **component**: The name of the main component (defaults to the feature name in PascalCase)

**Output**:
For a feature named "user-profile" with component "ProfileCard":

```
src/features/user/user-profile/ProfileCard.tsx
src/features/user/user-profile/index.tsx
src/features/user/index.ts (exports the feature)
```

#### Page Generator

Creates a new Next.js page with optional layout and feature.

```bash
npm run generate:page
```

**Prompts**:

- **path**: The page path (e.g., "dashboard", "products/new")
- **withLayout**: Whether to create a layout file (yes/no)
- **withFeature**: Whether to create a corresponding feature (yes/no)

**Output**:
For a page at path "products/new" with layout and feature:

```
src/app/products/new/page.tsx
src/app/products/new/layout.tsx
src/features/new/new/New.tsx
src/features/new/new/index.tsx
src/features/new/index.ts
```

#### Service Generator

Creates a new service with optional API routes.

```bash
npm run generate:service
```

**Prompts**:

- **name**: The name of the service (e.g., "auth", "products")
- **withApiRoute**: Whether to create an API route for this service (yes/no)

**Output**:
For a service named "auth" with API routes:

```
src/service/auth/index.ts
src/service/auth/client.ts
src/app/api/auth/route.ts
```

## Customizing the Templates

The templates for all generators are located in the `plop-templates` directory:

```
plop-templates/
├── component/
│   ├── component.hbs
│   └── index.hbs
├── feature/
│   ├── component.hbs
│   ├── index.hbs
│   └── category-index.hbs
├── page/
│   ├── page.hbs
│   └── layout.hbs
└── service/
    ├── index.hbs
    ├── client.hbs
    └── api-route.hbs
```

You can modify these templates to match your project's specific needs and coding standards.

## Adding New Generators

To add a new generator, edit the `plopfile.js` file in the project root and add a new generator using the `plop.setGenerator()` method. For more information, refer to the [Plop.js documentation](https://plopjs.com/documentation/#getting-started).

## Tips and Best Practices

1. Use the generators consistently to maintain a standardized codebase
2. Customize the templates to match your project's coding standards
3. Consider adding more specific generators for common patterns in your project
4. Use the generated files as starting points and modify them as needed
