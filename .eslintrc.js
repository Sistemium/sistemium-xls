// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
  },
  extends: ['airbnb-base'],
  plugins: [
  ],
  globals: {
    printjson: 'off',
  },
  settings: {
  },
  rules: {
    'no-use-before-define': ['error', { functions: false, classes: true }],
    'padded-blocks': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-mixed-operators': 'off',
    'no-multiple-empty-lines': ['error', { max: 2 }],
  }
};
