// Defines the linting rules.
//
// Run with `npm run lint -- --no-fix`.
// `npm run lint` fixes by default,
// `npm run serve` and `npm run build`
// run the linter but don't auto-fix.
//
// Base ESLint Rules:
// https://eslint.org/docs/rules/

module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'plugin:vue/recommended',  // rules list: https://eslint.vuejs.org/rules/
        '@vue/airbnb',  // rules list: https://github.com/airbnb/javascript
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
    },
    plugins: [
        'vue',
    ],
    rules: {
        // SPACING
        'comma-spacing': 'error',
        'indent': ['error', 4,
                   {SwitchCase: 1,
                    MemberExpression: 2,
                    ArrayExpression: 'first',
                    ObjectExpression: 'first',
                    ImportDeclaration: 'first',
                    FunctionDeclaration: {parameters: 'first'},
                    FunctionExpression: {parameters: 'first'},
                    CallExpression: {arguments: 'first'},}],
        'no-trailing-spaces': 'error',
        'space-in-parens': ['error', 'never'],
        'space-before-function-paren': ['error', 'never'],
        'key-spacing': ['error', {beforeColon: false, afterColon: true}],
        'space-before-blocks': 'error',
        'keyword-spacing': ['error', {before: true, after: true}],
        'arrow-spacing': ['error', {before: true, after: true}],
        'no-multi-spaces': ['error', {ignoreEOLComments: true}],
        'spaced-comment': ['error', 'always'],
        'object-curly-spacing': ['error', 'never',
                                 {arraysInObjects: false, objectsInObjects: false}],
        'array-bracket-spacing': 'error',
        'computed-property-spacing': 'error',

        // STYLISTIC ISSUES
        'max-len': ['warn', {code: 100}],  // overriden by vue/max-len for vue files

        // VARIABLE & FUNCTION DECLARATION
        'camelcase': 'off',
        'vars-on-top': 'error',
        'block-scoped-var': 'error',
        'no-var': 'error',
        'no-multi-assign': 'error',
        'no-undef': 'error',
        'no-redeclare': 'error',
        'no-shadow': 'error',
        'prefer-const': 'warn',
        'prefer-template': 'warn',
        'prefer-destructuring': 'warn',
        'dot-notation': 'error',
        'no-param-reassign': 'warn',
        'no-unused-vars': ['error', {args: 'after-used'}],
        'object-shorthand': 'warn',
        'func-names': 'warn',


        // OPERATORS
        'eqeqeq': 'error',
        'no-plusplus': ['error', {allowForLoopAfterthoughts: true}],
        'no-mixed-operators': 'error',
        'space-infix-ops': 'off',  // annonying for e.g. 3*5 + 2*3
        'space-unary-ops': 'error',
        'operator-linebreak': 'off',


        // SYNTAX
        'comma-dangle': ['error', 'always-multiline'],
        'semi': ['error', 'never'],
        'brace-style': ['error', '1tbs', {allowSingleLine: true}],
        'object-curly-newline': ['error', {
            ObjectExpression: {consistent: true},
            ObjectPattern: {consistent: true},
            ImportDeclaration: 'never',
            ExportDeclaration: 'never',
        }],
        'quotes': ['error', 'single', {avoidEscape: true, allowTemplateLiterals: true}],
        'quote-props': ['error', 'consistent-as-needed'],
        'arrow-parens': ['warn', 'as-needed'],


        // USE SPECIFIC OF FUNCTIONS
        'array-callback-return': 'error',
        'no-lonely-if': 'error',
        'no-else-return': 'error',
        'no-console': 'warn',
        'no-alert': 'warn',
        'no-prototype-builtins': 'error',
        'no-restricted-globals': 'error',
        'radix': 'error',
        'consistent-return': 'error',
        'no-throw-literal': 'error',
        'no-array-constructor': 'error',
        'no-restricted-syntax': 'error',


        // VUE-SPECIFIC RULES
        'vue/max-len': ['error', {
            code: 100,
            template: 120,
            comments: 120,
            ignorePattern: '',
            ignoreComments: false,
            ignoreTrailingComments: true,
            ignoreUrls: true,
            ignoreStrings: false,
            ignoreTemplateLiterals: false,
            ignoreRegExpLiterals: false,
            ignoreHTMLAttributeValues: false,
            ignoreHTMLTextContents: true,
        }],
        'vue/no-unused-vars': 'error',
        'vue/require-v-for-key': 'error',
        'vue/no-parsing-error': 'error',
        'vue/no-side-effects-in-computed-properties': 'warn',
        'vue/require-prop-type-constructor': 'warn',
        'vue/no-use-v-if-with-v-for': 'warn',

        'vue/comment-directive': 'off',


        // IMPORT
        'import/newline-after-import': 'error',
        'import/order': 'error',
        'import/extensions': 'error',
        'import/no-dynamic-require': 'warn',
        'import/no-extraneous-dependencies': 'warn',

        'import/prefer-default-export': 'off',
        'global-require': 'off',
    },
    overrides: [{
        files: ['*.vue'],
        rules: {
            'max-len': 'off',  // overriden by vue/max-len
        },
    }],
}
