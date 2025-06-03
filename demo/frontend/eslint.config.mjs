import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: [
      "**/*.{ts,tsx}",
      "*.config.{js,cjs,mjs,ts}",
      ".*rc.{js,cjs,mjs,ts}",
    ],
    ignores: ["node_modules", ".next", "components/ui/*"],
    plugins: {
      react: eslintPluginReact,
      "simple-import-sort": eslintPluginSimpleImportSort,
      "unused-imports": eslintPluginUnusedImports,
      prettier: eslintPluginPrettier,
      "react-hooks": eslintPluginReactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": [
        "warn",
        {
          additionalHooks: "(useMyCustomHook|useMyOtherCustomHook)",
        },
      ],
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          trailingComma: "all",
          bracketSpacing: true,
          tabWidth: 2,
          useTabs: false,
          endOfLine: "auto",
          printWidth: 100,
          jsxSingleQuote: true,
          plugins: ["prettier-plugin-tailwindcss"],
        },
      ],
      "@typescript-eslint/no-unused-vars": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "no-console": "error",
      eqeqeq: "error",
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
    },
  },
];

export default eslintConfig;
