# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Practice log: verifying `main` branch protection

Steps taken to confirm the `main` branch's "Protect main" ruleset (required `verify` status check) actually blocks merging on failing CI:

1. Created branch `test/branch-protection-check` and intentionally broke a test (changed the empty-state text in `src/App.tsx`).
2. Pushed and opened [PR #2](https://github.com/hyeonbinchun/ai-harness-todo/pull/2) against `main`.
3. Confirmed the `verify` check failed and the PR's merge state was `BLOCKED`.
4. Fixed the text back, pushed again, and confirmed `verify` passed and the merge state became `CLEAN`.

PR #2 is kept open (not merged) as a record of this test.
