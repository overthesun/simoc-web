// Defines the linting rules.
//
// Run with `npm run lint`.
// `npm run serve` and `npm run build` run the linter too
// (this is defined in vite.config.mjs).
//
// Rules:
// https://eslint.org/docs/latest/rules/
// https://eslint.vuejs.org/rules/
// https://github.com/vitest-dev/eslint-plugin-vitest#rules

import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import vitest from '@vitest/eslint-plugin'


export default [
    js.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    {
        rules: {

            // SPACING
            'indent': [
                'error',
                4,
                {
                    SwitchCase: 1,
                    MemberExpression: 2,
                    ArrayExpression: 'first',
                    ObjectExpression: 'first',
                    ImportDeclaration: 'first',
                    FunctionDeclaration: {parameters: 'first'},
                    FunctionExpression: {parameters: 'first'},
                    CallExpression: {arguments: 'first'},
                },
            ],
            'no-trailing-spaces': 'error',
            'comma-spacing': 'error',
            'space-in-parens': ['error', 'never'],
            'space-before-function-paren': ['error', 'never'],
            'function-paren-newline': ['error', 'consistent'],
            'function-call-argument-newline': 'off',
            'key-spacing': ['error', {beforeColon: false, afterColon: true}],
            'space-before-blocks': 'error',
            'keyword-spacing': ['error', {before: true, after: true}],
            'arrow-spacing': ['error', {before: true, after: true}],
            'no-multi-spaces': ['error', {ignoreEOLComments: true}],
            'no-multiple-empty-lines': ['error', {max: 2}],
            'spaced-comment': ['error', 'always'],
            'object-curly-spacing': ['error', 'never',
                                     {arraysInObjects: false, objectsInObjects: false}],
            'array-bracket-spacing': 'error',
            'padded-blocks': ['error', 'never'],
            'object-property-newline': 'off',
            'computed-property-spacing': 'error',

            // STYLISTIC ISSUES
            'max-len': ['warn', {code: 100}], // overriden by vue/max-len for vue files

            // VARIABLE & FUNCTION DECLARATION
            'camelcase': 'off',
            'vars-on-top': 'error',
            'one-var': ['error', 'never'],
            'block-scoped-var': 'error',
            'no-var': 'error',
            'no-multi-assign': 'error',
            'no-undef': 'error',
            'no-redeclare': 'error',
            'no-shadow': 'error',
            'prefer-const': 'warn',
            'prefer-template': 'warn',
            'prefer-destructuring': ['warn', {object: true, array: false}],
            'dot-notation': 'error',
            'no-param-reassign': ['error', {props: false}],
            'no-unused-vars': [
                'error',
                {
                    args: 'none',
                    varsIgnorePattern: 'mapState|mapGetters|mapMutations|mapActions',
                },
            ],
            'object-shorthand': ['error', 'methods', {avoidQuotes: true}],
            'func-names': ['error', 'as-needed'],

            // OPERATORS
            'eqeqeq': 'error',
            'no-plusplus': ['error', {allowForLoopAfterthoughts: true}],
            'no-mixed-operators': ['error', {allowSamePrecedence: true}],
            'space-infix-ops': 'off',  // annonying for e.g. 3*5 + 2*3
            'space-unary-ops': 'error',
            'operator-linebreak': 'off',

            // SYNTAX
            'comma-dangle': [
                'error',
                {
                    arrays: 'always-multiline',
                    objects: 'always-multiline',
                    imports: 'always-multiline',
                    exports: 'always-multiline',
                    functions: 'never',
                },
            ],
            'semi': ['error', 'never'],
            'brace-style': ['error', '1tbs', {allowSingleLine: true}],
            'object-curly-newline': [
                'error',
                {
                    ObjectExpression: {consistent: true},
                    ObjectPattern: {consistent: true},
                    ImportDeclaration: 'never',
                    ExportDeclaration: 'never',
                },
            ],
            'quotes': ['error', 'single', {avoidEscape: true, allowTemplateLiterals: true}],
            'quote-props': ['error', 'consistent-as-needed'],
            'arrow-parens': ['error', 'as-needed'],

            // USE SPECIFIC OF FUNCTIONS
            'curly': 'error',
            'no-lonely-if': 'off',
            'no-else-return': 'off',
            'array-callback-return': 'error',
            'no-console': 'off',
            'no-alert': 'error',
            'no-floating-decimal': 'error',
            'no-prototype-builtins': 'error',
            'no-restricted-globals': 'error',
            'radix': 'error',
            'consistent-return': 'error',
            'no-throw-literal': 'error',
            'no-array-constructor': 'error',
            'no-restricted-syntax': 'error',

            // VUE-SPECIFIC RULES
            'vue/max-len': [
                'error',
                {
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
                },
            ],
            'vue/html-indent': ['error', 4],
            'vue/html-quotes': ['error', 'double', {avoidEscape: true}],
            'vue/html-self-closing': 'error',
            'vue/html-closing-bracket-newline': [
                'error',
                {singleline: 'never', multiline: 'never'},
            ],
            'vue/html-closing-bracket-spacing': 'error',
            'vue/mustache-interpolation-spacing': ['error', 'never'],
            'vue/no-spaces-around-equal-signs-in-attribute': 'error',
            'vue/no-multi-spaces': 'error',
            'vue/no-unused-vars': 'error',
            'vue/no-unused-components': 'error',
            'vue/order-in-components': 'error',
            'vue/require-component-is': 'error',
            'vue/valid-v-for': 'error',
            'vue/no-template-key': 'error',
            'vue/require-v-for-key': 'error',
            'vue/no-use-v-if-with-v-for': 'error',
            'vue/no-parsing-error': 'error',
            'vue/prop-name-casing': 'error',
            'vue/attribute-hyphenation': 'error',
            'vue/attributes-order': 'error',
            'vue/v-on-style': 'error',
            'vue/v-bind-style': 'error',
            'vue/require-default-prop': 'error',
            'vue/require-prop-type-constructor': 'error',
            'vue/no-side-effects-in-computed-properties': 'error',

            'vue/comment-directive': 'off',
            'vue/first-attribute-linebreak': 'off',
            'vue/max-attributes-per-line': 'off',
            'vue/singleline-html-element-content-newline': 'off',
            'vue/multiline-html-element-content-newline': 'off',
            'vue/multi-word-component-names': 'off',
        },
    },
    {
        // disable standard max-len rules for vue files and use vue/max-len
        files: ['**/*.vue'],
        rules: {
            'max-len': 'off',
        },
    },
    {
        // some mjs files in the root use __dirname
        files: ['*.mjs'],
        languageOptions: {
            globals: {__dirname: true},
        },
    },
]
