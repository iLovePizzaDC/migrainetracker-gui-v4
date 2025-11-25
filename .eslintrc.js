module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    plugins: ['react', '@typescript-eslint'],
    rules: {
        'semi': ['error', 'always'],
        'quotes': ['error', 'single'],
        'no-trailing-spaces': 'error',
        'react/react-in-jsx-scope': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
