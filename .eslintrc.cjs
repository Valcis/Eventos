/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
    },
    plugins: ['react', 'react-hooks', '@typescript-eslint', 'import', 'unused-imports'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier',
    ],
    settings: {
        react: { version: 'detect' },
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
        'import/order': [
            'warn',
            { 'newlines-between': 'always', alphabetize: { order: 'asc', caseInsensitive: true } },
        ],
        'unused-imports/no-unused-imports': 'warn',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
        '@typescript-eslint/no-unused-vars': [
            'warn',
            { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
    },
    ignorePatterns: ['dist', 'build', 'node_modules', 'src/types/openapi.d.ts'],
}
