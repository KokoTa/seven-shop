module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'standard',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  "parser": "babel-eslint",
  "globals": {
    "wx": true,
    "Page": true,
    "Component": true,
    "App": true
  },
  rules: {},
};
