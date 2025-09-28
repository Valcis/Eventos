import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
    // Ignorados globales
    {
        ignores: ["dist/**", "node_modules/**", ".idea/**", ".next/**", "out/**", ".turbo/**"],
    },

    // 1) Archivos de configuración (entorno Node)
    {
        files: [
            "eslint.config.*",
            "vite.config.*",
            "tailwind.config.*",
            "postcss.config.*",
            "*.config.*",
            "**/*.config.{js,cjs,mjs,ts}",
        ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.node },
        },
        rules: {
            ...js.configs.recommended.rules,
        },
    },

    // 2) JS/JSX de la app (browser)
    {
        files: ["src/**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.browser },
        },
        plugins: { react, "react-hooks": reactHooks },
        settings: { react: { version: "detect" } },
        rules: {
            ...js.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
    },

    // 3) TS/TSX de la app (browser)
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: process.cwd(),
                ecmaFeatures: { jsx: true },
            },
            globals: { ...globals.browser },
        },
        plugins: { "@typescript-eslint": tsPlugin, react, "react-hooks": reactHooks },
        settings: { react: { version: "detect" } },
        rules: {
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
            "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
            ],
            "react/react-in-jsx-scope": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
    },

    // 4) Desactiva conflictos con Prettier
    prettier,
];
