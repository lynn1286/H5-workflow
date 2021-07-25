module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        es6: true,
        commonjs: true,
        mocha: true,
        jquery: true,
    },
    extends: ['eslint:recommended', 'standard', 'prettier'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    parser: '@babel/eslint-parser',
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'dot-notation': 'off'
    }
}
