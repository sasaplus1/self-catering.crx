module.exports = {
  env: {
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:node/recommended-script'],
  overrides: [
    {
      files: ['rollup.config.js'],
      rules: {
        'node/no-unpublished-import': 'off',
        'node/no-unsupported-features/es-syntax': 'off'
      }
    },
    {
      env: {
        browser: true,
        webextensions: true
      },
      files: ['src/**/*.js'],
      rules: {
        'node/no-unsupported-features/es-syntax': 'off',
        'node/no-unsupported-features/node-builtins': 'off'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  root: true
};
