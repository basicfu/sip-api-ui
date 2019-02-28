const path = require('path');

module.exports = {
  root: true, // So parent files don't get applied
  env: {
    es6: true,
    browser: true,
    node: true,
    mocha: true,
  },
  extends: ['plugin:import/recommended', 'airbnb', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
  },
  plugins: ['babel', 'react-hooks'],
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, './webpack.config.js'),
      },
    },
  },
  rules: {
    // It's buggy
    'react/jsx-curly-brace-presence': 'off',
    'react/require-default-props': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/label-has-for': 'off', // deprecated
    'linebreak-style': 'off', // Doesn't play nicely with Windows

    // Strict, airbnb is using warn
    'no-console': 'error',
    'no-alert': 'error',
    'react/no-danger': 'error',
    'no-constant-condition': 'error',

    // Strict, airbnb is using off
    'react/no-direct-mutation-state': 'error',
    'react/sort-prop-types': 'error',

    // Airbnb use error
    'no-param-reassign': 'off',
    'no-prototype-builtins': 'off',
    'react/forbid-prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-find-dom-node': 'off',

    'jsx-a11y/no-autofocus': 'off', // We are a library, people do what they want.
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'prefer-destructuring': 'off', // Destructuring harm grep potential.
    'consistent-this': ['error', 'self'],
    'max-len': [
      'error',
      100,
      2,
      {
        ignoreUrls: true,
      },
    ], // airbnb is allowing some edge cases
    'import/no-extraneous-dependencies': 'off', // It would be better to enable this rule.
    'import/namespace': ['error', { allowComputed: true }],
    'import/order': [
      'error',
      {
        groups: [['index', 'sibling', 'parent', 'internal', 'external', 'builtin']],
        'newlines-between': 'never',
      },
    ],
    'react/jsx-handler-names': [
      'error',
      {
        // airbnb is disabling this rule
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }], // airbnb is using .jsx
  },
};
