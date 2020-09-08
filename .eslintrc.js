module.exports = {
    env: {
        node: true,
        es2020: true
    },
    parserOptions: {
        ecmaVersion: 2020,
        "sourceType": "module",
        "ecmaFeatures": {
            "modules": true
        },
        project: './tsconfig.json',
    },
    plugins: [
        '@typescript-eslint'
    ],
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript"
    ],
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts'],
        },
        "import/resolver": {
            "node": {
                "extensions": ['.ts']
            }
        }
    }
}

