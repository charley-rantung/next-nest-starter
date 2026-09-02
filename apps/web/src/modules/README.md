# Modules

## Import Convention

All components and hooks should be imported from the **first-level domain barrel** only.

### ✅ Do

```tsx
import { CreateUserForm, SignInForm, CreateRoleForm } from "@/modules/user"
```

### ❌ Don't

```tsx
import { CreateUserForm } from "@/modules/user/_form/CreateUserForm"
import { SignInForm } from "@/modules/user/auth/_form/SignInForm"
import { CreateRoleForm } from "@/modules/user/role/_form/CreateRoleForm"
```

### Why

- Each domain barrel (`modules/user/index.ts`) re-exports everything from its subdomains (`auth/`, `role/`)
- Consumers only need to know the domain name, not the internal folder structure
- Internal restructuring (moving files, renaming folders) doesn't break consumer imports

## Structure

```
modules/
├── index.ts              → re-exports from ./user
└── user/
    ├── index.ts          → re-exports from ./_form, ./auth, ./role
    ├── _form/
    │   ├── index.ts
    │   ├── CreateUserForm.tsx
    │   ├── UpdateUserForm.tsx
    │   └── UpdateMyPassword.tsx
    ├── auth/
    │   ├── index.ts      → re-exports from ./_form
    │   └── _form/
    │       ├── index.ts
    │       ├── SignInForm.tsx
    │       ├── ForgotPasswordForm.tsx
    │       ├── RecoveryCodeForm.tsx
    │       └── ResetPasswordForm.tsx
    └── role/
        ├── index.ts      → re-exports from ./_form
        └── _form/
            ├── index.ts
            ├── CreateRoleForm.tsx
            └── UpdateRoleForm.tsx
```

## Folder Naming Convention

Prefix `_` (underscore) distinguishes **owned components** from **submodules**.

| Folder | Meaning |
|---|---|
| `_form/`, `_components/` | Owned by parent module — implementation detail, not a separate domain |
| `auth/`, `role/` | Submodule — has its own barrel file, own internal structure, can have its own `_xxx/` folders |

### Example

```
user/
  _form/          ← owned by user module
  auth/           ← submodule (own barrel, own _form/)
  role/           ← submodule (own barrel, own _form/)
```

### Rules

- A folder with `_` prefix has **no submodule barrel** — it only contains component files and a simple re-export barrel
- A folder without `_` prefix is a **submodule** — it has its own `index.ts` that re-exports from its internal `_xxx/` folders
- This convention keeps the structure scannable: you can instantly tell what's a detail vs. what's a domain

## Adding a New Module

1. Create the folder under `modules/` (e.g. `modules/product/`)
2. Create `_form/` or component folders inside it
3. Add barrel files (`index.ts`) at each level using `export *`
4. Re-export the new domain from `modules/index.ts`

```ts
// modules/index.ts
export * from "./user"
export * from "./product"  // add this
```
