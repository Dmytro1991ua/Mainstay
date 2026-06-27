import js from "@eslint/js";
import boundaries from "eslint-plugin-boundaries";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import importX from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist", "node_modules", "src/routeTree.gen.ts", "src/shared/types/api-generated.ts"],
  },
  { settings: { react: { version: "19.2" } } },
  js.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  jsxA11y.flatConfigs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  eslintConfigPrettier,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      "import-x/resolver-next": [createTypeScriptImportResolver()],
    },
    rules: {
      ...reactHooks.configs["recommended-latest"].rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "import-x/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import-x/no-duplicates": "warn",
      "import-x/newline-after-import": "warn",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "routes", pattern: "src/routes/**" },
        { type: "feature", pattern: "src/features/*/**", capture: ["feature"] },
        { type: "shared", pattern: "src/shared/**" },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: [{ type: "shared" }], allow: [{ to: { type: "shared" } }] },
            {
              from: [{ type: "feature" }],
              allow: [
                { to: { type: "shared" } },
                { to: { type: "feature", captured: { feature: "{{ from.captured.feature }}" } } },
              ],
            },
            {
              from: [{ type: "routes" }],
              allow: [
                { to: { type: "shared" } },
                { to: { type: "feature" } },
                { to: { type: "routes" } },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.config.{js,ts}", "src/test/**"],
    languageOptions: { globals: globals.node },
  },
  {
    // TanStack Router's file-based routes always pair a `Route` export with
    // `component`, and shadcn/ui primitives export variant helpers (e.g.
    // `buttonVariants`) alongside the component — both are conventions this
    // rule isn't meant to flag.
    files: ["src/routes/**/*.tsx", "src/shared/ui/**/*.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    // This file imports several ESLint plugins by their default export
    // (the plugin object itself) even though those packages also happen to
    // re-export named members of the same name — normal for flat configs.
    files: ["eslint.config.js"],
    rules: {
      "import-x/no-named-as-default": "off",
      "import-x/no-named-as-default-member": "off",
    },
  },
);
