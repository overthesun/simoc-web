// Defines the linting rules. 
// *Must restart server to update auto-linter*
//
// Base ESLint Rules: 
// https://eslint.org/docs/rules/ 

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential', // Rules list: https://eslint.vuejs.org/rules/
    '@vue/airbnb', // Rules list: https://github.com/airbnb/javascript
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  ignorePatterns: ["package-lock.json"],
  rules: {
    // SPACING
    'comma-spacing': 'error', // A space is required after ','
    indent: 'error', // Correct indentation
    'max-len': ['warn', {'code': 100}], // Lines must be shorter than 100 characters
    'no-trailing-spaces': 'error',
    'space-before-function-paren': 'error', // Missing space before function parentheses
    'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }], // Missing space before value for key 'components'
    'space-before-blocks': 'error', // Missing space before opening brace
    'keyword-spacing': ['error', { 'before': true, 'after': true }], // Expected space(s) after "catch"
    'no-multi-spaces': 'error', // Multiple spaces found before '// abort if th...'
    'spaced-comment': ['error', 'always'], // Expected exception block, space or tab after '//' in comment
    
    'object-curly-spacing': 'off', // Space between opening/closing curly bracket and content
    

    // VARIABLE & FUNCTION DECLARATION
    camelcase: 'warn', // Variables names to be camel case
    'vars-on-top': 'error', // All 'var' declarations must be at the top of the function scope
    'block-scoped-var': 'error', // The block-scoped-var rule generates warnings when variables are used outside of the block in which they were defined.
    'no-var': 'error', // Unexpected var, use let or const instead
    'no-multi-assign': 'error',
    'no-undef': 'error', // 'Chart' is not defined
    'no-redeclare': 'error', // totalHours is already defined
    'no-shadow': 'error', // 'value' is already declared in the upper scope

    'prefer-const': 'off', // If a variable is never reassigned, using the const declaration is better.
    'prefer-template': 'off', // Unexpected string concatenation
    'prefer-destructuring': 'off', // prefer-destructuring
    'dot-notation': 'off', // ["air_storage"] is better written in dot notation
    'no-param-reassign': 'off', // state.xx only assigned once
    'no-unused-vars': 'off', // All declared variables/imports must be used
    'object-shorthand': 'off', // This rule enforces the use of the shorthand syntax.
    'func-names': 'off', // This rule can enforce or disallow the use of named function expressions.
    

    // OPERATORS
    eqeqeq: 'error', // Triple-equal for comparison
    'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }], // Unary operator '++' used
    'no-mixed-operators': 'error', // Unexpected mix of '%' and '*'; Enclosing complex expressions by parentheses clarifies the developer's intention, which makes the code more readable.
    'space-infix-ops': 'error', // Operator '+' must be spaced
    
    'operator-linebreak': 'off', // '+' should be placed at the beginning of the line
    

    // SYNTAX
    'comma-dangle': ['error', 'always-multiline'], // Comma after final list item
    semi: 'never', // Semicolons
    'brace-style': ['error', '1tbs'], // Closing curly brace does not appear on the same line as the subsequent block
    'object-curly-newline': ['error', { // Expected a line break before this closing brace
      'ObjectExpression': 'always',
      'ObjectPattern': { 'multiline': true },
      'ImportDeclaration': 'never',
      'ExportDeclaration': 'never',
    }], 
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }], // quotes
    'arrow-parens': 'warn', // Expected parentheses around arrow function argument having a body with curly braces
    'quote-props': ['error', 'as-needed'], // Unnecessarily quoted property 'greenhouse_large' found
    

    // USE SPECIFIC OF FUNCTIONS
    'array-callback-return': ['error', {'checkForEach': false}], // Expected to return a value in arrow function
    'no-lonely-if': 'error', // Unexpected if as the only statement in an else block
    'no-else-return': 'error', // Unnecessary 'else' after 'return'
    'no-console': 'warn', // Prohibit console.log
    'no-prototype-builtins': 'error', // Do not call Object.prototype methods directly
    'no-restricted-globals': 'error', // Unexpected use of 'confirm'
    
    radix: 'off', // parseInt() must explicitly define base 10, base 16, etc
    'consistent-return': 'off', // require `return` statements to either always or never specify values
    'no-alert': 'off', // Unexpected alert
    'no-throw-literal': 'off', // It is considered good practice to only throw the Error object itself or an object using the Error object as base objects for user-defined exceptions.
    'no-array-constructor': 'off', // Use of the Array constructor to construct a new array is generally discouraged in favor of array literal notation because of the single-argument pitfall and because the Array global may be redefined.
    'no-restricted-syntax': 'off', // Don’t use iterators. Prefer JavaScript’s higher-order functions instead of loops like for-in or for-of.
    

    // VUE-SPECIFIC RULES
    'vue/no-unused-vars': 'error', // index is defined but never used
    'vue/require-v-for-key': 'error', // Elements in iteration expect to have 'v-bind:key' directives
    'vue/no-parsing-error': 'error', // Parsing error: unexpected-character-in-attribute-name
    'vue/no-side-effects-in-computed-properties': 'warn', // Unexpected side effect in "co2" computed property
    'vue/require-prop-type-constructor': 'warn', // The "canvasNumber" property should be a constructor
    'vue/no-use-v-if-with-v-for': 'warn', // The 'stor_group' variable inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'
    
    'vue/comment-directive': 'off', // clear
    
    
    // IMPORT
    'import/newline-after-import': 'error', // Expected 1 empty line after import statement not followed by another import
    'import/order': 'error', // `vuex` import should occur before import of `../components/configuration`
    'import/extensions': 'error', // Filetype extensions on imports
    'import/no-dynamic-require': 'warn', // Calls to require() should use string literals
    'import/no-extraneous-dependencies': 'warn', // 'lodash' should be listed in the project's dependencies
    
    'import/prefer-default-export': 'off', // Prefer default export
    'global-require': 'off', // Unexpected require() (rule is deprecated)
  },
};
