module.exports = {
    env: {
        node: true,
        es2020: true
    },
    parserOptions: {
        ecmaVersion: 11,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:@typescript-eslint/recommended"
    ],
}

