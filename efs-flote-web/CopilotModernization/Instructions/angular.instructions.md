---
description: "Use when writing or reviewing Angular TypeScript, templates, styles, services, components, routing, or state management. Covers standalone components, dependency injection, and maintainable application structure."
name: "Angular Standards"
applyTo: ["**/*.ts", "**/*.html", "**/*.scss"]
---
# Angular Standards

- Check `angular/README.md` first, then use a more specific Angular subdomain if one matches the task.
- Prefer standalone components.
- Prefer `inject()` for dependency injection in new code.
- Default components to `ChangeDetectionStrategy.OnPush` unless a concrete reason requires otherwise.
- Prefer reactive forms for non-trivial form workflows.
- Keep components thin and move stateful or integration logic into services.
- Use `takeUntilDestroyed` or equivalent Angular lifecycle-safe cleanup for subscriptions.
- Favor clear inputs, outputs, and typed interfaces over implicit object shapes.
- When a template exists in `angular/Templates/`, adapt it instead of generating a fresh pattern.

---


### Rules

- One file: `src/app/app.constants.ts` — never duplicate constants in feature folders.
- Use `export const` for each value; never wrap them in a class, object, or `enum`.
- Group constants by concern with section header comments (Pagination, Record limits, UI Messages, etc.).
- Add a brief JSDoc above each constant explaining what it controls.
- Import only what you need by name: `import { GRID_RECORD_LIMIT, MSG_UNAUTHORIZED } from '../app.constants';`
- Do **not** put environment-specific values (URLs, tenant IDs, client IDs) here — those come from `environment.ts` populated at runtime by the server `/api/Environment` endpoint.

### Standard Constants

Every app should define at least:

```typescript
// — Pagination ————————————————————————————————————————————————
export const RESULTS_PER_PAGE_OPTIONS = [
  { value: '25',  isDisabled: false, label: '25',  dropdownID: 'upsacpagination25' },
  { value: '50',  isDisabled: false, label: '50',  dropdownID: 'upsacpagination50' },
  { value: '100', isDisabled: false, label: '100', dropdownID: 'upsacpagination100' },
];

// — Record limits —————————————————————————————————————————————
/** Default number of rows fetched for grid display. */
export const GRID_RECORD_LIMIT = 1000;

/** Maximum rows included when exporting to Excel. */
export const EXCEL_EXPORT_LIMIT = 50000;

/** Default starting index for paginated API calls. */
export const DEFAULT_START_INDEX = 0;

// — UI Messages ———————————————————————————————————————————————
export const MSG_NO_RECORDS_FOUND =
  'No records found matching the current filters.';

export const MSG_UNAUTHORIZED =
  'You do not have access to this functionality. ' +
  'Please contact your administrator if you believe this is an error.';

export const MSG_GENERIC_ERROR =
  'The request failed. Please try again. ' +
  'If the issue continues, reach out to your support contact.';
```

### Usage Rules

- `RESULTS_PER_PAGE_OPTIONS` is the required input shape for every `ups-ac-pagination` `[resultsPerPageOptions]` binding.
- `GRID_RECORD_LIMIT` is the default page size for grid fetches — never use the literal `1000`.
- `EXCEL_EXPORT_LIMIT` is the override applied to the filter immediately before any Excel export call (`filter.limit = EXCEL_EXPORT_LIMIT`).
- `MSG_UNAUTHORIZED` is the toast message for `error.status === 401`; `MSG_GENERIC_ERROR` is the toast for all other errors; `MSG_NO_RECORDS_FOUND` is the empty-state message.

---