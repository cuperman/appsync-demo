// refer to: http://eslint.org/docs/user-guide/

module.exports = {
  plugins: [
    'react',
    'json'
  ],

  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],

  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 6,
    sourceType: 'module'
  },

  env: {
    browser: true,
    es6: true,
    node: true
  },

  rules: {
    'indent':     [ 'error', 2, { SwitchCase: 1 } ],
    'quotes':     [ 'error', 'single' ],
    'semi':       [ 'error', 'always' ]
  }
};
